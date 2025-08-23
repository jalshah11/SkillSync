import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function Video() {
  const { id } = useParams()
  const [room, setRoom] = useState('')
  const containerRef = useRef(null)
  const apiRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const { room } = await api.get(`sessions/${id}/video`).json()
        setRoom(room)
      } catch {}
    }
    load()
  }, [id])

  useEffect(() => {
    if (!room || !containerRef.current) return
    const domain = 'meet.jit.si'
    const options = {
      roomName: room,
      parentNode: containerRef.current,
      width: '100%',
      height: 600,
      configOverwrite: { startWithAudioMuted: true },
      interfaceConfigOverwrite: { TOOLBAR_BUTTONS: ['microphone','camera','hangup'] },
    }
    // eslint-disable-next-line no-undef
    apiRef.current = new window.JitsiMeetExternalAPI(domain, options)
    return () => { try { apiRef.current?.dispose() } catch {} }
  }, [room])

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-3">Video Session</h1>
      <div ref={containerRef} />
      <p className="text-sm text-gray-600 mt-2">Room: {room}</p>
      <script src="https://meet.jit.si/external_api.js"></script>
    </div>
  )
}