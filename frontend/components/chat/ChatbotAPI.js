const API = {
  GetChatbotResponse: async message => {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (message === "hi") resolve("Welcome bij de chat!");
        else resolve("echo : " + message);
      }, 2000);
    });
  }
};

export default API;
