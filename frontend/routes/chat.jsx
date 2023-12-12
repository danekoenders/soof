import React, { useState, useEffect } from "react";
import { useGlobalAction, useFindOne } from "@gadgetinc/react";
import { api } from "../api";
import Messages from "../components/chat/Messages";
import Input from "../components/chat/Input";
import "../components/chat/styles.css";
import Header from "../components/chat/Header";

export default function Chat() {
    const [chatbotId, setChatbotId] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [{ data: assistantData, fetching: assistantFetching, error: assistantError }, act] = useGlobalAction(api.useOpenAIAssistant);
    const [{ data: chatbotData, fetching: chatbotFetching, error: chatbotError }] = useFindOne(api.chatbot, chatbotId);

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
                }
            };

            window.addEventListener('message', receiveMessage);
            return () => window.removeEventListener('message', receiveMessage);
        }
    }, [chatbotData]);

    useEffect(() => {
        if (sessionToken) {
            // set a timeout of 1 second to make sure the session token is set
            setTimeout(() => {
                loadWelcomeMessage(chatbotData);
            }, 1000);
        }
    }, [sessionToken]);

    // Updates the message list including the welcome message with backgroundColor
    async function loadWelcomeMessage(chatbotData) {
        let welcomeMessage;

        if (chatbotData.name !== null) {
            welcomeMessage = `Welkom bij de chat! Ik ben ${chatbotData.name}, de virtuele assistent🤖 van deze webwinkel. Ik ben in staat de meeste vragen voor je te beantwoorden, stel gerust je eerste vraag of kies één van de suggesties hieronder!`
        } else {
            welcomeMessage = `Welkom bij de chat! Ik ben Soof, de virtuele assistent🤖 van deze webwinkel. Ik ben in staat de meeste vragen voor je te beantwoorden, stel gerust je eerste vraag of kies één van de suggesties hieronder!`
        }

        setMessages(prevMessages => [
            ...prevMessages,
            {
                text: welcomeMessage,
                sender: 'bot',
                loading: false,
                backgroundColor: chatbotData.secondaryColor,
                options: [
                    { label: "Waar is mijn bestelling?", value: "Waar is mijn bestelling?" },
                    { label: "Ik zoek een product", value: "Ik zoek een product" },
                    { label: "Hoe retourneer ik?", value: "Hoe retourneer ik?" }
                ],
                onOptionClick: handleOptionClick
            }
        ]);
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
                sessionToken: sessionToken,
                message: text,
            });

            if (response.error) {
                console.error('Error sending message:', response.error);
                setMessages(prevMessages => {
                    const updatedMessages = prevMessages.filter(msg => !msg.loading);
                    updatedMessages.push({
                        text: "Sorry, er ging iets mis. Probeer het later opnieuw.",
                        sender: 'bot',
                        loading: false,
                        backgroundColor: chatbotData.secondaryColor
                    });
                    return updatedMessages;
                });
                return;
            }

            if (response.options) {
                // Replace the loading message with the actual reply
                setMessages(prevMessages => {
                    const updatedMessages = prevMessages.filter(msg => !msg.loading);
                    updatedMessages.push({
                        text: response.data.reply,
                        sender: 'bot',
                        loading: false,
                        backgroundColor: chatbotData.secondaryColor,
                        options: [
                            { label: "Waar is mijn bestelling?", value: "Waar is mijn bestelling?" },
                            { label: "Optie 2", value: "Waar kan ik mijn bestelling vinden?" }
                        ],
                        onOptionClick: handleOptionClick
                    });
                    return updatedMessages;
                });
            } else {
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
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setMessages(prevMessages => prevMessages.filter(msg => !msg.loading));
        }
    };

    const handleOptionClick = (optionValue) => {
        send(optionValue); // Stuurt het geselecteerde optiewaarde als een bericht
    };

    if (!isAuthenticated) {
        return <div>Access Denied</div>;
    }

    return (
        <div className="chatbot">
            <Header backgroundColor={chatbotData.primaryColor} chatbotName={chatbotData.name} />
            <Messages messages={messages} />
            <Input onSend={send} />
        </div>
    );
}