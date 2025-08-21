import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Onboarding() {
  const { refresh } = useAuth()
  const navigate = useNavigate()
  const [teachSkills, setTeachSkills] = useState('')
  const [learnSkills, setLearnSkills] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('users/me', {
        json: {
          teachSkills: teachSkills.split(',').map(s => s.trim()).filter(Boolean),
          learnSkills: learnSkills.split(',').map(s => s.trim()).filter(Boolean),
        },
      }).json()
      await refresh()
      navigate('/dashboard')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Welcome to SkillSync</h1>
      <p className="text-gray-700 mb-4">Tell us what you can teach and want to learn.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Teach Skills (comma-separated)</label>
          <input className="w-full border rounded p-2" value={teachSkills} onChange={e => setTeachSkills(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Learn Skills (comma-separated)</label>
          <input className="w-full border rounded p-2" value={learnSkills} onChange={e => setLearnSkills(e.target.value)} />
        </div>
        <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}