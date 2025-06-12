# AI Planet PDF Q&A Backend

## Overview
This is the backend for the AI Planet PDF Q&A application. It allows users to upload PDF documents and ask questions about their content using an LLM (OpenAI via LangChain).

---

## Features
- Upload PDF documents
- Extract and store PDF text
- Ask questions about uploaded PDFs
- Uses OpenAI LLM for Q&A
- Stores PDF metadata in SQLite

---

## Setup Instructions

1. **Clone the repository and navigate to the backend folder:**
   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate   # On Windows
   # or
   source venv/bin/activate   # On Mac/Linux
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up environment variables:**
   - Create a `.env` file in the backend folder with:
     ```
     OPENAI_API_KEY=your-openai-api-key
     ```
5. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at: `http://localhost:8000`

---

## API Endpoints

### `POST /upload_pdf`
- Upload a PDF file.
- **Request:** multipart/form-data, field: `file`
- **Response:** `{ id, filename, upload_date }`

### `POST /ask_question`
- Ask a question about a PDF.
- **Request:** JSON `{ "pdf_id": int, "question": str }`
- **Response:** `{ "answer": str }`

---

## Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required for LLM Q&A)

---

## Architecture
- **FastAPI** for API endpoints
- **SQLite** for PDF metadata
- **PyMuPDF** for PDF text extraction
- **LangChain/OpenAI** for Q&A over PDF text
- **Local file storage** for uploaded PDFs

---

## Notes
- Make sure your `.env` file is present and correct before starting the server.
- The backend must be running for the frontend to function.
- For large PDFs, only the first 6000 characters are sent to the LLM due to context limits. 