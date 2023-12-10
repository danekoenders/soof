const API = {
  GetChatbotResponse: async message => {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        if (message === "start") resolve("Welkom bij de chat!");
        else resolve("echo : " + message);
      }, 2000);
    });
  }
};

export default API;
