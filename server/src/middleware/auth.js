import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
	try {
		const header = req.headers.authorization;
		const token = (header && header.startsWith('Bearer ')) ? header.slice(7) : (req.cookies?.skillsync_token);
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
		const user = await User.findById(payload.sub);
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
}

export function requireAdmin(req, res, next) {
	if (!req.user || !(req.user.roles || []).includes('admin')) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	next();
}
