window.addEventListener('message', event => {
  if (event.origin === "{{DOMAIN}}") {
    if (event.data === "requestSessionToken") {
      const sessionToken = getSessionToken(); // Function to retrieve session token
      event.source.postMessage({ sessionToken: sessionToken }, event.origin);
    }
  }
});

function getSessionToken() {
  return document.cookie.split('; ').find(row => row.startsWith('sessionToken='));
}

function createChatButton() {
  let chatbotId = "{{CHATBOT_ID}}";
  if (!chatbotId) {
      console.error('Chatbot ID not found');
      return;
  }

  let chatButton = document.createElement('button');
  chatButton.id = 'chatButton';
  chatButton.innerHTML = '<i class="material-icons" style="font-size:28px;color:white;">chat</i>';
  chatButton.style = 'position: fixed; bottom: 26px; right: -100px; z-index: 9999; background-color: {{CHATBOT_PRIMARY_COLOR}}; border-radius: 100px; border: none; padding: 18px 16px; padding-bottom: 12px; transition: right 0.5s, transform 0.3s; cursor: pointer;';

  let chatContainer = document.createElement('div');
  chatContainer.id = 'chatContainer';
  chatContainer.style = 'position: fixed; bottom: 100px; right: 26px; z-index: 9998; display: none; width: 400px; height: 600px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); background-color: white; opacity: 0; transition: opacity 0.5s;';

  document.body.appendChild(chatButton);
  document.body.appendChild(chatContainer);

  chatButton.onmouseover = () => chatButton.style.transform = 'scale(1.1)';
  chatButton.onmouseout = () => chatButton.style.transform = 'scale(1)';

  chatButton.onclick = () => {
      toggleChatContainer(chatbotId, chatButton);
  };

  setTimeout(() => {
      chatButton.style.right = '26px';
  }, 100);
}

function toggleChatContainer(chatbotId, chatButton) {
  let chatContainer = document.getElementById('chatContainer');
  let isChatOpen = chatContainer.style.display === 'block';

  if (!isChatOpen) {
      chatContainer.style.display = 'block';
      chatContainer.style.opacity = 1; // Fade in
      chatButton.innerHTML = '<i class="material-icons" style="font-size:28px;color:white;">close</i>';
      retrieveAndSetToken(chatbotId); // Start the token retrieval and iframe loading process
  } else {
      chatContainer.style.opacity = 0; // Fade out
      setTimeout(() => { chatContainer.style.display = 'none'; }, 500); // Wait for fade-out to complete
      chatButton.innerHTML = '<i class="material-icons" style="font-size:28px;color:white;">chat</i>';
  }
}
function createIframe(chatbotId) {
  let chatContainer = document.getElementById('chatContainer');
  if (!chatContainer.querySelector('iframe')) {
      let iframeSrc = `{{DOMAIN}}/chat?chatbotId=${chatbotId}`;
      let iframe = document.createElement('iframe');
      iframe.src = iframeSrc;
      iframe.style = 'width: 100%; height: 100%; border: none; border-radius: 15px;';
      chatContainer.appendChild(iframe);
  }
}

function getSessionToken() {
  return document.cookie.split('; ').find(row => row.startsWith('sessionToken='));
}

function retrieveAndSetToken(chatbotId) {
  const existingToken = getSessionToken();
  if (!existingToken) {
    fetch('{{DOMAIN}}/chatToken?chatbotId=' + chatbotId, { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        document.cookie = `sessionToken=${data.token};max-age=3600;path=/`;
        createIframe(chatbotId);
      })
      .catch(error => console.error('Error fetching token:', error));
  } else {
    createIframe(chatbotId);
  }
}    

function loadContent() {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  link.rel = 'stylesheet';
  link.onload = () => createChatButton(); // Call createChatButton after icons are loaded
  document.head.appendChild(link);
}

document.addEventListener('DOMContentLoaded', function () {
  loadContent();
});