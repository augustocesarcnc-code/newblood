import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {paymentConfig,verifySignature,preferencePayload,applyPayment,createPayments} from '../mmo/payments.js';
const secret='local-test-signature-secret-not-a-real-credential';
const cfg={available:true,token:'test-only',secret,mode:'test',price:1990,base:'https://bloodmoon.example'};
function signature(id='123',requestId='test-request',ts='1700000000'){
 return {'x-request-id':requestId,'x-signature':`ts=${ts},v1=${createHmac('sha256',secret).update(`id:${id.toLowerCase()};request-id:${requestId};ts:${ts};`).digest('hex')}`};
}
function fixture(){const p={id:'player1',vipUntil:0};const order={id:'order1',playerId:p.id,amountCents:1990,currency:'BRL',days:30,mode:'test',collectorId:'900'};const data={players:{session:p},orders:{order1:order},paymentCredits:{}};const payment={id:123,external_reference:'order1',collector_id:900,transaction_amount:19.90,currency_id:'BRL',live_mode:false,status:'approved',transaction_amount_refunded:0};return {p,order,data,payment};}
test('checkout stays disabled without secure configuration or a price',()=>{
 assert.equal(paymentConfig({}).available,false);
 for(const url of ['http://example.com','https://user:pass@example.com','https://example.com/path','https://example.com/?q=1'])assert.equal(paymentConfig({MP_ACCESS_TOKEN:'test',MP_WEBHOOK_SECRET:secret,PUBLIC_BASE_URL:url,MP_VIP_PRICE_CENTS:'1990'}).available,false);
 const valid={MP_ACCESS_TOKEN:'test',MP_WEBHOOK_SECRET:secret,PUBLIC_BASE_URL:cfg.base,MP_VIP_PRICE_CENTS:'1990'};assert.equal(paymentConfig(valid).available,true);assert.equal(paymentConfig({...valid,MP_VIP_PRICE_CENTS:'19.9'}).available,false);assert.equal(paymentConfig({...valid,MP_MODE:'invalid'}).available,false);
});
test('HMAC validates the signed query identifier and request ID, not body claims',()=>{
 const q=new URLSearchParams({'data.id':'123'});assert.equal(verifySignature(signature(),q,secret),true);assert.equal(verifySignature(signature(),new URLSearchParams({'data.id':'456'}),secret),false);assert.equal(verifySignature({...signature(),'x-request-id':'changed'},q,secret),false);assert.equal(verifySignature(signature(),q,'wrong'),false);assert.equal(verifySignature({},q,secret),false);assert.equal(verifySignature({...signature(),'x-signature':signature()['x-signature']+',ts=1'},q,secret),false);
});
test('preference fixes price, currency and order reference on the server',()=>{const {order}=fixture(),body=preferencePayload(order,cfg);assert.equal(body.items[0].unit_price,19.9);assert.equal(body.items[0].currency_id,'BRL');assert.equal(body.items[0].quantity,1);assert.equal(body.external_reference,'order1');assert.equal(body.notification_url,cfg.base+'/api/payments/mercadopago/webhook');assert.equal(body.back_urls.success,cfg.base+'/?payment=success');assert.equal(body.payment_methods.installments,1);});
test('approved payment grants 30 days once and renewals extend remaining time',()=>{const {p,data,payment}=fixture();p.vipUntil=Date.now()+86400000;const before=p.vipUntil;assert.equal(applyPayment(data,payment,cfg).granted,true);assert.equal(p.vipUntil,before+30*86400000);assert.equal(applyPayment(data,payment,cfg).duplicate,true);assert.equal(p.vipUntil,before+30*86400000);});
test('pending and rejected payments never grant VIP',()=>{for(const status of ['pending','in_process','rejected','cancelled']){const {p,data,payment}=fixture();payment.status=status;applyPayment(data,payment,cfg);assert.equal(p.vipUntil,0);}});
test('amount, collector, currency and environment must match the saved order',()=>{
 for(const change of [{transaction_amount:.01},{transaction_amount:NaN},{currency_id:'USD'},{collector_id:901},{live_mode:true},{id:'invalid'}]){const {p,data,payment}=fixture();assert.throws(()=>applyPayment(data,{...payment,...change},cfg));assert.equal(p.vipUntil,0);}
 const {data,payment}=fixture();assert.equal(applyPayment(data,{...payment,external_reference:'unknown'},cfg).ignored,true);
});
test('refund revokes unused entitlement once and an old approval cannot regrant',()=>{const {p,data,payment}=fixture();applyPayment(data,payment,cfg);assert.ok(p.vipUntil>Date.now());payment.status='refunded';applyPayment(data,payment,cfg);assert.ok(p.vipUntil<=Date.now()+20);const after=p.vipUntil;applyPayment(data,payment,cfg);assert.equal(p.vipUntil,after);payment.status='approved';applyPayment(data,payment,cfg);assert.equal(p.vipUntil,after);});
test('checkout deduplicates concurrent requests and never trusts a foreign checkout URL',async()=>{
 const data={players:{session:{id:'p'}},orders:{}},p=data.players.session;let calls=0,saves=0;
 const service=createPayments({data,config:cfg,persist:async()=>saves++,request:async(path,token,payload)=>{calls++;assert.equal(path,'/checkout/preferences');assert.equal(payload.items[0].unit_price,19.9);return {id:'pref1',collector_id:900,sandbox_init_point:'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=1'};}});
 const [a,b]=await Promise.all([service.checkout(p),service.checkout(p)]);assert.deepEqual(a,b);assert.equal(calls,1);assert.ok(saves>=2);await service.checkout(p);assert.equal(calls,1);assert.equal(p.vipUntil,undefined);
 const bad=createPayments({data:{players:{},orders:{}},config:cfg,persist:async()=>{},request:async()=>({id:'pref',collector_id:900,sandbox_init_point:'https://evil.example/pay'})});await assert.rejects(()=>bad.checkout({id:'other'}),/checkout válido/);
});
test('signed webhook queries the provider, serializes duplicates and persists credit',async()=>{
 const {p,data,payment}=fixture();let calls=0,saves=0;
 const service=createPayments({data,config:cfg,persist:async()=>saves++,request:async path=>{assert.equal(path,'/v1/payments/123');calls++;return payment;}});
 const url=new URL('https://bloodmoon.example/api/payments/mercadopago/webhook?data.id=123');const event={type:'payment',data:{id:123}};
 assert.equal((await service.webhook({},url,event)).status,401);assert.equal(calls,0);
 const results=await Promise.all([service.webhook(signature(),url,event),service.webhook(signature(),url,event)]);assert.ok(results.some(r=>r.granted));assert.ok(results.some(r=>r.duplicate));assert.equal(saves,2);assert.equal(Object.keys(data.paymentCredits).length,1);assert.ok(p.vipUntil>Date.now());
 assert.equal((await service.webhook(signature(),url,{type:'payment',data:{id:999}})).status,400);
});
test('API errors and unconfigured checkout cannot grant entitlement',async()=>{
 const {p,data}=fixture();const service=createPayments({data,config:cfg,persist:async()=>{},request:async()=>{throw Error('offline');}});const url=new URL('https://bloodmoon.example/?data.id=123');assert.equal((await service.webhook(signature(),url,{type:'payment'})).status,503);assert.equal(p.vipUntil,0);
 const unavailable=createPayments({data,config:paymentConfig({}),persist:async()=>{},request:async()=>{throw Error('must not call');}});await assert.rejects(()=>unavailable.checkout(p),/indisponível/);assert.equal((await unavailable.webhook(signature(),url,{type:'payment'})).status,503);
});

test('credits survive serialization and notifications from another environment are rejected',()=>{const {data,payment}=fixture();applyPayment(data,payment,cfg);const restored=JSON.parse(JSON.stringify(data)),before=restored.players.session.vipUntil;assert.equal(applyPayment(restored,payment,cfg).duplicate,true);assert.equal(restored.players.session.vipUntil,before);assert.throws(()=>applyPayment(restored,payment,{...cfg,mode:'live'}),/Ambiente/);});
