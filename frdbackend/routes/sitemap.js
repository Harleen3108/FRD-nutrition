import express from 'express';
import productModel from '../models/productModel.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://www.frdnutritionpremium.com';

    // Fetch only required fields
    const products = await productModel.find(
      { slug: { $ne: null } },
      'slug updatedAt'
    );

    const productUrls = products.map(p => `
      <url>
        <loc>${baseUrl}/product/${p.slug}</loc>
        <lastmod>${new Date(p.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${baseUrl}/collection</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/best-sellers</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/trending-products</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  ${productUrls}

</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);

  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Sitemap generation failed');
  }
});

export default router;
