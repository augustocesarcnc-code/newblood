import {createHmac,timingSafeEqual,randomUUID} from 'node:crypto';
import https from 'node:https';
import * as http from 'node:http';
// Use the platform's HTTPS proxy and inherited CA trust; never disable TLS checks.
if(process.env.HTTPS_PROXY||process.env.https_proxy){if(!http.setGlobalProxyFromEnv)throw Error('Use Node.js 24.19+ para acessar o proxy HTTPS.');http.setGlobalProxyFromEnv();}
const DAY=86400000;
export function paymentConfig(env=process.env){
 const price=Number(env.MP_VIP_PRICE_CENTS),mode=env.MP_MODE||'test';let base=null;
 try{const u=new URL(env.PUBLIC_BASE_URL);if(u.protocol==='https:'&&!u.username&&!u.password&&!u.search&&!u.hash&&u.pathname==='/')base=u.origin;}catch{}
 const validPrice=Number.isSafeInteger(price)&&price>=100&&price<=10000000;
 return {token:env.MP_ACCESS_TOKEN,secret:env.MP_WEBHOOK_SECRET,mode,price:validPrice?price:null,base,available:!!(env.MP_ACCESS_TOKEN&&env.MP_WEBHOOK_SECRET&&base&&validPrice&&['test','live'].includes(mode))};
}
export function vipInfo(config){return {available:config.available,name:'Pacto Carmesim',days:30,priceCents:config.price,currency:'BRL',mode:config.mode,provider:'Mercado Pago',benefits:['Título e aura carmesim','+15% de experiência PvE','Automação de caça configurável']};}
export function verifySignature(headers,query,secret){
 const id=query.get('data.id'),requestId=headers['x-request-id'],signature=headers['x-signature'];
 if(!secret||!id||!/^[a-zA-Z0-9-]{1,100}$/.test(id)||typeof requestId!=='string'||!/^[a-zA-Z0-9-]{1,200}$/.test(requestId)||typeof signature!=='string'||signature.length>300)return false;
 const fields=signature.split(',').map(p=>p.trim().split('='));if(fields.length!==2||new Set(fields.map(f=>f[0])).size!==2)return false;
 const values=Object.fromEntries(fields),{ts,v1}=values;if(!/^\d{1,20}$/.test(ts||'')||!/^[a-f0-9]{64}$/i.test(v1||''))return false;
 const manifest=`id:${id.toLowerCase()};request-id:${requestId};ts:${ts};`;
 const expected=createHmac('sha256',secret).update(manifest).digest();return timingSafeEqual(expected,Buffer.from(v1,'hex'));
}
export async function mercadoRequest(path,token,body){
 return await new Promise((resolve,reject)=>{
  const encoded=body?JSON.stringify(body):null;
  const req=https.request(new URL(path,'https://api.mercadopago.com'),{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,Accept:'application/json',...(encoded?{'Content-Type':'application/json','Content-Length':Buffer.byteLength(encoded)}:{})},timeout:12000},res=>{
   let text='';res.on('data',chunk=>{text+=chunk;if(text.length>2000000)req.destroy(Error('Resposta de pagamento muito grande.'));});res.on('error',reject);res.on('end',()=>{if(res.statusCode<200||res.statusCode>=300)return reject(Error('Mercado Pago indisponível ou credencial sem permissão.'));try{resolve(JSON.parse(text));}catch{reject(Error('Resposta inválida do provedor.'));}});
  });req.on('error',()=>reject(Error('Não foi possível conectar ao Mercado Pago.')));req.on('timeout',()=>req.destroy(Error('Tempo limite do Mercado Pago.')));if(encoded)req.write(encoded);req.end();
 });
}
export function preferencePayload(order,config){return {items:[{id:'bloodmoon-vip-30',title:'Bloodmoon · Pacto Carmesim · 30 dias',description:'Acesso VIP por 30 dias, sem renovação automática.',quantity:1,currency_id:'BRL',unit_price:order.amountCents/100}],external_reference:order.id,metadata:{bloodmoon_order_id:order.id},notification_url:config.base+'/api/payments/mercadopago/webhook',back_urls:{success:config.base+'/?payment=success',pending:config.base+'/?payment=pending',failure:config.base+'/?payment=failure'},auto_return:'approved',payment_methods:{excluded_payment_types:[{id:'ticket'},{id:'atm'}],installments:1}};}
function validateCheckoutUrl(value,mode){try{const url=new URL(value);if(url.protocol==='https:'&&!url.username&&!url.password&&['www.mercadopago.com.br','www.mercadopago.com','sandbox.mercadopago.com.br','sandbox.mercadopago.com'].includes(url.hostname))return url.href;}catch{}throw Error('O provedor não retornou um checkout válido.');}
export function applyPayment(data,payment,config){
 if(!payment||!/^\d{1,40}$/.test(String(payment.id||'')))throw Error('Pagamento inválido.');
 const order=data.orders?.[payment.external_reference];if(!order)return {ignored:true};
 if(order.mode!==config.mode)throw Error('Ambiente do pagamento não corresponde à configuração.');
 const p=Object.values(data.players).find(p=>p.id===order.playerId);if(!p)throw Error('Personagem do pedido não encontrado.');
 if(String(payment.collector_id)!==String(order.collectorId)||!order.collectorId||payment.currency_id!==order.currency||!Number.isFinite(payment.transaction_amount)||Math.abs(payment.transaction_amount*100-order.amountCents)>.001||payment.live_mode!==(order.mode==='live'))throw Error('Pagamento não corresponde ao pedido.');
 const paymentId=String(payment.id);data.paymentCredits??={};
 if(data.paymentCredits[paymentId]&&data.paymentCredits[paymentId]!==order.id)throw Error('Pagamento já vinculado a outro pedido.');
 order.status=String(payment.status);order.updatedAt=Date.now();
 if(payment.status==='approved'){
  if(payment.transaction_amount_refunded>0)return {ignored:true};
  if(order.creditedPaymentId){if(order.creditedPaymentId!==paymentId)throw Error('Pedido já possui pagamento.');return {duplicate:true};}
  const now=Date.now(),start=Math.max(p.vipUntil||0,now);order.previousVipUntil=p.vipUntil||0;order.vipStart=start;order.vipEnd=start+order.days*DAY;order.creditedPaymentId=paymentId;order.creditedAt=now;data.paymentCredits[paymentId]=order.id;p.vipUntil=order.vipEnd;return {granted:true};
 }
 // Revocation never removes time from a later, independent purchase.
 if(['refunded','charged_back'].includes(payment.status)&&order.creditedPaymentId===paymentId&&!order.revokedAt){order.revokedAt=Date.now();p.vipUntil=Math.max(Date.now(),(p.vipUntil||0)-Math.max(0,order.vipEnd-Math.max(Date.now(),order.vipStart)));return {revoked:true};}
 return {pending:true};
}
export function createPayments({data,persist,config=paymentConfig(),request=mercadoRequest}){
 data.orders??={};data.paymentCredits??={};const locks=new Map();let reconciliation=Promise.resolve();
 async function checkout(p){
  if(!config.available)throw Error('Compra ainda indisponível: configure preço, endereço público e credenciais do Mercado Pago.');
  if(locks.has(p.id))return locks.get(p.id);
  const operation=(async()=>{
   const recent=Object.values(data.orders).filter(o=>o.playerId===p.id&&o.createdAt>Date.now()-10*60000);
   const reusable=recent.find(o=>o.checkoutUrl&&!o.creditedPaymentId&&o.status==='pending'&&o.amountCents===config.price&&o.mode===config.mode);if(reusable)return {checkoutUrl:reusable.checkoutUrl,orderId:reusable.id};
   if(recent.length>=5)throw Error('Aguarde antes de criar outro pedido VIP.');
   const order={id:randomUUID(),playerId:p.id,amountCents:config.price,currency:'BRL',days:30,mode:config.mode,status:'creating',createdAt:Date.now()};data.orders[order.id]=order;await persist();
   try{const preference=await request('/checkout/preferences',config.token,preferencePayload(order,config));if(!preference.id||!preference.collector_id)throw Error('Preferência incompleta do Mercado Pago.');order.preferenceId=String(preference.id);order.collectorId=String(preference.collector_id);order.checkoutUrl=validateCheckoutUrl(config.mode==='test'?preference.sandbox_init_point:preference.init_point,config.mode);order.status='pending';await persist();return {checkoutUrl:order.checkoutUrl,orderId:order.id};}catch(e){order.status='creation_failed';await persist();throw e;}
  })();locks.set(p.id,operation);try{return await operation;}finally{locks.delete(p.id);}
 }
 async function webhook(headers,url,event){
  if(!config.available)return {status:503,error:'Pagamentos não configurados.'};
  if(!verifySignature(headers,url.searchParams,config.secret))return {status:401,error:'Assinatura inválida.'};
  if(event.type!=='payment')return {status:200,ignored:true};
  const paymentId=url.searchParams.get('data.id');if(event.data?.id!==undefined&&String(event.data.id).toLowerCase()!==paymentId.toLowerCase())return {status:400,error:'Identificador divergente.'};
  const task=reconciliation.catch(()=>{}).then(async()=>{
   const payment=await request('/v1/payments/'+encodeURIComponent(paymentId),config.token);
   if(String(payment.id)!==paymentId)throw Error('Identificador inválido no provedor.');
   const result=applyPayment(data,payment,config);await persist();return {status:200,...result};
  });reconciliation=task;try{return await task;}catch{return {status:503,error:'Pagamento não conciliado. A notificação deve ser reenviada.'};}
 }
 return {checkout,webhook,info:()=>vipInfo(config)};
}
