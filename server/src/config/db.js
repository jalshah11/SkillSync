import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

export async function connectToDatabase() {
	let mongoUri = process.env.MONGODB_URI || '';
	const useMemory = (!mongoUri && process.env.USE_MEMORY_DB !== '0');

	mongoose.set('strictQuery', true);

	if (useMemory) {
		memoryServer = await MongoMemoryServer.create();
		mongoUri = memoryServer.getUri();
	}

	await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/skillsync', { dbName: process.env.MONGODB_DB || undefined });
	console.log(`Connected to MongoDB${useMemory ? ' (in-memory)' : ''}`);
}

export async function disconnectDatabase() {
	await mongoose.disconnect();
	if (memoryServer) {
		await memoryServer.stop();
		memoryServer = undefined;
	}
}
