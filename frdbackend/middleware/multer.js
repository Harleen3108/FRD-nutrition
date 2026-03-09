// import multer from "multer";

// const storage = multer.diskStorage({
//     filename:function(req,file,callback){
//         callback(null,file.originalname)
//     }
// })

// const upload = multer({storage})

// export default upload
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});


// <!doctype html>
// <html lang="en" class="scroll-smooth">
//   <head>
//     <meta charset="UTF-8" />
//     <link rel="icon" type="image/svg+xml" href="logo1.png" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//     <!-- Primary SEO -->
//     <title>FRD Nutrition – Sports & Health Supplements</title>
//     <meta
//       name="description"
//       content="FRD Nutrition  offers high-quality sports and health supplements, including whey protein, vitamins and daily wellness products delivered across India."
//     />
//     <meta
//       name="keywords"
//       content="FRD Nutrition, FRD Nutrition Rohtak FRD Nutrition Premium, sports nutrition, whey protein, supplements, health supplements, gym supplements, wellness products"
//     />
//     <meta name="author" content="FRD Nutrition " />
//     <meta name="robots" content="index,follow" />

//     <!-- Canonical URL -->
//     <link rel="canonical" href="https://www.frdnutritionpremium.com/" />

//     <!-- Open Graph / Facebook -->
//     <meta property="og:type" content="website" />
//     <meta
//       property="og:title"
//       content="FRD Nutrition  – Sports & Health Supplements"
//     />
//     <meta
//       property="og:description"
//       content="Shop trusted sports and health supplements from FRD Nutrition . Quality products for muscle gain, recovery and everyday wellness."
//     />
//     <meta
//       property="og:url"
//       content="https://www.frdnutritionpremium.com/"
//     />
//     <meta
//       property="og:image"
//       content="https://www.frdnutritionpremium.com/og-image.jpg"
//     />
//     <meta property="og:site_name" content="FRD Nutrition " />

//     <!-- Twitter Card -->
//     <meta name="twitter:card" content="summary_large_image" />
//     <meta
//       name="twitter:title"
//       content="FRD Nutrition  – Sports & Health Supplements"
//     />
//     <meta
//       name="twitter:description"
//       content="High-quality sports and health supplements from FRD Nutrition ."
//     />
//     <meta
//       name="twitter:image"
//       content="https://www.frdnutritionpremium.com/og-image.jpg"
//     />

//     <!-- Google tag (gtag.js) -->
//     <script
//       async
//       src="https://www.googletagmanager.com/gtag/js?id=G-2R64TLCG97"
//     ></script>
//     <script>
//       window.dataLayer = window.dataLayer || [];
//       function gtag() {
//         dataLayer.push(arguments);
//       }
//       gtag("js", new Date());
//       gtag("config", "G-2R64TLCG97");
//     </script>
//   </head>
//   <body>
//     <div id="root"></div>
//     <script type="module" src="/src/main.jsx"></script>
//     <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
//   </body>
// </html>
