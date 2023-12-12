import { UseOpenAIAssistantGlobalActionContext } from "gadget-server";

/**
 * @param { UseOpenAIAssistantGlobalActionContext } context
 */

export const params = {
  sessionToken: { type: "string" },
  message: { type: "string" },
};

export async function run({ params, logger, api, connections }) {
  try {
    const assistant = await connections.openai.beta.assistants.retrieve(
      "asst_bylI2cuXABn6HF4I80yjifqN"
    );
    const session = await api.chatSession.findByToken(params.sessionToken);

    if (!isValidSessionToken(session)) {
      throw new Error("Invalid or expired session token");
    }

    const threadId = session.threadId;

    await connections.openai.beta.threads.messages.create(
      threadId,
      { role: "user", content: params.message }
    );

    const run = await connections.openai.beta.threads.runs.create(
      threadId,
      { assistant_id: assistant.id }
    );

    let runRetrieve;
    let isCompleted = false;

    while (!isCompleted) {
      runRetrieve = await connections.openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );

      if (runRetrieve.status === "completed") {
        isCompleted = true;
      } else if (runRetrieve.status === "requires_action") {
        const requiredActions = runRetrieve.required_action.submit_tool_outputs.tool_calls;

        let toolsOutput = [];
        for (const action of requiredActions) {
          const funcName = action.function.name;
          const funcArguments = JSON.parse(action.function.arguments);

          if (funcName === "fetchParcelData") {
            const output = await fetchParcelData(funcArguments.id, api);
            toolsOutput.push({
              tool_call_id: action.id,
              output: JSON.stringify(output),
            });
          } else if (funcName === "fetchProductByTitle") {
            const output = await fetchProductByTitle(params, funcArguments.title, api, logger);
            toolsOutput.push({
              tool_call_id: action.id,
              output: JSON.stringify(output),
            });
          } else {
            throw new Error("Unknown function");
          }
        }

        await connections.openai.beta.threads.runs.submitToolOutputs(
          threadId,
          run.id,
          { tool_outputs: toolsOutput }
        )
      } else if (runRetrieve.status === "failed") {
        throw new Error("Run failed");
      }

      if (!isCompleted) {
        await delay(200);
      }
    }

    const messages = await connections.openai.beta.threads.messages.list(threadId);
    const lastMessageForRun = messages.data
      .filter(message => message.run_id === run.id && message.role === "assistant")
      .pop();

    if (lastMessageForRun) {
      return {
        reply: lastMessageForRun.content[0].text.value,
      };
    }
  } catch (error) {
    logger.error('Error in processing: ', error);
    throw error;
  }
}

function isValidSessionToken(session) {
  if (!session.threadId) {
    logger.error('No threadId found for session');
    return false;
  }

  // Check if the token is expired
  const expirationTime = new Date(session.createdAt);
  expirationTime.setHours(expirationTime.getHours() + 1); // Session token expires in 1 hour

  const currentTime = new Date();
  return currentTime <= expirationTime; // Token is valid if current time is less than or equal to expiration time
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchParcelData(id, api) {
  if (id !== "123") {
    return {
      status: 'Parcel not found, invalid id'
    };
  } else {
    const result = await api.shop.fetchParcelData(id);
    return result;
  }
}

async function fetchProductByTitle(params, title, api, logger) {
  const session = await api.chatSession.findByToken(params.sessionToken);
  const shopId = session.shop;
  const shop = await api.shop.findById(shopId);
  const shopifyId = shop.shopifyShopId;
  try {
    const url = `${process.env.SHOPIFY_APP_DOMAIN}/product?title=${encodeURIComponent(title)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': process.env.SHOPIFY_APP_AUTH,
        "X-Shopify-Shop-Id": shopifyId,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    logger.error('Error fetching product: ', err);
  }
}
