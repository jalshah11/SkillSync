import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import userRoutes from './routes/user.routes.js';
import matchRoutes from './routes/match.routes.js';
import sessionRoutes from './routes/session.routes.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
});
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', userRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/sessions', sessionRoutes);

io.on('connection', (socket) => {
  socket.on('ping', () => socket.emit('pong'));
  socket.on('join:session', (sessionId) => {
    if (typeof sessionId === 'string') {
      socket.join(`session:${sessionId}`);
    }
  });
  socket.on('chat:message', ({ sessionId, text, user }) => {
    if (sessionId && text) {
      io.to(`session:${sessionId}`).emit('chat:message', { sessionId, text, user, ts: Date.now() });
    }
  });
});

connectToDatabase().then(() => {
	httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch((err) => {
	console.error('Failed to connect to DB', err);
	process.exit(1);
});
