import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { socket, connectSocket } from '../lib/socket'
import { api } from '../lib/api'

export default function SessionChat() {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get(`sessions/${id}`).json()
        setSession(data)
      } catch {}
    }
    load()
  }, [id])

  useEffect(() => {
    connectSocket()
    socket.emit('join:session', id)
    const onMessage = (msg) => {
      if (msg?.sessionId === id) setMessages((prev) => [...prev, msg])
    }
    socket.on('chat:message', onMessage)
    return () => {
      socket.off('chat:message', onMessage)
    }
  }, [id])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function sendMessage(e) {
    e.preventDefault()
    if (!text.trim()) return
    const outgoing = { sessionId: id, text, user: 'me' }
    setMessages((prev) => [...prev, { ...outgoing, ts: Date.now() }])
    socket.emit('chat:message', outgoing)
    setText('')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow h-[70vh] flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Session Chat</h1>
        {session && (
          <p className="text-sm text-gray-600">{session.skill} • Mentor: {session.mentor?.name} • Learner: {session.learner?.name}</p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto border rounded p-3 bg-gray-50">
        {messages.map((m, idx) => (
          <div key={idx} className="mb-2">
            <span className="text-xs text-gray-500 mr-2">{new Date(m.ts || Date.now()).toLocaleTimeString()}</span>
            <span className="font-medium mr-2">{m.user === 'me' ? 'Me' : m.user || 'Peer'}:</span>
            <span>{m.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input className="flex-1 border rounded p-2" value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  )
}