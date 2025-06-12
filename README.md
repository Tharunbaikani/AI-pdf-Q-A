# AI Planet PDF Q&A Fullstack App

## Overview
This project is a fullstack application that allows users to upload PDF documents and ask questions about their content. The backend processes the PDFs, extracts text, and uses an LLM (OpenAI via LangChain) to answer questions. The frontend provides a modern chat interface.

---

## Features
- Upload PDF documents
- Extract and store PDF text
- Ask questions about uploaded PDFs
- Modern chat UI with avatars and alignment
- Real-time feedback and error handling
- Responsive design matching the provided Figma/screenshots

---

## Tech Stack
- **Frontend:** React.js
- **Backend:** FastAPI (Python)
- **NLP:** LangChain + OpenAI
- **Database:** SQLite
- **PDF Processing:** PyMuPDF
- **File Storage:** Local filesystem

---

## Project Structure
```
ai-planet-task/
├── backend/        # FastAPI backend
├── frontend/       # React frontend
├── README.md       # Project overview (this file)
├── ...
```

---

## Setup Instructions

### Backend
See [backend/README.md](backend/README.md) for detailed setup.

### Frontend
See [frontend/README.md](frontend/README.md) for detailed setup.

---

## Documentation
- [High/Low Level Design](HLD_LLD_Design_AI_Planet_Task.md)
- [Source Code Architecture](Source_Code_Architecture_AI_Planet_Task.md)

---

## Author
@tharunbaikani 