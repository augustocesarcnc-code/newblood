import {addItem,consumeItem} from './inventory.js';
const copy=items=>items.map(i=>({...i}));
// Transfer only server-owned objects; commit both sides after capacity checks succeed.
export function transferBankItem(p,direction,id,quantity=1){
 if(!['deposit','withdraw'].includes(direction))throw Error('Operação bancária inválida.');
 const bank=p.bank||{gold:0,items:[]},bag={inventory:copy(p.inventory),equipment:{...p.equipment}},vault={inventory:copy(bank.items),equipment:{}};
 const [from,to]=direction==='deposit'?[bag,vault]:[vault,bag],source=from.inventory.find(i=>i.id===id);
 if(!source)throw Error('Item não encontrado.');
 if(Object.values(p.equipment).includes(id))throw Error('Desequipe o item antes de depositar.');
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>(source.quantity||1))throw Error('Quantidade inválida.');
 const partial=quantity<(source.quantity||1),moved=consumeItem(from,id,quantity);if(partial)moved.id=crypto.randomUUID();
 addItem(to,moved);p.inventory=bag.inventory;p.bank={gold:bank.gold||0,items:vault.inventory};
}
export function transferBankGold(p,direction,quantity){
 if(!['deposit','withdraw'].includes(direction)||!Number.isSafeInteger(quantity)||quantity<1)throw Error('Valor bancário inválido.');
 const bank=p.bank||{gold:0,items:[]},wallet=p.gold||0,stored=bank.gold||0;
 if((direction==='deposit'?wallet:stored)<quantity)throw Error('Saldo insuficiente.');
 const nextWallet=wallet+(direction==='deposit'?-quantity:quantity),nextStored=stored+(direction==='deposit'?quantity:-quantity);
 if(nextWallet>2000000000||nextStored>2000000000)throw Error('Limite de saldo.');
 p.gold=nextWallet;p.bank={gold:nextStored,items:bank.items};
}
