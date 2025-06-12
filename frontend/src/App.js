import React, { useRef, useState } from 'react';
import './App.css';

const BACKEND_URL = 'http://localhost:8000';

function App() {
  const [pdfName, setPdfName] = useState(null);
  const [pdfId, setPdfId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfName(file.name);
      setUploading(true);
      setError(null);
      setPdfId(null);
      setMessages([]);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${BACKEND_URL}/upload_pdf`, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || 'Upload failed');
        }
        const data = await res.json();
        setPdfId(data.id);
      } catch (err) {
        setError(err.message);
        setPdfName(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || !pdfId || loadingAnswer) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoadingAnswer(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/ask_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdf_id: pdfId, question: input }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to get answer');
      }
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.answer }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'ai', text: `Error: ${err.message}` }]);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="main-bg">
      <header className="header">
        <div className="logo-section">
          <img src="/ai-planet-logo.png" alt="AI Planet Header" className="logo-header" />
        </div>
        <div className="header-actions">
          {pdfName && <span className="demo-pdf">{pdfName}</span>}
          <button className="upload-btn" onClick={handleUploadClick} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload PDF'}
          </button>
          <input type="file" accept="application/pdf" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
        </div>
      </header>
      <div className="chat-container">
        {error && <div style={{ color: 'red', margin: '16px 32px 0 32px' }}>{error}</div>}
        <div className="chat-area">
          {messages.map((msg, idx) => (
            msg.sender === 'ai' ? (
              <div key={idx} className="chat-bubble-row left">
                <img src="/agent-chat.png" alt="ai avatar" className="ai-avatar" />
                <div className={`chat-bubble ai`}>{msg.text}</div>
              </div>
            ) : (
              <div key={idx} className="chat-bubble-row right">
                <div className={`chat-bubble user`}>{msg.text}</div>
              </div>
            )
          ))}
          {loadingAnswer && (
            <div className="chat-bubble-row left">
              <img src="/agent-chat.png" alt="ai avatar" className="ai-avatar" />
              <div className="chat-bubble ai">Thinking...</div>
            </div>
          )}
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Send a message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={!pdfId || uploading || loadingAnswer}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!pdfId || uploading || loadingAnswer || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
      <footer className="footer">@tharunbaikani</footer>
    </div>
  );
}

export default App;
