import { useState } from 'react'
import { api } from '../lib/api'

export default function StudyPlan() {
  const [topic, setTopic] = useState('React')
  const [skillLevel, setSkillLevel] = useState('beginner')
  const [goals, setGoals] = useState('build a todo app')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function generate(e) {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const res = await api.post('ai/study-plan', { json: { topic, skillLevel, goals: goals.split(',').map(s=>s.trim()).filter(Boolean) } }).json()
      setResult(res.plan || JSON.stringify(res, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">AI Study Plan</h1>
      <form onSubmit={generate} className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <input className="w-full border rounded p-2" value={topic} onChange={e=>setTopic(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Skill Level</label>
          <select className="w-full border rounded p-2" value={skillLevel} onChange={e=>setSkillLevel(e.target.value)}>
            <option>beginner</option>
            <option>intermediate</option>
            <option>advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Goals (comma-separated)</label>
          <input className="w-full border rounded p-2" value={goals} onChange={e=>setGoals(e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading?'Generating...':'Generate'}</button>
        </div>
      </form>
      <div className="prose max-w-none whitespace-pre-wrap">
        {result || 'Result will appear here.'}
      </div>
    </div>
  )
}