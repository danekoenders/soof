import { RouteContext } from "gadget-server";

export default async function route({ request, reply, api, logger, connections }) {

    // Check the origin and only proceed if it's from an accepted domain
    const origin = request.headers.origin;
    if (!await isOriginAllowed(origin, reply, api)) {
        return await reply.status(403).send({ error: "Unauthorized" });
    }

    const chatbotId = request.query.chatbotId;
    if (!await isChatbotAllowed(chatbotId, api)) {
        return await reply.status(403).send({ error: "Unauthorized" });
    }

    // Generate a session token (implement this logic based on your needs)
    const sessionToken = generateSessionToken();

    // Send the token back to the client
    await reply.type("application/json").send({ token: sessionToken, chatbotId });
}

// Helper functions: isOriginAllowed and generateSessionToken
async function isOriginAllowed(origin, reply, api) {
    const chatbots = await api.chatbot.findMany({
        filter: {
            domain: {
            equals: origin
            }
        }
    });

    if (!chatbots || chatbots.length === 0) {
        return false;
    } else {
        const allowedOrigin = chatbots[0].domain;

        // Set cors headers
        reply.headers({
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
        });

        return true
    }
}

async function isChatbotAllowed(chatbotId, api) {
    const chatbot = await api.chatbot.findOne(chatbotId)

    if (!chatbot) {
        return false;
    } else {
        return true
    }
}

function generateSessionToken() {
    return "test-token"
}