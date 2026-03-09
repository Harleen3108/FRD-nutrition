import { v2 as cloudinary } from 'cloudinary';
import bannerModel from '../models/bannerModel.js';

// Add banner (expects multipart form-data with field 'image')
export const addBanner = async (req, res) => {
  try {
    const { link = '', title = '', order = 0, active = 'true' } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });

    const banner = await bannerModel.create({
      image: result.secure_url,
      link,
      title,
      order: Number(order) || 0,
      active: active === 'true'
    });

    res.json({ success: true, message: 'Banner added', banner });
  } catch (error) {
    console.error('Add banner error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to add banner' });
  }
};

export const listBanners = async (req, res) => {
  try {
    // Return active banners ordered by 'order' asc. Limit to 10 by default.
    const banners = await bannerModel.find({ active: true }).sort({ order: 1 }).limit(10);
    res.json({ success: true, banners });
  } catch (error) {
    console.error('List banners error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to list banners' });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Banner id required' });
    await bannerModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete banner' });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Banner id required' });

    const update = {};
    if (req.body.link !== undefined) update.link = req.body.link;
    if (req.body.title !== undefined) update.title = req.body.title;
    if (req.body.order !== undefined) update.order = Number(req.body.order) || 0;
    if (req.body.active !== undefined) update.active = req.body.active === 'true';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
      update.image = result.secure_url;
    }

    const banner = await bannerModel.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, message: 'Banner updated', banner });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update banner' });
  }
};
