import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js'; // Assuming userRoute.js is your userRouter.js
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import mediaRouter from './routes/mediaRoute.js';
import bannerRouter from './routes/bannerRoute.js';
import seoRouter from './routes/seoRoute.js';
import UserModel from './models/userModel.js';


import sitemapRoute from './routes/sitemap.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Seo from './models/seoModel.js';
import productModel from './models/productModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// App Config
const app = express();
const port = process.env.PORT || 4000;

// Initialize database and admin user
const initializeApp = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    
    // Ensure admin user exists (don't crash app if this fails)
    try {
      await UserModel.ensureAdminExists();
    } catch (adminError) {
      console.error('Admin seeding failed, but continuing app startup:', adminError.message);
    }
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
};

initializeApp();

// Middlewares
app.use(express.json());


// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
   const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'https://frdadmin.vercel.app',
      'https://www.frdnutritionpremium.com' ,
      'https://fr-dgym-git-main-sohams-projects-32d50290.vercel.app',
      'https://fr-dgym.vercel.app',
      'https://fr-dgym-gz5o.vercel.app',
      'https://frd-nutrition.vercel.app',
      'https://frd-nutrition-admin.vercel.app'
    ].filter(Boolean); // Remove null/undefined if variables aren't set


    // Check if origin is in allowed list or is a Vercel preview URL or is a local dev origin
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 1. API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/media', mediaRouter);
app.use('/api/seo', seoRouter);

// 2. Static Assets
app.use('/uploads', express.static('uploads'));

// Serve static files from the frontend build folder
// Use path.resolve for more robust absolute pathing across environments (Render/Local)
const frontendPath = path.resolve(__dirname, '../frdfrontend/dist');

// Use static first - it should handle all actual files (css, js, images)
app.use(express.static(frontendPath));

// 3. SEO HTML Injection for SPA Routes
app.get('*', async (req, res, next) => {
  // Enhanced Skip Logic: Never serve HTML for requests that explicitly want images, styles, or scripts
  const hasExt = path.extname(req.path) !== '';
  const isApi = req.path.startsWith('/api');
  const isUpload = req.path.startsWith('/uploads');
  const isSitemap = req.path === '/sitemap.xml';
  const isHtmlRequest = req.headers.accept && req.headers.accept.includes('text/html');

  // If it's a known non-HTML request or an API/Sitemap, skip SEO injection
  if (isApi || isUpload || isSitemap || (hasExt && path.extname(req.path) !== '.html') || (!isHtmlRequest && hasExt)) {
    return next();
  }

  try {
    let rawPath = req.path.replace(/^\/+|\/+$/g, '');
    let slug = rawPath || 'home';

    // 1. Try to find custom SEO data first
    const query = { 
      $or: [
        { page_slug: slug },
        { page_slug: '/' + slug },
        { page_slug: `'${slug}'` },
        { page_slug: `"${slug}"` },
        { page_slug: `'/${slug}'` },
        { page_slug: `"/${slug}"` },
        { page_slug: `/${slug}` },
        { page_slug: slug.startsWith('/') ? slug : '/' + slug }
      ]
    };
    
    let seoData = await Seo.findOne(query);

    // 2. Fallback for Product pages (/product/:slug)
    if (!seoData && (slug.startsWith('product/') || req.path.includes('/product/'))) {
        const productSlug = slug.split('/').pop();
        const product = await productModel.findOne({ slug: productSlug });
        if (product) {
            seoData = {
                meta_title: `${product.name} | FRD Nutrition`,
                meta_description: product.description.substring(0, 160).replace(/<[^>]*>/g, ''), // Strip HTML
                meta_keywords: `${product.category}, ${product.subCategory}, FRD Nutrition`
            };
        }
    }
    
    const indexPath = path.join(frontendPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
      // If index.html is missing, we can't inject. Fallback to 404 or next()
      return next();
    }

    let html = fs.readFileSync(indexPath, 'utf8');

    if (seoData) {
      // Inject SEO tags using robust regex
      html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seoData.meta_title}</title>`);
      
      const descRegex = /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i;
      if (descRegex.test(html)) {
        html = html.replace(descRegex, `<meta name="description" content="${seoData.meta_description}" />`);
      } else {
        html = html.replace('</head>', `<meta name="description" content="${seoData.meta_description}" />\n</head>`);
      }
      
      const keyRegex = /<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/?>/i;
      if (keyRegex.test(html)) {
        html = html.replace(keyRegex, `<meta name="keywords" content="${seoData.meta_keywords}" />`);
      }
      
      // Update/Add Open Graph tags for better social sharing
      html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${seoData.meta_title}" />`);
      html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${seoData.meta_description}" />`);
      
      // Add OG Type and URL if missing
      if (!html.includes('og:type')) {
          html = html.replace('</head>', '<meta property="og:type" content="website" />\n</head>');
      }
    }

    res.header('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('SEO Injection Error:', error);
    next();
  }
});

// 4. Asset 404 Handler: If an asset wasn't found by express.static, don't let it fall through to HTML
app.use('/assets', (req, res) => {
    res.status(404).send('Asset not found');
});


app.use('/', sitemapRoute);


// Start Server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));

