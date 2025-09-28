// App.jsx
import { useState, useEffect, useRef } from "react";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import ChatInstructions from "./components/ChatInstructions";
import "./styles.css";

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! Which product would you like to enquire about?", type: "bot", images: [] }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (msg) => {
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { text: msg, type: "user", images: [] }]);
    setIsTyping(true);

    try {
      const response = await fetch("https://productpal-backend.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();

      const botMessage = {
        text: data?.text || "Sorry, I could not generate a response.",
        images: data?.images || [],
        type: "bot"
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching backend:", error);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: "Sorry, something went wrong. Please try again.", type: "bot", images: [] }
        ]);
        setIsTyping(false);
      }, 500);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <i className="fas fa-robot"></i>
          <h1>Product Enquiry Bot</h1>
        </div>
      </header>

      {/* Main Content: Chat + Instructions */}
      <div className="main-content">
        {/* Chat Section */}
        <div className="chat-section">
          <div className="messages">
            {messages.map((msg, i) => (
              <ChatBubble key={i} text={msg.text} images={msg.images} type={msg.type} />
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-bubble">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <ChatInput onSend={handleSend} />
          </div>
        </div>

        {/* Instructions Sidebar */}
        <ChatInstructions />
      </div>
    </div>
  );
}

export default App;
