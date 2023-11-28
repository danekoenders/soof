import { applyParams, save, ActionOptions, CreateShopActionContext } from "gadget-server";
import { v4 as uuidv4 } from 'uuid'; // Zorg ervoor dat je uuid importeert

/**
 * @param { CreateShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  // Pas de parameters toe op het record, inclusief shopifyShopId
  applyParams(params, record);

  // Genereer een unieke sleutel voor de shop
  record.privateKey = uuidv4();

  await save(record);
};

/**
 * @param { CreateShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Je logica na succesvolle creatie kan hier
  // Bijvoorbeeld, log de unieke sleutel en shopifyShopId
  logger.info(`Shop gecreëerd voor gebruiker ${record.userIdId}`);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create"
};
