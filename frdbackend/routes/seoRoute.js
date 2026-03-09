import express from 'express';
import { saveSeo, getSeoBySlug, listSeo, deleteSeo } from '../controllers/seoController.js';
import authUser from '../middleware/auth.js'; // Assuming you have an auth middleware for admin

const seoRouter = express.Router();

// Public route to fetch SEO data for frontend
seoRouter.get('/get/:slug', getSeoBySlug);

// Admin routes (should ideally be protected, but checking server.js admin pattern)
seoRouter.post('/save', saveSeo);
seoRouter.get('/list', listSeo);
seoRouter.delete('/delete/:id', deleteSeo);

export default seoRouter;
