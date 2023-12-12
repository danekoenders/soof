import React, { useState, useEffect } from "react";
import { useGlobalAction, useFindOne } from "@gadgetinc/react";
import { api } from "../api";
import BotMessage from "../components/chat/BotMessage";
import Messages from "../components/chat/Messages";
import Input from "../components/chat/Input";
import API from "../components/chat/ChatbotAPI";
import "../components/chat/styles.css";
import Header from "../components/chat/Header";

export default function Chat() {
    const [threadId, setThreadId] = useState(null);
    const [chatbotId, setChatbotId] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [{ data: assistantData, fetching: assistantFetching, error: assistantError }, act] = useGlobalAction(api.useOpenAIAssistant);
    const [{ data: chatbotData, fetching: chatbotFetching, error: chatbotError }] = useFindOne(api.useFindOneChatbot, chatbotId);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('chatbotId');
        setChatbotId(id);
    }, []);
    
    useEffect(() => {
        if (chatbotData) {
            // Process chatbot data and request session token from parent window
            const domain = chatbotData.domain;
            window.parent.postMessage('requestSessionToken', domain);

            const receiveMessage = event => {
                if (event.origin === domain) {
                    const tokenString = event.data.sessionToken;
                    const token = tokenString.split('=')[1]; // Extracts the token value

                    setSessionToken(token);
                    setIsAuthenticated(token != null);

                    if (token) {
                        loadWelcomeMessage();
                    }
                }
            };

            window.addEventListener('message', receiveMessage);
            return () => window.removeEventListener('message', receiveMessage);
        }
    }, [chatbotData]);

    useEffect(() => {
        if (assistantData && assistantData.threadId) {
            setThreadId(assistantData.threadId);
        }
    }, [assistantData]);

    // Updates the message list including the welcome message with backgroundColor
    async function loadWelcomeMessage() {
        try {
            const welcomeMessage = await API.GetChatbotResponse("start", sessionToken);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: welcomeMessage,
                    sender: 'bot',
                    loading: false,
                    backgroundColor: chatbotData.secondaryColor
                }
            ]);
        } catch (error) {
            console.error('Error loading welcome message:', error);
        }
    }

    const send = async (text) => {
        const trimmedText = text.trim();
        if (!trimmedText) return;

        const newMessages = [...messages];
        newMessages.push({ text: trimmedText, sender: 'user', loading: false });

        // Only add bot's loading message if there's no other loading message
        if (!newMessages.some(message => message.loading)) {
            newMessages.push({ text: '...', sender: 'bot', loading: true, backgroundColor: chatbotData.secondaryColor });
        }

        setMessages(newMessages);

        try {
            const response = await act({
                ...(threadId && { threadId }),
                chatbot: chatbotId,
                sessionToken: sessionToken,
                message: text,
            });

            if (response.error) {
                console.error('Error sending message:', response.error);
                setMessages(prevMessages => prevMessages.filter(msg => !msg.loading));
                return;
            }

            // Replace the loading message with the actual reply
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.filter(msg => !msg.loading);
                updatedMessages.push({
                    text: response.data.reply,
                    sender: 'bot',
                    loading: false,
                    backgroundColor: chatbotData.secondaryColor
                });
                return updatedMessages;
            });
        } catch (err) {
            console.error('Error sending message:', err);
            setMessages(prevMessages => prevMessages.filter(msg => !msg.loading));
        }
    };

    if (!isAuthenticated) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="chatbot">
            <Header backgroundColor={chatbotData?.primaryColor} />
            <Messages messages={messages} />
            <Input onSend={send} />
        </div>
    );
}