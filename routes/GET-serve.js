import { RouteContext } from "gadget-server";

/**
 * Route handler for GET script
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  // Get chatbotId from query parameters
  const chatbotId = request.query.chatbotId;
  const origin = request.headers.referer;
  const chatbot = await api.chatbot.findOne(chatbotId);

  // If chatbotId is not provided, return 400 Bad Request
  if (!chatbot) {
    return reply.status(400).send({ error: "Bad Request" });
  }

  if (!isOriginAllowed(origin, reply, chatbot, logger)) {
    return await reply.status(403).send({ error: "Unauthorized" });
  }

  function isOriginAllowed(origin, reply, chatbot, logger) {
    if (!chatbot || !chatbot.domain) {
      logger.error('No domain found for chatbot');
      return false;
    }

    if (origin.includes(chatbot.domain)) {
      const allowedOrigin = chatbot.domain;

      // Set CORS headers
      reply.headers({
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      });

      return true;
    } else {
      return false;
    }
  }

  let javascriptCode = `
    const _0xc111f2=_0x4a8e;function _0x4a8e(_0x24e6e6,_0x2a0a6d){const _0x34e859=_0x34e8();return _0x4a8e=function(_0x4a8e63,_0x1fce38){_0x4a8e63=_0x4a8e63-0x1ba;let _0x2aa1b5=_0x34e859[_0x4a8e63];return _0x2aa1b5;},_0x4a8e(_0x24e6e6,_0x2a0a6d);}(function(_0x2a385b,_0x4acf9f){const _0xb33540=_0x4a8e,_0x50398d=_0x2a385b();while(!![]){try{const _0x5d4540=parseInt(_0xb33540(0x1e8))/0x1+parseInt(_0xb33540(0x1cf))/0x2+parseInt(_0xb33540(0x1e1))/0x3+parseInt(_0xb33540(0x1d9))/0x4*(parseInt(_0xb33540(0x1bb))/0x5)+-parseInt(_0xb33540(0x1f1))/0x6+-parseInt(_0xb33540(0x1e6))/0x7*(-parseInt(_0xb33540(0x1be))/0x8)+parseInt(_0xb33540(0x1cc))/0x9*(-parseInt(_0xb33540(0x1df))/0xa);if(_0x5d4540===_0x4acf9f)break;else _0x50398d['push'](_0x50398d['shift']());}catch(_0xb53fcf){_0x50398d['push'](_0x50398d['shift']());}}}(_0x34e8,0x899aa),window[_0xc111f2(0x1c9)](_0xc111f2(0x1dc),_0x208fc9=>{const _0x4d3353=_0xc111f2;if(_0x208fc9['origin']===_0x4d3353(0x1c1)){if(_0x208fc9[_0x4d3353(0x1f3)]==='requestSessionToken'){const _0x2eed2d=getSessionToken();_0x208fc9[_0x4d3353(0x1d3)][_0x4d3353(0x1eb)]({'sessionToken':_0x2eed2d},_0x208fc9[_0x4d3353(0x1de)]);}}}));function getSessionToken(){const _0x17c0e9=_0xc111f2;return document[_0x17c0e9(0x1ea)]['split'](';\x20')[_0x17c0e9(0x1e0)](_0x4bf565=>_0x4bf565[_0x17c0e9(0x1da)](_0x17c0e9(0x1ec)));}function _0x34e8(){const _0xeebda9=['appendChild','cookie','postMessage','sessionToken=','onclick','innerHTML','position:\x20fixed;\x20bottom:\x20100px;\x20right:\x2026px;\x20z-index:\x209998;\x20display:\x20none;\x20width:\x20400px;\x20height:\x20600px;\x20border-radius:\x2015px;\x20box-shadow:\x200\x204px\x208px\x20rgba(0,0,0,0.1);\x20background-color:\x20white;\x20opacity:\x200;\x20transition:\x20opacity\x200.5s;','position:\x20fixed;\x20bottom:\x2026px;\x20right:\x20-100px;\x20z-index:\x209999;\x20background-color:\x20{{CHATBOT_PRIMARY_COLOR}};\x20border-radius:\x20100px;\x20border:\x20none;\x20padding:\x2018px\x2016px;\x20padding-bottom:\x2012px;\x20transition:\x20right\x200.5s,\x20transform\x200.3s;\x20cursor:\x20pointer;','1789536zMclUr','chatContainer','data','body','transform','right','Error\x20fetching\x20token:','stylesheet','{{CHATBOT_ID}}','3175Dpdqhr','catch','token','8HPTCqN','then','block','{{DOMAIN}}','{{DOMAIN}}/chatToken?chatbotId=','{{DOMAIN}}/chat?chatbotId=','error','<i\x20class=\x22material-icons\x22\x20style=\x22font-size:28px;color:white;\x22>close</i>','DOMContentLoaded','querySelector','link','addEventListener','<i\x20class=\x22material-icons\x22\x20style=\x22font-size:28px;color:white;\x22>chat</i>','opacity','532269FGXPVJ','onload','style','1041212WoChhk','iframe','https://fonts.googleapis.com/icon?family=Material+Icons','head','source','include','split','div','src','onmouseout','3804xbKVKb','startsWith','createElement','message','Chatbot\x20ID\x20not\x20found','origin','400cuobJh','find','1744836uodSQD','26px',';max-age=3600;path=/','href','display','7809256vIDnAD','getElementById','405811ypvRHe'];_0x34e8=function(){return _0xeebda9;};return _0x34e8();}function createChatButton(){const _0x2ce82d=_0xc111f2;let _0x2a72c1=_0x2ce82d(0x1ba);if(!_0x2a72c1){console[_0x2ce82d(0x1c4)](_0x2ce82d(0x1dd));return;}let _0x20fc4=document['createElement']('button');_0x20fc4['id']='chatButton',_0x20fc4[_0x2ce82d(0x1ee)]=_0x2ce82d(0x1ca),_0x20fc4[_0x2ce82d(0x1ce)]=_0x2ce82d(0x1f0);let _0xcdb1ec=document['createElement'](_0x2ce82d(0x1d6));_0xcdb1ec['id']='chatContainer',_0xcdb1ec[_0x2ce82d(0x1ce)]=_0x2ce82d(0x1ef),document[_0x2ce82d(0x1f4)][_0x2ce82d(0x1e9)](_0x20fc4),document[_0x2ce82d(0x1f4)][_0x2ce82d(0x1e9)](_0xcdb1ec),_0x20fc4['onmouseover']=()=>_0x20fc4[_0x2ce82d(0x1ce)][_0x2ce82d(0x1f5)]='scale(1.1)',_0x20fc4[_0x2ce82d(0x1d8)]=()=>_0x20fc4[_0x2ce82d(0x1ce)]['transform']='scale(1)',_0x20fc4[_0x2ce82d(0x1ed)]=()=>{toggleChatContainer(_0x2a72c1,_0x20fc4);},setTimeout(()=>{const _0x403584=_0x2ce82d;_0x20fc4[_0x403584(0x1ce)][_0x403584(0x1f6)]=_0x403584(0x1e2);},0x64);}function toggleChatContainer(_0x59b805,_0x1becd0){const _0x1984b1=_0xc111f2;let _0x34a011=document[_0x1984b1(0x1e7)]('chatContainer'),_0x2e9ea0=_0x34a011[_0x1984b1(0x1ce)][_0x1984b1(0x1e5)]==='block';!_0x2e9ea0?(_0x34a011['style'][_0x1984b1(0x1e5)]=_0x1984b1(0x1c0),_0x34a011[_0x1984b1(0x1ce)][_0x1984b1(0x1cb)]=0x1,_0x1becd0[_0x1984b1(0x1ee)]=_0x1984b1(0x1c5),retrieveAndSetToken(_0x59b805)):(_0x34a011[_0x1984b1(0x1ce)][_0x1984b1(0x1cb)]=0x0,setTimeout(()=>{const _0x296502=_0x1984b1;_0x34a011[_0x296502(0x1ce)][_0x296502(0x1e5)]='none';},0x1f4),_0x1becd0[_0x1984b1(0x1ee)]=_0x1984b1(0x1ca));}function createIframe(_0x417327){const _0x596ca8=_0xc111f2;let _0x28f216=document[_0x596ca8(0x1e7)](_0x596ca8(0x1f2));if(!_0x28f216[_0x596ca8(0x1c7)](_0x596ca8(0x1d0))){let _0x3a6425=_0x596ca8(0x1c3)+_0x417327,_0x2684f2=document[_0x596ca8(0x1db)]('iframe');_0x2684f2[_0x596ca8(0x1d7)]=_0x3a6425,_0x2684f2[_0x596ca8(0x1ce)]='width:\x20100%;\x20height:\x20100%;\x20border:\x20none;\x20border-radius:\x2013px;',_0x28f216[_0x596ca8(0x1e9)](_0x2684f2);}}function getSessionToken(){const _0x37f698=_0xc111f2;return document[_0x37f698(0x1ea)][_0x37f698(0x1d5)](';\x20')[_0x37f698(0x1e0)](_0x7c98c0=>_0x7c98c0[_0x37f698(0x1da)](_0x37f698(0x1ec)));}function retrieveAndSetToken(_0x13c525){const _0x2e5abb=_0xc111f2,_0x10bbfe=getSessionToken();!_0x10bbfe?fetch(_0x2e5abb(0x1c2)+_0x13c525,{'method':'GET','credentials':_0x2e5abb(0x1d4)})[_0x2e5abb(0x1bf)](_0x3714c3=>_0x3714c3['json']())[_0x2e5abb(0x1bf)](_0x1aabf4=>{const _0x6c09d1=_0x2e5abb;document[_0x6c09d1(0x1ea)]=_0x6c09d1(0x1ec)+_0x1aabf4[_0x6c09d1(0x1bd)]+_0x6c09d1(0x1e3),createIframe(_0x13c525);})[_0x2e5abb(0x1bc)](_0x1f616e=>console[_0x2e5abb(0x1c4)](_0x2e5abb(0x1f7),_0x1f616e)):createIframe(_0x13c525);}function loadContent(){const _0x2f8222=_0xc111f2,_0x360c30=document[_0x2f8222(0x1db)](_0x2f8222(0x1c8));_0x360c30[_0x2f8222(0x1e4)]=_0x2f8222(0x1d1),_0x360c30['rel']=_0x2f8222(0x1f8),_0x360c30[_0x2f8222(0x1cd)]=()=>createChatButton(),document[_0x2f8222(0x1d2)][_0x2f8222(0x1e9)](_0x360c30);}document[_0xc111f2(0x1c9)](_0xc111f2(0x1c6),function(){loadContent();});
  `;

  javascriptCode = javascriptCode.replace(/{{DOMAIN}}/g, process.env.DOMAIN)
    .replace(/{{CHATBOT_ID}}/g, chatbotId)
    .replace(/{{CHATBOT_PRIMARY_COLOR}}/g, chatbot.primaryColor);

  // Set Content-Type to 'application/javascript'
  await reply.type('application/javascript').send(javascriptCode);
}
