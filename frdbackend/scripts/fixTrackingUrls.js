import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import orderModel from '../models/orderModel.js';

const run = async () => {
  try {
    await connectDB();
    console.log('DB Connected for trackingUrl fix');

    const orders = await orderModel.find({ trackingUrl: { $exists: true, $ne: '' } });
    console.log(`Found ${orders.length} orders with trackingUrl`);

    let updated = 0;
    for (const o of orders) {
      const raw = (o.trackingUrl || '').toString().trim();
      if (!raw) continue;
      try {
        new URL(raw);
        // already absolute
      } catch (err) {
        // try prefixing
        const normalized = 'https://' + raw.replace(/^https?:\/\//i, '');
        try {
          new URL(normalized);
          o.trackingUrl = normalized;
          await o.save();
          updated++;
          console.log(`Updated order ${o._id} -> ${normalized}`);
        } catch (e) {
          console.warn(`Skipping invalid URL for order ${o._id}: ${raw}`);
        }
      }
    }

    console.log(`Done. Updated ${updated} orders.`);
    process.exit(0);
  } catch (err) {
    console.error('Error in fix script:', err);
    process.exit(1);
  }
};

run();
