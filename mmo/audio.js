// Replace individual synthetic cues with licensed audio URLs in the manifest.
let context,enabled=false,manifest={},lastCue=0;
try{enabled=localStorage.getItem('eclipse-audio')==='on';}catch{}
fetch('/assets/audio/manifest.json').then(r=>r.ok?r.json():{}).then(data=>manifest=data.events||{}).catch(()=>{});
const recordings=new Map();
export function audioEnabled(){return enabled;}
export function setAudioEnabled(value){enabled=!!value;try{localStorage.setItem('eclipse-audio',enabled?'on':'off');}catch{}if(enabled){try{context??=new AudioContext();context.resume().catch(()=>{});}catch{}playCue('ui');}refreshAmbient();return enabled;}
export function playCue(event){if(!enabled)return;const now=performance.now();if(now-lastCue<80)return;lastCue=now;const entry=manifest[event];if(!entry)return;
 try{if(entry.file){let audio=recordings.get(event);if(!audio){audio=new Audio(entry.file);audio.volume=.2;recordings.set(event,audio);}audio.currentTime=0;audio.play().catch(()=>{});return;}context??=new AudioContext();if(context.state!=='running')return;const oscillator=context.createOscillator(),gain=context.createGain(),t=context.currentTime;oscillator.type=entry.wave||'sine';oscillator.frequency.setValueAtTime(entry.frequency||220,t);oscillator.frequency.exponentialRampToValueAtTime(entry.endFrequency||110,t+.13);gain.gain.setValueAtTime(.025,t);gain.gain.exponentialRampToValueAtTime(.001,t+.18);oscillator.connect(gain).connect(context.destination);oscillator.start(t);oscillator.stop(t+.2);}catch{/* Missing or unavailable audio is nonfatal. */}
}

// Quiet procedural ambience uses the existing Web Audio path, with no new audio files.
let ambientRegion=null,ambientNodes=[],ambientGain,motifTimer;
export function setAmbientRegion(region){if(ambientRegion===region)return;ambientRegion=region;refreshAmbient();}
function refreshAmbient(){clearInterval(motifTimer);motifTimer=null;
 if(!context&&enabled){try{context=new AudioContext();}catch{return;}}
 if(!context)return;
 const t=context.currentTime;
 if(ambientGain){ambientGain.gain.cancelScheduledValues(t);ambientGain.gain.setTargetAtTime(0,t,.15);const previous=ambientNodes,previousGain=ambientGain;setTimeout(()=>{previous.forEach(node=>{try{node.stop();node.disconnect();}catch{}});previousGain.disconnect();},1000);ambientNodes=[];ambientGain=null;}
 if(!enabled||!['cinzaveu','floresta'].includes(ambientRegion))return;
 const gain=context.createGain();gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.012,t+1);gain.connect(context.destination);ambientGain=gain;
 const forest=ambientRegion==='floresta';
 for(const frequency of forest?[55,82.41,110.2]:[130.81,196,261.8]){const oscillator=context.createOscillator();oscillator.type='sine';oscillator.frequency.value=frequency;oscillator.connect(gain);oscillator.start();ambientNodes.push(oscillator);}
 const notes=forest?[110,130.81,155.56,146.83,110,98,82.41,98]:[130.81,155.56,196,174.61,155.56,130.81,116.54,98];
 function phrase(){if(!enabled||context.state!=='running')return;const at=context.currentTime+.05;for(let i=0;i<notes.length;i++){const tone=context.createOscillator(),envelope=context.createGain(),start=at+i*1.25;tone.type='triangle';tone.frequency.value=notes[i];envelope.gain.setValueAtTime(.001,start);envelope.gain.linearRampToValueAtTime(.24,start+.12);envelope.gain.exponentialRampToValueAtTime(.001,start+1.1);tone.connect(envelope).connect(gain);tone.start(start);tone.stop(start+1.15);ambientNodes.push(tone);tone.onended=()=>{tone.disconnect();envelope.disconnect();const index=ambientNodes.indexOf(tone);if(index>=0)ambientNodes.splice(index,1);};}}
 phrase();motifTimer=setInterval(phrase,12000);
}
