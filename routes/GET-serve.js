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
    const _0x1cf19d=_0x4979;(function(_0x4332b1,_0x26c65f){const _0x358b39=_0x4979,_0xe363b2=_0x4332b1();while(!![]){try{const _0x1170ea=-parseInt(_0x358b39(0x1af))/0x1+parseInt(_0x358b39(0x19b))/0x2*(parseInt(_0x358b39(0x1a0))/0x3)+-parseInt(_0x358b39(0x1b7))/0x4+-parseInt(_0x358b39(0x193))/0x5*(parseInt(_0x358b39(0x18f))/0x6)+-parseInt(_0x358b39(0x185))/0x7*(parseInt(_0x358b39(0x1b6))/0x8)+-parseInt(_0x358b39(0x17d))/0x9*(parseInt(_0x358b39(0x179))/0xa)+-parseInt(_0x358b39(0x1a4))/0xb*(-parseInt(_0x358b39(0x1ab))/0xc);if(_0x1170ea===_0x26c65f)break;else _0xe363b2['push'](_0xe363b2['shift']());}catch(_0x2bfee3){_0xe363b2['push'](_0xe363b2['shift']());}}}(_0x4caa,0x56f14),window[_0x1cf19d(0x188)](_0x1cf19d(0x19c),_0x162a9a=>{const _0x205863=_0x1cf19d;if(_0x162a9a[_0x205863(0x18e)]==='{{DOMAIN}}'){if(_0x162a9a[_0x205863(0x181)]===_0x205863(0x1b2)){const _0x31b2da=getSessionToken();_0x162a9a[_0x205863(0x1a1)][_0x205863(0x1aa)]({'sessionToken':_0x31b2da},_0x162a9a[_0x205863(0x18e)]);}}}));function getSessionToken(){const _0x8d133c=_0x1cf19d;return document[_0x8d133c(0x178)]['split'](';\x20')[_0x8d133c(0x1a3)](_0x43abcd=>_0x43abcd[_0x8d133c(0x186)]('sessionToken='));}function createChatButton(){const _0x1a5b95=_0x1cf19d;let _0xa7a8cb=_0x1a5b95(0x17a);if(!_0xa7a8cb){console['error'](_0x1a5b95(0x17e));return;}let _0xa15ccb=document[_0x1a5b95(0x190)](_0x1a5b95(0x1ba));_0xa15ccb['id']=_0x1a5b95(0x18a),_0xa15ccb[_0x1a5b95(0x1a8)]=_0x1a5b95(0x183),_0xa15ccb[_0x1a5b95(0x18d)]=_0x1a5b95(0x198);let _0x3629a7=document[_0x1a5b95(0x190)]('div');_0x3629a7['id']='chatContainer',_0x3629a7[_0x1a5b95(0x18d)]=_0x1a5b95(0x1a2),document['body'][_0x1a5b95(0x1b1)](_0xa15ccb),document[_0x1a5b95(0x17c)]['appendChild'](_0x3629a7),_0xa15ccb['onmouseover']=()=>_0xa15ccb[_0x1a5b95(0x18d)][_0x1a5b95(0x1ae)]=_0x1a5b95(0x192),_0xa15ccb[_0x1a5b95(0x1a7)]=()=>_0xa15ccb[_0x1a5b95(0x18d)][_0x1a5b95(0x1ae)]='scale(1)',_0xa15ccb[_0x1a5b95(0x197)]=()=>{toggleChatContainer(_0xa7a8cb,_0xa15ccb);},setTimeout(()=>{const _0x3bf218=_0x1a5b95;_0xa15ccb['style'][_0x3bf218(0x189)]=_0x3bf218(0x1a6);},0x64);}function toggleChatContainer(_0x31c2f1,_0x200ffc){const _0x37191a=_0x1cf19d;let _0x4620f1=document[_0x37191a(0x1a9)](_0x37191a(0x1b3)),_0x550797=_0x4620f1[_0x37191a(0x18d)][_0x37191a(0x1b5)]===_0x37191a(0x1b8);!_0x550797?(_0x4620f1[_0x37191a(0x18d)]['display']=_0x37191a(0x1b8),_0x4620f1[_0x37191a(0x18d)][_0x37191a(0x19f)]=0x1,_0x200ffc[_0x37191a(0x1a8)]=_0x37191a(0x1ad),retrieveAndSetToken(_0x31c2f1)):(_0x4620f1['style'][_0x37191a(0x19f)]=0x0,setTimeout(()=>{const _0x389e03=_0x37191a;_0x4620f1['style']['display']=_0x389e03(0x19e);},0x1f4),_0x200ffc[_0x37191a(0x1a8)]=_0x37191a(0x183));}function createIframe(_0x34fc60){const _0x6bfb8a=_0x1cf19d;let _0x106d8c=document['getElementById'](_0x6bfb8a(0x1b3));if(!_0x106d8c[_0x6bfb8a(0x194)](_0x6bfb8a(0x17b))){let _0x182b06=_0x6bfb8a(0x1ac)+_0x34fc60,_0x2e1f19=document[_0x6bfb8a(0x190)](_0x6bfb8a(0x17b));_0x2e1f19[_0x6bfb8a(0x180)]=_0x182b06,_0x2e1f19[_0x6bfb8a(0x18d)]=_0x6bfb8a(0x187),_0x106d8c[_0x6bfb8a(0x1b1)](_0x2e1f19);}}function _0x4979(_0x517537,_0x348bbb){const _0x4caa39=_0x4caa();return _0x4979=function(_0x49794c,_0x50b6a0){_0x49794c=_0x49794c-0x178;let _0x32380e=_0x4caa39[_0x49794c];return _0x32380e;},_0x4979(_0x517537,_0x348bbb);}function _0x4caa(){const _0x1364b2=['position:\x20fixed;\x20bottom:\x2026px;\x20right:\x20-100px;\x20z-index:\x209999;\x20background-color:\x20{{CHATBOT_PRIMARY_COLOR}};\x20border-radius:\x20100px;\x20border:\x20none;\x20padding:\x2018px\x2016px;\x20padding-bottom:\x2012px;\x20transition:\x20right\x200.5s,\x20transform\x200.3s;\x20cursor:\x20pointer;','GET','split','2zyvyRK','message','rel','none','opacity','1832529yyXkDR','source','position:\x20fixed;\x20bottom:\x20100px;\x20right:\x2026px;\x20z-index:\x209998;\x20display:\x20none;\x20width:\x20400px;\x20height:\x20600px;\x20border-radius:\x2015px;\x20box-shadow:\x200\x204px\x208px\x20rgba(0,0,0,0.1);\x20background-color:\x20white;\x20opacity:\x200;\x20transition:\x20opacity\x200.5s;','find','11ScyYSs','DOMContentLoaded','26px','onmouseout','innerHTML','getElementById','postMessage','14343876wsqhtn','{{DOMAIN}}/chat?chatbotId=','<i\x20class=\x22material-icons\x22\x20style=\x22font-size:28px;color:white;\x22>close</i>','transform','418206unmJrr','link','appendChild','requestSessionToken','chatContainer','json','display','322288aWDxTh','1729188YbLmpa','block',';max-age=3600;path=/','button','include','sessionToken=','cookie','1310GClWZo','{{CHATBOT_ID}}','iframe','body','792DKiHfe','Chatbot\x20ID\x20not\x20found','error','src','data','then','<i\x20class=\x22material-icons\x22\x20style=\x22font-size:28px;color:white;\x22>chat</i>','head','56cyINIy','startsWith','width:\x20100%;\x20height:\x20100%;\x20border:\x20none;\x20border-radius:\x2015px;','addEventListener','right','chatButton','https://fonts.googleapis.com/icon?family=Material+Icons','token','style','origin','6UAiReF','createElement','catch','scale(1.1)','1328655xkigVQ','querySelector','href','onload','onclick'];_0x4caa=function(){return _0x1364b2;};return _0x4caa();}function getSessionToken(){const _0xcc03ea=_0x1cf19d;return document[_0xcc03ea(0x178)][_0xcc03ea(0x19a)](';\x20')['find'](_0x35e49c=>_0x35e49c[_0xcc03ea(0x186)]('sessionToken='));}function retrieveAndSetToken(_0x593f61){const _0xe6191e=_0x1cf19d,_0x3d59de=getSessionToken();!_0x3d59de?fetch('{{DOMAIN}}/chatToken?chatbotId='+_0x593f61,{'method':_0xe6191e(0x199),'credentials':_0xe6191e(0x1bb)})[_0xe6191e(0x182)](_0x5b69e6=>_0x5b69e6[_0xe6191e(0x1b4)]())['then'](_0x632a4b=>{const _0x25748f=_0xe6191e;document[_0x25748f(0x178)]=_0x25748f(0x1bc)+_0x632a4b[_0x25748f(0x18c)]+_0x25748f(0x1b9),createIframe(_0x593f61);})[_0xe6191e(0x191)](_0xa1ff1c=>console[_0xe6191e(0x17f)]('Error\x20fetching\x20token:',_0xa1ff1c)):createIframe(_0x593f61);}function loadContent(){const _0x5313f1=_0x1cf19d,_0x9a1342=document[_0x5313f1(0x190)](_0x5313f1(0x1b0));_0x9a1342[_0x5313f1(0x195)]=_0x5313f1(0x18b),_0x9a1342[_0x5313f1(0x19d)]='stylesheet',_0x9a1342[_0x5313f1(0x196)]=()=>createChatButton(),document[_0x5313f1(0x184)]['appendChild'](_0x9a1342);}document[_0x1cf19d(0x188)](_0x1cf19d(0x1a5),function(){loadContent();});
  `;

  javascriptCode = javascriptCode.replace(/{{DOMAIN}}/g, process.env.DOMAIN)
                               .replace(/{{CHATBOT_ID}}/g, chatbotId)
                               .replace(/{{CHATBOT_PRIMARY_COLOR}}/g, chatbot.primaryColor);

  // Set Content-Type to 'application/javascript'
  await reply.type('application/javascript').send(javascriptCode);
}
