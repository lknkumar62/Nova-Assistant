import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import NovaOrb from './components/NovaOrb';
import './styles.css';
import type { Tab, NovaState, Message } from './types';

const tabs: Tab[] = ['home','chat','voice','tools','settings'];

function App(){
 const [tab,setTab]=useState<Tab>('home');
 const [state,setState]=useState<NovaState>('idle');
 const [messages,setMessages]=useState<Message[]>([]);
 const [input,setInput]=useState('');
 const send=()=>{const text=input.trim();if(!text)return;setMessages(m=>[...m,{id:crypto.randomUUID(),role:'user',text,createdAt:Date.now()}]);setInput('');setState('processing');setTimeout(()=>{setMessages(m=>[...m,{id:crypto.randomUUID(),role:'assistant',text:'NOVA is ready. Connect an AI provider to enable responses.',createdAt:Date.now()}]);setState('idle')},350)};
 const home=tab==='home';
 return <main className="nova-shell">
  <header><div className="brand"><span className="brand-dot"/>NOVA</div><div className="status">{state.toUpperCase()}</div></header>
  {home && <section className="home"><div className="eyebrow">NEXT-GENERATION ASSISTANT</div><h1>How can I help?</h1><NovaOrb state={state==='processing'?'thinking':state} size={360}/><button className="voice-action" onClick={()=>setState(s=>s==='listening'?'idle':'listening')}>{state==='listening'?'STOP LISTENING':'TAP TO SPEAK'}</button></section>}
  {tab==='chat' && <section className="panel"><h2>Chat</h2><div className="messages">{messages.map(m=><div className={`msg ${m.role}`} key={m.id}>{m.text}</div>)}</div><div className="composer"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Message NOVA…"/><button onClick={send}>Send</button></div></section>}
  {tab==='voice' && <section className="panel"><h2>Voice</h2><div className="card"><b>Wake word</b><span>Hello NOVA</span></div><div className="card"><b>Mode</b><span>Offline-first</span></div><div className="card"><b>Voice</b><span>Neural TTS</span></div></section>}
  {tab==='tools' && <section className="panel"><h2>Tools</h2><div className="grid"><div className="tool">📞 Calls</div><div className="tool">💬 Messages</div><div className="tool">📷 Camera</div><div className="tool">🔦 Torch</div><div className="tool">⏰ Reminders</div><div className="tool">📁 Files</div></div></section>}
  {tab==='settings' && <section className="panel"><h2>Settings</h2><div className="card"><b>Wake word</b><span>Enabled</span></div><div className="card"><b>Background listening</b><span>Enabled</span></div><div className="card"><b>Offline-first</b><span>Enabled</span></div></section>}
  <nav>{tabs.map(t=><button className={tab===t?'active':''} key={t} onClick={()=>setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>)}</nav>
 </main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
