import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useGlobalAction } from "@gadgetinc/react";
import { api } from "../api";
import BotMessage from "../components/chat/BotMessage";
import UserMessage from "../components/chat/UserMessage";
import Messages from "../components/chat/Messages";
import Input from "../components/chat/Input";
import API from "../components/chat/ChatbotAPI";
import "../components/chat/styles.css";
import Header from "../components/chat/Header";

export default function () {
    const [threadId, setThreadId] = useState();
    const [{ data, fetching, error }, act] = useGlobalAction(api.useOpenAIAssistant);
    const [messages, setMessages] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [chatbotId, setChatbotId] = useState("");

    useEffect(() => {
        // Extract chatbotId from URL
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('chatbotId');
        setChatbotId(id);

        checkAuthentication().then(isAuth => {
            setIsAuthenticated(isAuth);
            if (isAuth) {
                loadWelcomeMessage();
            }
        });
    }, []);

    useEffect(() => {
        if (data && data.reply) {
        setMessages(prevMessages => [
            ...prevMessages,
            <BotMessage key={prevMessages.length + 1} text={data.reply} />
        ]);

        setThreadId(data.threadId);
        }
    }, [data]);

    function getSessionToken() {
        return document.cookie.split('; ').find(row => row.startsWith('sessionToken='));
    }

    // Authentication check function
    const checkAuthentication = async () => {
        let sessionToken = getSessionToken();
        if (!sessionToken) {
          return false;
        }
        return sessionToken != null;
    };

    async function loadWelcomeMessage() {
        try {
            const welcomeMessage = await API.GetChatbotResponse("hi");
            setMessages([<BotMessage key="0" text={welcomeMessage} />]);
        } catch (error) {
            console.error('Error loading welcome message:', error);
        }
    }

    const send = async text => {
        try {
        // Voeg direct het bericht van de gebruiker toe
        setMessages(prevMessages => [
            ...prevMessages,
            <UserMessage key={prevMessages.length + 1} text={text} />
        ]);

        // Verstuur het bericht naar de server
        await act({
            ...(threadId && { threadId: threadId }),
            chatbot: chatbotId,
            sessionToken: getSessionToken(),
            message: text,
        });

        // Het antwoord van de bot wordt toegevoegd in de useEffect die afhankelijk is van 'data'
        } catch (err) {
        console.error('Error sending message:', err);
        }
    };

    if (!isAuthenticated) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="chatbot">
        <Header />
        <Messages messages={messages} />
        <Input onSend={send} />
        </div>
    );
}
