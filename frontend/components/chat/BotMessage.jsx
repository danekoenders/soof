import React from "react";

export default function BotMessage({ text, loading, backgroundColor }) {
  if (loading) {
    return (
      <div className="message-container">
        <div className="bot-message" style={{ backgroundColor: backgroundColor }}>
          <div className="typing-indicator">
            <span className="typing-indicator-dot"></span>
            <span className="typing-indicator-dot"></span>
            <span className="typing-indicator-dot"></span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="message-container">
        <div className="bot-message" style={{ backgroundColor: backgroundColor }}>
          {text}
        </div>
      </div>
    );
  }
}
