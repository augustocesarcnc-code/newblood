import {Server} from 'socket.io';
import {EventEmitter} from 'node:events';
import type {Server as HttpServer,IncomingMessage} from 'node:http';
import {EVENTS} from '../../../packages/shared/src/events.js';
import {api} from '../../../mmo/backend.js';
// One authoritative command pipeline serves both HTTP and the realtime channel.
function request(source:IncomingMessage,path:string,method:string,payload:unknown){const req:any=new EventEmitter();req.headers={...source.headers};req.url=path;req.method=method;req.socket=source.socket;req[Symbol.asyncIterator]=async function*(){yield Buffer.from(JSON.stringify(payload||{}));};return req;}
export function attachRealtime(server:HttpServer){
 const io=new Server(server,{serveClient:true,maxHttpBufferSize:8192,pingInterval:15000,pingTimeout:20000,allowRequest:(req,done)=>{const origin=req.headers.origin,expected=process.env.PUBLIC_BASE_URL||'http://'+req.headers.host;done(null,!origin||origin===expected);}});
 io.on('connection',socket=>{
  let eventRequest:any,lastJoin=0;
  async function dispatch(path:string,payload:unknown){return await new Promise<any>((resolve,reject)=>{let status=200;const req=request(socket.request,path,'POST',payload),res:any={setHeader(){},writeHead(code:number){status=code;},end(body:string){try{const result=JSON.parse(body||'{}');resolve({...result,status});}catch(e){reject(e);}}};Promise.resolve(api(req,res,path)).catch(reject);});}
  socket.on(EVENTS.JOIN,async(payload,ack)=>{if(typeof ack!=='function')return;if(Date.now()-lastJoin<1000){ack({status:429,error:'Aguarde para entrar novamente.'});return;}lastJoin=Date.now();try{const result=await dispatch('/api/join',{});ack(result);if(result.status!==200)return;eventRequest=request(socket.request,'/api/events','GET',{});const res:any={destroyed:false,authRequest:null,setHeader(){},writeHead(){},write(chunk:string){if(this.destroyed)return;const content=String(chunk);if(content.startsWith('data: '))socket.emit(EVENTS.STATE,JSON.parse(content.slice(6).trim()));},end(){this.destroyed=true;socket.disconnect(true);}};await api(eventRequest,res,'/api/events');}catch{ack({status:500,error:'Não foi possível entrar no mundo.'});}});
  socket.on(EVENTS.ACTION,async(payload,ack)=>{if(typeof ack!=='function')return;try{ack(await dispatch('/api/action',payload));}catch{ack({status:500,error:'Não foi possível processar a ação.'});}});
  socket.on(EVENTS.PING,(ack)=>{if(typeof ack==='function')ack(Date.now());});
  socket.on('disconnect',()=>eventRequest?.emit('close'));
 });return io;
}
