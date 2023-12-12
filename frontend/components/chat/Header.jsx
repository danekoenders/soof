import React from "react";

export default function Header(props) {

  return (
    <div
      className="header"
      style={{ backgroundColor: props.backgroundColor }}
    >
      <span>Klantenservice</span>
      <p>
        Je chat nu met {props.chatbotName || 'Soof'}!
      </p>
    </div>
  );
}
