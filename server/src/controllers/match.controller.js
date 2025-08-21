import User from '../models/User.js';

export async function findMatches(req, res) {
	const currentUser = req.user;
	const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
	const learn = currentUser.learnSkills || [];
	const teach = currentUser.teachSkills || [];

	if (learn.length === 0 && teach.length === 0) {
		return res.json({ matches: [] });
	}

	const query = {
		_id: { $ne: currentUser._id },
		$or: [
			{ teachSkills: { $in: learn } },
			{ learnSkills: { $in: teach } },
		],
	};

	const users = await User.find(query)
		.select('name avatarUrl teachSkills learnSkills bio')
		.limit(limit)
		.lean();

	return res.json({ matches: users });
}

