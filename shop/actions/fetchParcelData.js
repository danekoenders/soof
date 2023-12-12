import { applyParams, save, ActionOptions, FetchParcelDataShopActionContext, DefaultEmailTemplates } from "gadget-server";

/**
 * @param { FetchParcelDataShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
  
  return {
    result: "ok"
  }
};

/**
 * @param { FetchParcelDataShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, emails }) {
  // create your custom email template
  const CustomTemplate = `
     <!DOCTYPE html>
      <html lang="en">
       <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Information over je levering van <%= shopName %></title>
       </head>
       <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 50px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
         <h1 style="font-size: 24px; margin-bottom: 20px;"><%= shopName %></h1>
          <p>Je pakket wordt over 3 dagen bezorgd.</p><br>
          <br>
          <p>Op adres:</p><br>
          <p>Voorschoterlaan 141</p>
        </div>
       </body>
      </html>`;

  await emails.sendMail({
    to: 'dane.koenders@gmail.com',
    subject: `Information over je levering van ${record.name}`,
    // Pass your custom template
    // The default template is an EJS string
    html: DefaultEmailTemplates.renderEmailTemplate(CustomTemplate, {
      shopName: record.name,
    }),
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  returnType: true,
};
