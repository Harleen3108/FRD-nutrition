import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

const slugify = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/test';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    const products = await productModel.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    console.log(`Found ${products.length} products missing slug`);

    for (const p of products) {
      const base = slugify(p.name || `product-${p._id.toString().slice(-4)}`);
      let slug = base;
      let counter = 0;
      while (await productModel.findOne({ slug })) {
        counter += 1;
        slug = `${base}-${Date.now().toString(36).slice(-4)}${counter}`;
        if (counter > 10) break;
      }
      p.slug = slug;
      await p.save();
      console.log(`Updated product ${p._id} -> slug: ${slug}`);
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
