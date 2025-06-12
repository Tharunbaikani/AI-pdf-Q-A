from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.responses import JSONResponse
import os
import shutil
import fitz  # PyMuPDF
from sqlalchemy.orm import Session
from database import init_db, SessionLocal
import models
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.docstore.document import Document
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
default_response = {"status": "ok"}
@app.get("/")
def read_root():
    return default_response 

@app.on_event("startup")
def on_startup():
    init_db()
    load_dotenv()

UPLOAD_DIR = "uploaded_pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload_pdf")
def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Extract text
    try:
        doc = fitz.open(file_location)
        text = "\n".join(page.get_text() for page in doc)
    except Exception as e:
        os.remove(file_location)
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")
    # Store in DB
    db: Session = SessionLocal()
    pdf_doc = models.PDFDocument(
        filename=file.filename,
        file_path=file_location,
        extracted_text=text
    )
    db.add(pdf_doc)
    db.commit()
    db.refresh(pdf_doc)
    db.close()
    return JSONResponse({"id": pdf_doc.id, "filename": pdf_doc.filename, "upload_date": str(pdf_doc.upload_date)}) 

@app.post("/ask_question")
def ask_question(pdf_id: int = Body(...), question: str = Body(...)):
    db: Session = SessionLocal()
    pdf_doc = db.query(models.PDFDocument).filter(models.PDFDocument.id == pdf_id).first()
    db.close()
    if not pdf_doc:
        raise HTTPException(status_code=404, detail="PDF not found.")
    if not pdf_doc.extracted_text:
        raise HTTPException(status_code=400, detail="No text extracted from PDF.")
    # Use LangChain to answer with a refined prompt
    try:
        llm = OpenAI(temperature=0)
        context = pdf_doc.extracted_text[:6000]  # Truncate to fit model context window
        prompt = (
            "You are an expert assistant. Use ONLY the following PDF content to answer the user's question. "
            "If the answer is not in the PDF, say 'The answer is not available in the document.'\n\n"
            f"PDF Content:\n{context}\n\n"
            f"Question: {question}\nAnswer:"
        )
        answer = llm(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NLP processing failed: {str(e)}")
    return {"answer": answer} 