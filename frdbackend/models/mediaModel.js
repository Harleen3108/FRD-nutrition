import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  date: { type: Number, default: Date.now }
});

const mediaModel = mongoose.models.media || mongoose.model('media', mediaSchema);

export default mediaModel;
