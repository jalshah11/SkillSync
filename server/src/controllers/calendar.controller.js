import { createEvent } from 'ics'
import Session from '../models/Session.js'

export async function createEvent(req, res) {
	return res.status(501).json({ message: 'Calendar integration not implemented yet' });
}

export async function listEvents(_req, res) {
	return res.status(501).json({ message: 'Calendar integration not implemented yet' });
}

export async function downloadIcs(req, res) {
	const s = await Session.findById(req.params.id).populate('mentor', 'name').populate('learner', 'name').lean()
	if (!s) return res.status(404).json({ message: 'Not found' })
	const start = s.scheduledAt ? new Date(s.scheduledAt) : new Date()
	const event = {
		title: `SkillSync: ${s.skill}`,
		description: `Mentor: ${s.mentor?.name} | Learner: ${s.learner?.name}`,
		start: [start.getFullYear(), start.getMonth()+1, start.getDate(), start.getHours(), start.getMinutes()],
		duration: { hours: 1 },
	}
	createEvent(event, (error, value) => {
		if (error) return res.status(500).json({ message: 'Failed to generate ICS' })
		res.setHeader('Content-Type', 'text/calendar')
		res.setHeader('Content-Disposition', `attachment; filename="session-${s._id}.ics"`)
		res.send(value)
	})
}

