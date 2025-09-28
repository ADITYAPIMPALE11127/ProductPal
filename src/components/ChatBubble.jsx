// components/ChatBubble.jsx
import React from "react";
import "../styles.css";

function ChatBubble({ text, images, type }) {
  const userAvatar = "/assets/user_bot/Profile-Avatar-PNG.png"; 
  const botAvatar = "/assets/user_bot/12239772.png";

  return (
    <div className={`chat-bubble-wrapper ${type}`}>
      <div className={`chat-bubble-container ${type}`}>
        <img
          src={type === "user" ? userAvatar : botAvatar}
          alt={type === "user" ? "User" : "Bot"}
          className="avatar"
        />
        <div className="chat-bubble">
          <div className="text">{text}</div>
          {images?.length > 0 && (
            <div className="images">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Attached image ${index + 1}`}
                  className="message-image"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
