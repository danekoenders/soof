import { RouteContext } from "gadget-server";

/**
 * Route handler for GET script
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  const javascriptCode = `
    function getChatbotId() {
      let script = document.getElementById('soof-ai');
      if (script) {
        let params = new URL(script.src).searchParams;
        return params.get('chatbotId');
      }
      return null;
    }

    function createChatButton() {
        let chatbotId = getChatbotId();
        if (!chatbotId) {
          console.error('Chatbot ID not found');
          return;
        }

        let chatButton = document.createElement('button');
        chatButton.id = 'chatButton';
        chatButton.innerHTML = 'Chat with us';
        chatButton.style = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999;';
        
        let chatContainer = document.createElement('div');
        chatContainer.id = 'chatContainer';
        chatContainer.style = 'position: fixed; bottom: 60px; right: 20px; z-index: 9998; display: none;';

        document.body.appendChild(chatButton);
        document.body.appendChild(chatContainer);

        chatButton.onclick = () => toggleIframe(chatbotId);
    }

    function createIframe(chatbotId) {
      let chatContainer = document.getElementById('chatContainer');
      if (!chatContainer.querySelector('iframe')) {
        let iframeSrc = \`${process.env.DOMAIN}/chat?chatbotId=\${chatbotId}\`;
        let iframe = document.createElement('iframe');
        iframe.src = iframeSrc;
        iframe.style = 'width: 100%; height: 300px; border: none;';
        chatContainer.appendChild(iframe);
      }
      chatContainer.style.display = 'block';
    }

    function toggleIframe(chatbotId) {
      let chatContainer = document.getElementById('chatContainer');
      let sessionToken = getSessionToken();

      if (!sessionToken) {
          retrieveAndSetToken(chatbotId);
          console.log('No session token found, retrieving one...');
      } else if (!chatContainer.querySelector('iframe')) {
          createIframe(chatbotId);
      } else {
          chatContainer.style.display = chatContainer.style.display === 'block' ? 'none' : 'block';
      }
    }

    function getSessionToken() {
      return document.cookie.split('; ').find(row => row.startsWith('sessionToken='));
    }

    function retrieveAndSetToken(chatbotId) {
      fetch('${process.env.DOMAIN}/chatToken?chatbotId=' + chatbotId, { method: 'GET', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          document.cookie = \`sessionToken=\${data.token};max-age=3600;path=/\`;
          createIframe(chatbotId);
        })
        .catch(error => console.error('Error fetching token:', error));
    }

    document.addEventListener('DOMContentLoaded', function () {
        createChatButton();
    });
  `;

  // Set Content-Type to 'application/javascript'
  await reply.type('application/javascript').send(javascriptCode);
}
