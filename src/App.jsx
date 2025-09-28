import { useState, useEffect, useRef } from "react";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import "./styles.css";

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! Which product would you like to enquire about?", type: "bot", images: [] }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send user message to backend API
  const handleSend = async (msg) => {
    if (!msg.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: msg, type: "user", images: [] }]);

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await fetch("https://productpal-backend.onrender.com/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "test" })
}).then(res => res.text()).then(console.log)


      const data = await response.json();

      // Ensure backend returns { text: "...", images: ["..."] }
      const botMessage = {
        text: data.text || "Sorry, I could not generate a response.",
        images: data.images || [],
        type: "bot"
      };

      // Simulate typing delay
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: "Sorry, something went wrong. Please try again.", type: "bot", images: [] }
        ]);
        setIsTyping(false);
      }, 500);
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <i className="fas fa-robot"></i>
          <h1>Product Enquiry Bot</h1>
        </div>
      </header>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              text={msg.text}
              images={msg.images} // Pass images to ChatBubble
              type={msg.type}
            />
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
      </div>

      {/* Input Area */}
      <div className="input-container">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
