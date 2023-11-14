import React, { useState, useEffect } from "react";

export default function BotMessage({ text }) {
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadMessage() {
      setLoading(false);
      setMessage(text);
    }
    loadMessage();
  }, [text]);

  return (
    <div className="message-container">
      <div className="bot-message">{isLoading ? "..." : message}</div>
    </div>
  );
}
