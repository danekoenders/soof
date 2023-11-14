import { UseOpenAIAssistantGlobalActionContext } from "gadget-server";

/**
 * @param { UseOpenAIAssistantGlobalActionContext } context
 */

export const params = {
  threadId: { type: "string" },
  message: { type: "string" },
};

export async function run({ params, logger, api, connections }) {
  try {
    const assistant = await connections.openai.beta.assistants.retrieve(
      "asst_98Vs14PvAv9PIreTzZAggoYv"
    );

    let threadId;
    if (params.threadId) {
      await connections.openai.beta.threads.messages.create(
        params.threadId,
        { role: "user", content: params.message }
      );
      threadId = params.threadId;
    } else {
      const newThread = await connections.openai.beta.threads.create(
        { messages: [{ role: "user", content: params.message }] }
      );
      threadId = newThread.id;
    }

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

      isCompleted = runRetrieve.completed_at !== null;
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
        threadId: threadId,
      };
    }
  } catch (error) {
    logger.error('Error in processing: ', error);
    throw error;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
