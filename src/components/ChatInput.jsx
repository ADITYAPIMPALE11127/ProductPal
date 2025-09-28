import { useState } from "react";
import "./ChatInput.css";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    onSend(trimmedMessage);
    setMessage("");
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        className="input-field"
        placeholder="Type your product query..."
        value={message}
        autoFocus
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="send-button"
        onClick={handleSend}
        disabled={!message.trim()}
      >
        Ask
      </button>
    </div>
  );
};

export default ChatInput;
