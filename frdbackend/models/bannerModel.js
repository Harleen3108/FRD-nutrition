import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  link: { type: String, default: '' }, // store product id or route or external URL
  title: { type: String, default: '' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  date: { type: Number, default: Date.now }
});

const bannerModel = mongoose.models.banner || mongoose.model('banner', bannerSchema);

export default bannerModel;
