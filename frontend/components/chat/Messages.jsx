import React, { useEffect, useRef } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

export default function Messages({ messages }) {
  const el = useRef(null);

  useEffect(() => {
    el.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((message, index) => {
        if (message.sender === 'bot') {
          return <BotMessage
            key={index}
            text={message.text}
            loading={message.loading}
            backgroundColor={message.backgroundColor}
            options={message.options}
            onOptionClick={message.onOptionClick}
          />;
        } else if (message.sender === 'user') {
          return <UserMessage key={index} text={message.text} />;
        }
      })}
      <div id="el" ref={el} />
    </div>
  );
}