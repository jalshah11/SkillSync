import multer from 'multer';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadDir),
	filename: (_req, file, cb) => {
		const ext = file.originalname.split('.').pop();
		const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext || 'bin'}`;
		cb(null, name);
	},
});

function imageFilter(_req, file, cb) {
	if (['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Only image uploads are allowed'));
	}
}

export const upload = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } });