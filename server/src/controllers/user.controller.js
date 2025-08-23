import User from '../models/User.js';

export async function getMyProfile(req, res) {
	const user = req.user;
	return res.json({
		id: user._id,
		name: user.name,
		email: user.email,
		avatarUrl: user.avatarUrl,
		roles: user.roles,
		teachSkills: user.teachSkills,
		learnSkills: user.learnSkills,
		bio: user.bio || '',
	});
}

export async function updateMyProfile(req, res) {
	try {
		const { name, avatarUrl, bio, teachSkills, learnSkills } = req.body || {};
		const update = {};
		if (typeof name === 'string') update.name = name;
		if (typeof avatarUrl === 'string') update.avatarUrl = avatarUrl;
		if (typeof bio === 'string') update.bio = bio;
		if (Array.isArray(teachSkills)) update.teachSkills = teachSkills.map(String);
		if (Array.isArray(learnSkills)) update.learnSkills = learnSkills.map(String);
		const saved = await User.findByIdAndUpdate(req.user._id, update, { new: true });
		return res.json({
			id: saved._id,
			name: saved.name,
			email: saved.email,
			avatarUrl: saved.avatarUrl,
			roles: saved.roles,
			teachSkills: saved.teachSkills,
			learnSkills: saved.learnSkills,
			bio: saved.bio || '',
		});
	} catch (err) {
		return res.status(400).json({ message: 'Invalid profile update' });
	}
}

export async function uploadAvatar(req, res) {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
		const publicPath = `/uploads/${req.file.filename}`;
		const saved = await User.findByIdAndUpdate(req.user._id, { avatarUrl: publicPath }, { new: true });
		return res.json({ avatarUrl: saved.avatarUrl });
	} catch {
		return res.status(500).json({ message: 'Upload failed' });
	}
}

