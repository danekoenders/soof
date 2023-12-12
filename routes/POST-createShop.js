import { RouteContext } from "gadget-server";

export default async function route({ request, reply, api, logger, connections }) {
    // TODO: Create this whole function to create a shop in the database

    await reply.type("application/json").send();
}

function isOriginAllowed(reply, request) {
    const allowedOrigin = process.env.SOOF_APP_DOMAIN;
    const Authorization = request.headers.authorization;

    if (!Authorization === process.env.AUTHORIZATION) {
        return false;
    }

    if (request.headers.origin === allowedOrigin) {
      // Set CORS headers
      reply.headers({
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Headers": "Authorization, X-Shopify-Shop-Id",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
      });

      return true;
  } else {
      return false;
  }
}