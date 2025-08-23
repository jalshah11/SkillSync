import { useToast } from '../context/ToastContext'

export default function ToastHost() {
  const { toasts, remove } = useToast()
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.variant==='error'?'bg-red-600':t.variant==='success'?'bg-green-600':'bg-gray-800'}`}>
          <div className="flex items-center gap-3">
            <span>{t.message}</span>
            <button className="text-white/80" onClick={()=>remove(t.id)}>×</button>
          </div>
        </div>
      ))}
    </div>
  )
}