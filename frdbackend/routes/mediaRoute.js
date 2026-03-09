import express from 'express';
import upload from '../middleware/multer.js';
import { addMedia, listMedia, deleteMedia } from '../controllers/mediaController.js';

const router = express.Router();

router.post('/add', upload.single('image'), addMedia);
router.get('/list', listMedia);
router.delete('/:id', deleteMedia);

export default router;
