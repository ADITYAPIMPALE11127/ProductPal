// components/ChatBubble.jsx
import React from "react";
import "../styles.css"; // Create or update this CSS file

function ChatBubble({ text, images, type }) {
  // Define avatar image paths or URLs
  const userAvatar = "../../public/assets/user_bot/Profile-Avatar-PNG.png"; // Replace with your user avatar image path or URL
  const botAvatar = "../../public/assets/user_bot/12239772.png";   // Replace with your bot avatar image path or URL

  return (
    <div className={`chat-bubble-wrapper ${type}`}>
      <div className={`chat-bubble-container ${type}`}>
        {/* Avatar */}
        <img
          src={type === "user" ? userAvatar : botAvatar}
          alt={type === "user" ? "User" : "Bot"}
          className="avatar"
        />
        {/* Message Content */}
        <div className="chat-bubble">
          <div className="text">{text}</div>
          {images && images.length > 0 && (
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