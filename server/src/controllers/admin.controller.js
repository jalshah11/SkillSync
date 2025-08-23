import User from '../models/User.js'
import Session from '../models/Session.js'

export async function listUsers(_req, res) {
	const users = await User.find().select('name email roles badges completedSessions createdAt').lean()
	return res.json({ users })
}

export async function listSessions(_req, res) {
	const sessions = await Session.find().sort({ createdAt: -1 }).populate('mentor', 'name').populate('learner', 'name').lean()
	return res.json({ sessions })
}

export async function toggleAdmin(req, res) {
	const { id } = req.params
	const user = await User.findById(id)
	if (!user) return res.status(404).json({ message: 'Not found' })
	const roles = new Set(user.roles || [])
	if (roles.has('admin')) roles.delete('admin'); else roles.add('admin')
	user.roles = Array.from(roles)
	await user.save()
	return res.json({ id: user._id, roles: user.roles })
}