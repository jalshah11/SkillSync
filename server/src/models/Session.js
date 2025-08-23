import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
	mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	skill: { type: String, required: true },
	message: { type: String },
	status: { type: String, enum: ['pending', 'accepted', 'declined', 'completed'], default: 'pending' },
	scheduledAt: { type: Date },
	certificateUrl: { type: String },
	videoRoom: { type: String },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;