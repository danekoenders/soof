import React from "react";

export default function BotMessage({ text, loading, backgroundColor, options, onOptionClick }) {
  const renderOptions = (options) => {
    return options.map((option, index) => (
      <button key={index} onClick={() => onOptionClick(option.value)}>
        {option.label}
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="message-container-bot">
        <img src="/frontend/assets/images/soof-bot.png" alt="Bot" className="bot-icon" />
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
      <div className="message-container-bot">
        <img src="/frontend/assets/images/soof-bot.png" alt="Bot" className="bot-icon" />
        <div className="bot-message-wrapper">
          <div className="bot-message" style={{ backgroundColor: backgroundColor }}>
            {text}
          </div>
          {options &&
            <div className="bot-options">
              {renderOptions(options)}
            </div>
          }
        </div>
      </div>
    );
  }
}