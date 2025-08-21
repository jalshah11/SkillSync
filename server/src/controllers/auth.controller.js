import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const jwtCookieName = 'skillsync_token';
const jwtExpires = 60 * 60 * 24 * 7; // 7 days in seconds

export async function register(req, res) {
	try {
		const { name, email, password } = req.body;
		const existing = await User.findOne({ email });
		if (existing) return res.status(409).json({ message: 'Email already in use' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash });
		return res.status(201).json({ id: user._id, name: user.name, email: user.email });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

export async function login(req, res) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		const ok = await user.comparePassword(password);
		const token = jwt.sign({ sub: user._id, roles: user.roles }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: jwtExpires });
		const isProd = process.env.NODE_ENV === 'production';
		res.cookie(jwtCookieName, token, { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', maxAge: jwtExpires * 1000, path: '/' });
		return res.json({ id: user._id, name: user.name, email: user.email, roles: user.roles });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
}

export async function me(req, res) {
	return res.json({ id: req.user._id, name: req.user.name, email: req.user.email, roles: req.user.roles });
}

export async function logout(_req, res) {
	res.clearCookie(jwtCookieName, { path: '/' });
	return res.json({ ok: true });
}
