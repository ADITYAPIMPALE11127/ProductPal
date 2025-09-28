// components/ChatInstructions.jsx
import React from "react";
import "../styles.css";

function ChatInstructions() {
  return (
    <div className="chat-instructions">
      <h2>How to Chat</h2>
      <ul>
        <li>Ask about a product by its exact name: <strong>"C30 White Candles"</strong></li>
        <li>Or ask: <strong>"Tell me about C30 White Candles"</strong></li>
        <li>Search by category: <strong>"candles"</strong> or <strong>"show me candles"</strong></li>
        <li>Use plural or singular names: "brooms", "floor wipers", etc.</li>
        <li>Only text-based queries are supported; images are not accepted yet.</li>
      </ul>
    </div>
  );
}

export default ChatInstructions;
