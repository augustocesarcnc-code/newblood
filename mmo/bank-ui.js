import {itemArt} from './inventory-ui.js';
export function renderBank(body,p,{el,button,action}){
 const bank=p.bank||{gold:0,items:[]};body.append(el('h3','Banco e Armazém da Vigília'),el('p',`Bolsa: ${p.gold} ouro · Cofre: ${bank.gold} ouro · Armazém: ${bank.items.length} / 40`));
 const value=el('input');value.type='number';value.min=1;value.step=1;value.value=25;value.setAttribute('aria-label','Quantidade de ouro');const money=el('div',undefined,'inventory-actions');money.append(value,button('DEPOSITAR OURO',()=>action({type:'bank-gold',direction:'deposit',quantity:Number(value.value)})),button('RETIRAR OURO',()=>action({type:'bank-gold',direction:'withdraw',quantity:Number(value.value)})));body.append(money);
 for(const [direction,title,items]of [['deposit','GUARDAR NA CUSTÓDIA',p.inventory],['withdraw','RETIRAR DO ARMAZÉM',bank.items]]){
  body.append(el('div',title,'section-label'));const grid=el('div',undefined,'item-grid');
  for(const item of items){const card=el('article',undefined,'item-card');card.style.setProperty('--rarity',item.color);card.append(itemArt(item.base),el('small',item.rarityName),el('h4',item.name),el('p',`${item.quantity} unidade(s)`));const quantity=el('input');quantity.type='number';quantity.min=1;quantity.max=item.quantity;quantity.value=item.quantity;quantity.setAttribute('aria-label','Quantidade de '+item.name);const transfer=button(direction==='deposit'?'DEPOSITAR ITEM':'RETIRAR ITEM',()=>action({type:'bank-item',direction,id:item.id,quantity:Number(quantity.value)}));transfer.disabled=direction==='deposit'&&Object.values(p.equipment).includes(item.id);card.append(quantity,transfer);grid.append(card);}
  body.append(grid.childNodes.length?grid:el('p',direction==='deposit'?'Nenhum item na bolsa.':'Armazém vazio.'));
 }
 body.append(el('p','A custódia é pessoal. Desequipe antes de guardar; operações exigem proximidade, fim de combate e nenhuma troca ativa.'));
}
