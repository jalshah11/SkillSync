import Session from '../models/Session.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export async function createSessionRequest(req, res) {
	try {
		const { mentorId, skill, message } = req.body || {};
		if (!mentorId || !skill) return res.status(400).json({ message: 'mentorId and skill required' });
		if (String(mentorId) === String(req.user._id)) return res.status(400).json({ message: 'Cannot request yourself' });
		const mentor = await User.findById(mentorId).lean();
		if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
		const session = await Session.create({ mentor: mentorId, learner: req.user._id, skill, message });
		return res.status(201).json(session);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create session' });
	}
}

export async function listMySessions(req, res) {
	const userId = req.user._id;
	const sessions = await Session.find({ $or: [{ mentor: userId }, { learner: userId }] })
		.sort({ updatedAt: -1 })
		.populate('mentor', 'name avatarUrl')
		.populate('learner', 'name avatarUrl')
		.lean();
	return res.json({ sessions });
}

export async function getSessionById(req, res) {
	const session = await Session.findById(req.params.id)
		.populate('mentor', 'name avatarUrl')
		.populate('learner', 'name avatarUrl')
		.lean();
	if (!session) return res.status(404).json({ message: 'Not found' });
	// authorization
	if (String(session.mentor._id) !== String(req.user._id) && String(session.learner._id) !== String(req.user._id)) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	return res.json(session);
}

export async function acceptSession(req, res) {
	const session = await Session.findById(req.params.id);
	if (!session) return res.status(404).json({ message: 'Not found' });
	if (String(session.mentor) !== String(req.user._id)) return res.status(403).json({ message: 'Only mentor can accept' });
	session.status = 'accepted';
	await session.save();
	return res.json(session);
}

export async function declineSession(req, res) {
	const session = await Session.findById(req.params.id);
	if (!session) return res.status(404).json({ message: 'Not found' });
	if (String(session.mentor) !== String(req.user._id)) return res.status(403).json({ message: 'Only mentor can decline' });
	session.status = 'declined';
	await session.save();
	return res.json(session);
}

export async function completeSession(req, res) {
	const session = await Session.findById(req.params.id);
	if (!session) return res.status(404).json({ message: 'Not found' });
	// either user can mark complete
	if (String(session.mentor) !== String(req.user._id) && String(session.learner) !== String(req.user._id)) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	session.status = 'completed';
	await session.save();
	// increment completedSessions for both and award simple badge thresholds
	const mentor = await User.findById(session.mentor);
	const learner = await User.findById(session.learner);
	for (const u of [mentor, learner]) {
		u.completedSessions = (u.completedSessions || 0) + 1;
		const badges = new Set(u.badges || []);
		if (u.completedSessions >= 1) badges.add('Getting Started');
		if (u.completedSessions >= 5) badges.add('Active Learner');
		if (u.completedSessions >= 10) badges.add('Mentor Star');
		u.badges = Array.from(badges);
		await u.save();
	}
	return res.json({ ok: true });
}

export async function generateCertificate(req, res) {
	const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
	const session = await Session.findById(req.params.id).populate('mentor', 'name').populate('learner', 'name');
	if (!session) return res.status(404).json({ message: 'Not found' });
	if (session.status !== 'completed') return res.status(400).json({ message: 'Session not completed' });
	if (String(session.mentor._id) !== String(req.user._id) && String(session.learner._id) !== String(req.user._id)) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	const filename = `certificate-${session._id}.pdf`;
	const filepath = path.join(uploadsDir, filename);
	const doc = new PDFDocument({ size: 'A4', margin: 50 });
	const stream = fs.createWriteStream(filepath);
	doc.pipe(stream);
	doc.fontSize(24).text('SkillSync Micro-Certificate', { align: 'center' });
	doc.moveDown();
	doc.fontSize(14).text(`This certifies that ${session.learner.name} completed a session on ${session.skill}`, { align: 'center' });
	doc.moveDown();
	doc.fontSize(12).text(`Mentor: ${session.mentor.name}`, { align: 'center' });
	doc.moveDown();
	doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
	doc.end();
	await new Promise((resolve) => stream.on('finish', resolve));
	session.certificateUrl = `/uploads/${filename}`;
	await session.save();
	return res.json({ certificateUrl: session.certificateUrl });
}