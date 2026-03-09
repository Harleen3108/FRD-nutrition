import { v2 as cloudinary } from 'cloudinary';
import mediaModel from '../models/mediaModel.js';

export const addMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file required' });
    const { caption = '', order = 0, active = 'true' } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
    const m = await mediaModel.create({ image: result.secure_url, caption, order: Number(order) || 0, active: active === 'true' });
    res.json({ success: true, message: 'Media added', media: m });
  } catch (error) {
    console.error('Add media error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to add media' });
  }
};

export const listMedia = async (req, res) => {
  try {
    const media = await mediaModel.find({ active: true }).sort({ order: 1, date: -1 }).limit(100);
    res.json({ success: true, media });
  } catch (error) {
    console.error('List media error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to list media' });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'id required' });
    await mediaModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete' });
  }
};
