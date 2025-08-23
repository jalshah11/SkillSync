import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { socket, connectSocket } from '../lib/socket'

export default function Whiteboard() {
  const { id } = useParams()
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState('#111827')
  const [size, setSize] = useState(3)

  useEffect(() => {
    connectSocket()
    socket.emit('join:session', id)
    const onStroke = ({ stroke }) => drawStroke(stroke, false)
    const onClear = () => clearCanvas(false)
    socket.on('wb:stroke', onStroke)
    socket.on('wb:clear', onClear)
    return () => {
      socket.off('wb:stroke', onStroke)
      socket.off('wb:clear', onClear)
    }
  }, [id])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctxRef.current = ctx
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [color, size])

  function resize() {
    const canvas = canvasRef.current
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = 500
  }

  function drawStroke(stroke, emit = true) {
    const ctx = ctxRef.current
    const { from, to, color, size } = stroke
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()
    if (emit) socket.emit('wb:stroke', { sessionId: id, stroke })
  }

  function clearCanvas(emit = true) {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (emit) socket.emit('wb:clear', { sessionId: id })
  }

  function pointerPos(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onDown(e) {
    drawingRef.current = true
    e.preventDefault()
  }
  function onUp(e) {
    drawingRef.current = false
    e.preventDefault()
  }
  function onMove(e) {
    if (!drawingRef.current) return
    const to = pointerPos(e)
    const from = { ...to, x: to.x - 1, y: to.y - 1 }
    drawStroke({ from, to, color, size }, true)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow space-y-3">
      <h1 className="text-xl font-semibold">Whiteboard</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm">Color<input type="color" className="ml-2" value={color} onChange={e=>setColor(e.target.value)} /></label>
        <label className="text-sm">Size<input type="range" min="1" max="10" className="ml-2" value={size} onChange={e=>setSize(parseInt(e.target.value))} /></label>
        <button onClick={() => clearCanvas(true)} className="px-3 py-1 bg-gray-700 text-white rounded">Clear</button>
      </div>
      <div>
        <canvas ref={canvasRef} onMouseDown={onDown} onMouseUp={onUp} onMouseLeave={onUp} onMouseMove={onMove} className="w-full border rounded bg-white" />
      </div>
    </div>
  )
}