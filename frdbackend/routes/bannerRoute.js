import express from 'express';
import upload from '../middleware/multer.js';
import { addBanner, listBanners, deleteBanner, updateBanner } from '../controllers/bannerController.js';

const router = express.Router();

// Add banner (image upload)
router.post('/add', upload.single('image'), addBanner);

// Get banners
router.get('/list', listBanners);

// Update banner (optionally with new image)
router.put('/:id', upload.single('image'), updateBanner);

// Delete banner
router.delete('/:id', deleteBanner);

export default router;
