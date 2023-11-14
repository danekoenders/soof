import { Client } from "@gadget-client/soof-app";

export const api = new Client({ environment: window.gadgetConfig.environment });
