import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateStudyPlan(req, res) {
	try {
		const { topic = 'general', skillLevel = 'beginner', goals = [] } = req.body || {};
		if (!openai) {
			return res.json({
				stub: true,
				message: 'AI study plan generation is not configured (missing OPENAI_API_KEY)',
				input: { topic, skillLevel, goals },
				examplePlan: [
					{ day: 1, focus: `Introduction to ${topic}` },
					{ day: 2, focus: `${topic} fundamentals` },
				],
			});
		}

		const system = 'You are a helpful study planner that creates concise, day-by-day plans.';
		const user = `Create a 7-day study plan for ${topic} for a ${skillLevel} learner. Goals: ${goals.join(', ')}`;
		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: system },
				{ role: 'user', content: user },
			],
			max_tokens: 600,
		});
		const content = response.choices?.[0]?.message?.content || '';
		return res.json({ plan: content });
	} catch (_err) {
		return res.status(500).json({ message: 'Failed to generate plan' });
	}
}

