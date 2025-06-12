# AI Planet PDF Q&A Frontend

## Overview
This is the frontend for the AI Planet PDF Q&A application. It allows users to upload PDFs, ask questions, and view answers in a modern chat interface.

---

## Features
- Upload PDF documents
- Ask questions about uploaded PDFs
- Modern chat UI with avatars and alignment
- Real-time feedback and error handling
- Responsive design matching the provided Figma/screenshots

---

## Setup Instructions

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will be available at: `http://localhost:3000`

---

## Usage
- Click "Upload PDF" to select and upload a PDF file.
- Ask questions in the chat input. The agent will answer based on the PDF content.
- User messages appear on the right; agent messages (with avatar) on the left.
- The selected PDF name is shown in the header.

---

## Connecting to the Backend
- The frontend expects the backend to be running at `http://localhost:8000`.
- Make sure to start the backend server before using the frontend.
- You can change the backend URL in `src/App.js` if needed.

---

## Notes
- Place your logo and avatar images in the `public` folder as needed (e.g., `ai-planet-header.png`, `agent-chat.png`).
- The UI is designed to match the provided reference exactly.
- For any issues, check the browser console and backend logs for errors. 