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

      if (runRetrieve.status === "completed") {
        isCompleted = true;
      } else if (runRetrieve.status === "requires_action") {
        const requiredActions = runRetrieve.required_action.submit_tool_outputs.tool_calls;
        console.log(requiredActions);

        let toolsOutput = [];
        for (const action of requiredActions) {
          const funcName = action.function.name;
          const funcArguments = JSON.parse(action.function.arguments);

          if (funcName === "fetchParcelData") {
            const output = await fetchParcelData(funcArguments.id);
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
        console.log(runRetrieve.status)
        await delay(200);
      }
    }

    const messages = await connections.openai.beta.threads.messages.list(threadId);
    console.log(messages.data);
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

async function fetchParcelData(id) {
  // Simulated API call delay
  await delay(1000);

  // Simulated response
  if (id !== "123") {
    return {
      status: 'Parcel not found, invalid id'
    };
  } else {
    return {
      status: 'Shipment is being delivered in 2 days',
      deliveryTime: '12:00',
      address: 'Person\'s house address'
    };
  }
}
