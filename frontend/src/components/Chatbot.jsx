import React, { useEffect, useRef, useState } from 'react'
import './Chatbot.css'
import { assets } from '../assets/assets'
import Loader from './Loader'

const STORAGE_KEY = 'docstream:chatHistory:v1'

function readHistory(){
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] } catch(e){ return [] }
}

export default function Chatbot(){
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(()=>readHistory())
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scroller = useRef(null)

  useEffect(()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) }, [messages])

  useEffect(()=>{ if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight }, [messages, open, loading])

  async function send(){
    const text = input.trim()
    if (!text) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try{
      const resp = await fetch('/api/chat', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, history: messages.slice(-20) })
      })
      const data = await resp.json()
      const reply = data?.reply || (data?.error ? `Error: ${data.error}` : 'No reply')
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    }catch(err){
      console.error(err)
      setMessages(prev => [...prev, { role:'assistant', content: 'Sorry, I could not reach the chat service — try again later.' }])
    }finally{
      setLoading(false)
    }
  }

  function clear(){ setMessages([]); localStorage.removeItem(STORAGE_KEY) }

  return (
    <div className="ds-chat-root">
      {!open && (
        <button className="ds-chat-toggle" title="Open DocStream assistant" onClick={()=>setOpen(true)}>
          💬
        </button>
      )}

      {open && (
        <div className="ds-chat-window">
          <div className="ds-chat-header">
            <img className='ds-chat-brand' src={assets.logo} alt="logo" />
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>DocStream Assistant</div>
              <div className='ds-chat-small'>Professional — accurate — persistent</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button className='ds-chat-small' onClick={clear} title='Clear history'>Clear</button>
              <button onClick={()=>setOpen(false)} title='Close'>✕</button>
            </div>
          </div>

          <div className='ds-chat-body' ref={scroller}>
            {messages.length===0 && (
              <div className='ds-chat-empty'>Hi — ask me anything about DocStream. I can help find doctors, explain features, and walk you through the site.</div>
            )}

            {messages.map((m, idx) => (
              <div key={idx} className={`ds-chat-message ${m.role==='user' ? 'user':''}`}>
                {m.content}
              </div>
            ))}

            {loading && (
              <div style={{display:'flex',justifyContent: 'center'}}><div className='ds-spinner' aria-hidden /></div>
            )}
          </div>

          <div className='ds-chat-input'>
            <input maxLength={1200} value={input} placeholder='Type a question, e.g. "How do I book an appointment?"' onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send() } }} />
            <button onClick={send} className='ds-chat-toggle' style={{width:44,height:44,padding:0}}>Send</button>
          </div>

          <div className='ds-chat-footer'>Tip: use this assistant to get answers quickly. For powerful answers, configure an LLM API key in the backend (OPENAI_API_KEY).</div>
        </div>
      )}
    </div>
  )
}
