import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true, index: true },
	passwordHash: { type: String, required: true },
	avatarUrl: { type: String },
	roles: { type: [String], default: ['user'] },
	teachSkills: { type: [String], default: [] },
	learnSkills: { type: [String], default: [] },
	bio: { type: String },
	badges: { type: [String], default: [] },
	completedSessions: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
