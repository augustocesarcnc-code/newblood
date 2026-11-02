// Presentation-only window controls; the open panel and game state stay intact.
export function restoreGameWindow(dialog){dialog.classList.remove('is-minimized');const restore=document.getElementById('restoreWindow');restore.hidden=true;}
export function initWindowControls(dialog){
 const minimize=document.getElementById('minimizeWindow'),maximize=document.getElementById('maximizeWindow'),restore=document.getElementById('restoreWindow');
 minimize.onclick=()=>{dialog.classList.add('is-minimized');restore.textContent='↗ '+document.getElementById('modalTitle').textContent;restore.hidden=false;restore.focus();};
 restore.onclick=()=>{restoreGameWindow(dialog);minimize.focus();};
 maximize.onclick=()=>{const expanded=dialog.classList.toggle('is-maximized');maximize.setAttribute('aria-pressed',String(expanded));maximize.setAttribute('aria-label',expanded?'Restaurar tamanho':'Maximizar janela');maximize.textContent=expanded?'❐':'□';};
 dialog.addEventListener('close',()=>{restoreGameWindow(dialog);dialog.classList.remove('is-maximized');maximize.setAttribute('aria-pressed','false');maximize.textContent='□';});
 for(const button of document.querySelectorAll('[data-collapse]'))button.onclick=()=>{const element=document.querySelector(button.dataset.collapse),collapsed=element.classList.toggle('is-collapsed');button.setAttribute('aria-expanded',String(!collapsed));button.textContent=collapsed?'+':'−';};
}
