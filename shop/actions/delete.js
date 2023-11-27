import { deleteRecord, ActionOptions, DeleteShopActionContext } from "gadget-server";

/**
 * @param { DeleteShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
