import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

// Add Product
// const addProduct = async (req, res) => {
//   try {
//     const { 
//       name, 
//       description, 
//       price, 
//       category, 
//       subCategory, 
//       sizes, 
//       bestseller, 
//         discount = 0,
//         variants, // expected as JSON string
//         variantLabels // can be comma-separated string or JSON array
//     } = req.body;

//     // Validation
//     if (!name || !description || !price || !category || !subCategory) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "All required fields must be filled." 
//       });
//     }

//     // Process images (support up to 10)
//     const images = [
//       req.files?.image1?.[0],
//       req.files?.image2?.[0],
//       req.files?.image3?.[0],
//       req.files?.image4?.[0],
//       req.files?.image5?.[0],
//       req.files?.image6?.[0],
//       req.files?.image7?.[0],
//       req.files?.image8?.[0],
//       req.files?.image9?.[0],
//       req.files?.image10?.[0]
//     ].filter(Boolean);

//     const imagesUrl = await Promise.all(
//   images.map(async (item) => {
//     if (!item.mimetype.startsWith("image/")) {
//       throw new Error("Invalid image file");
//     }
//     const result = await cloudinary.uploader.upload(item.path, {
//       resource_type: "image",
//     });
//     return result.secure_url;
//   })
// );

//     // const imagesUrl = await Promise.all(
//     //   images.map(async (item) => {
//     //     const result = await cloudinary.uploader.upload(item.path, { 
//     //       resource_type: 'image' 
//     //     });
//     //     return result.secure_url;
//     //   })
//     // );

//     // Process videos
//     const videos = [
//       req.files?.video1?.[0],
//       req.files?.video2?.[0]
//     ].filter(Boolean);

//     // const videosUrl = await Promise.all(
//     //   videos.map(async (item) => {
//     //     const result = await cloudinary.uploader.upload(item.path, { 
//     //       resource_type: 'video' // Changed to video
//     //     });
//     //     return result.secure_url;
//     //   })
//     // );

//     const videosUrl = await Promise.all(
//   videos.map(async (item) => {
//     if (!item.mimetype.startsWith("video/")) {
//       throw new Error("Invalid video file");
//     }
//     const result = await cloudinary.uploader.upload(item.path, {
//       resource_type: "video",
//     });
//     return result.secure_url;
//   })
// );

//     // No separate variant image uploads now; variants will reference one of the product images by imageIndex

//     // Process sizes
//     let parsedSizes = [];
//     try {
//       parsedSizes = sizes ? JSON.parse(sizes) : [];
//       if (!Array.isArray(parsedSizes)) throw new Error();
//     } catch {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid sizes format." 
//       });
//     }

//     // Process variants (if provided). Variants may include: { name, price?, stock?, imageIndex?, discount? }
//     let parsedVariants = [];
//     try {
//       parsedVariants = variants ? JSON.parse(variants) : [];
//       if (!Array.isArray(parsedVariants)) throw new Error();
//     } catch {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid variants format." 
//       });
//     }

//     // Parse variant labels (allow comma-separated string or JSON array); store as array
//     let parsedVariantLabels = ['Flavour'];
//     try {
//       if (variantLabels) {
//         if (typeof variantLabels === 'string') {
//           // try parse JSON array first
//           try {
//             const maybe = JSON.parse(variantLabels);
//             if (Array.isArray(maybe)) parsedVariantLabels = maybe;
//             else parsedVariantLabels = variantLabels.split(',').map(s => s.trim()).filter(Boolean);
//           } catch {
//             parsedVariantLabels = variantLabels.split(',').map(s => s.trim()).filter(Boolean);
//           }
//         } else if (Array.isArray(variantLabels)) {
//           parsedVariantLabels = variantLabels;
//         }
//       }
//     } catch (e) {
//       parsedVariantLabels = ['Flavour'];
//     }

//     // Parse variantGroups if provided (expected JSON array of { label, options: [] })
//     let parsedVariantGroups = [];
//     try {
//       if (req.body.variantGroups) {
//         if (typeof req.body.variantGroups === 'string') parsedVariantGroups = JSON.parse(req.body.variantGroups);
//         else parsedVariantGroups = req.body.variantGroups;
//         if (!Array.isArray(parsedVariantGroups)) parsedVariantGroups = [];
//       }
//     } catch (e) {
//       parsedVariantGroups = [];
//     }

//     // If variantGroups are provided as simple groups -> variants (label + variants[]), flatten them into parsedVariants
//     try {
//       if (parsedVariantGroups && Array.isArray(parsedVariantGroups) && parsedVariantGroups.length > 0) {
//         const flattened = [];
//         parsedVariantGroups.forEach((g, gi) => {
//           if (g.variants && Array.isArray(g.variants)) {
//             g.variants.forEach((vv, vi) => {
//               const composedName = vv.name && vv.name.trim() ? vv.name.trim() : `${g.label || ''}`.trim();
//               // uid for variant so frontend/cart can reference specific variant
//               const uid = `${Date.now().toString(36)}-${gi}-${vi}-${Math.random().toString(36).slice(2,6)}`;
//               flattened.push({
//                 uid,
//                 name: composedName,
//                 price: vv.price !== undefined && vv.price !== '' ? Number(vv.price) : undefined,
//                 stock: vv.stock !== undefined && vv.stock !== '' ? Number(vv.stock) : undefined,
//                 imageIndex: vv.imageIndex !== undefined && vv.imageIndex !== '' ? Number(vv.imageIndex) : undefined,
//                 discount: vv.discount !== undefined && vv.discount !== '' ? Number(vv.discount) : undefined,
//                 meta: { groupIndex: gi, variantIndex: vi, groupLabel: g.label }
//               });
//             });
//           }
//         });
//         // Merge flattened variants with any explicitly-provided parsedVariants (from the flat editor)
//         if (parsedVariants && parsedVariants.length > 0) parsedVariants = [...parsedVariants, ...flattened];
//         else parsedVariants = flattened;
//       }

//       // Map variant imageIndex (if provided) to imagesUrl entries
//       if (parsedVariants.length > 0 && imagesUrl.length > 0) {
//         parsedVariants = parsedVariants.map((v) => {
//           const copy = { ...v };
//           if (v.imageIndex) {
//             const idx = Number(v.imageIndex) - 1; // imageIndex is 1-based from admin
//             if (!isNaN(idx) && imagesUrl[idx]) copy.images = [imagesUrl[idx]];
//           }
//           return copy;
//         });
//       }
//     } catch (e) {
//       // ignore flattening errors and proceed with parsedVariants as-is
//     }

//     // Generate a URL-friendly slug from name to avoid duplicate-null slug index errors
//     const slugify = (text) => {
//       return text
//         .toString()
//         .trim()
//         .toLowerCase()
//         .replace(/\s+/g, '-')           // Replace spaces with -
//         .replace(/[^a-z0-9\-]/g, '')    // Remove all non-alphanumeric and -
//         .replace(/-+/g, '-')            // Replace multiple - with single -
//         .replace(/^-|-$/g, '');         // Trim - from start/end
//     };

//     let baseSlug = slugify(name || 'product');
//     let slug = baseSlug;
//     // Ensure slug uniqueness (append short suffix if conflict)
//     let counter = 0;
//     while (await productModel.findOne({ slug })) {
//       counter += 1;
//       slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}${counter}`;
//       if (counter > 5) break; // safety
//     }

//     // Create product
//     const productData = {
//       name,
//       description,
//       manufacturerDetails: req.body.manufacturerDetails || '',
//       manufacturerLabel: req.body.manufacturerLabel || 'Manufacturer Details',
//       slug,
//       category,
//       price: Number(price),
//       subCategory,
//       bestseller: bestseller === "true",
//       sizes: parsedSizes,
//       image: imagesUrl,
//       videos: videosUrl, // Added videos
//       discount: Math.min(100, Math.max(0, Number(discount))),
//       variants: parsedVariants,
//       variantLabels: parsedVariantLabels,
//       variantGroups: parsedVariantGroups,
//       date: Date.now(),
//     };

//     const product = await productModel.create(productData);

//     res.json({ 
//       success: true, 
//       message: "Product Added",
//       product
//     });

//   } catch (error) {
//     console.error("Add Product Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || "Failed to add product" 
//     });
//   }
// };



const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      subCategory, 
      sizes, 
      bestseller, 
      discount = 0,
      variants, 
      variantLabels,
      variantGroups,
      manufacturerDetails,
      manufacturerLabel
    } = req.body;

    // 1. Process images (support up to 10)
    const imageFiles = [
      req.files?.image1?.[0], req.files?.image2?.[0], req.files?.image3?.[0],
      req.files?.image4?.[0], req.files?.image5?.[0], req.files?.image6?.[0],
      req.files?.image7?.[0], req.files?.image8?.[0], req.files?.image9?.[0],
      req.files?.image10?.[0]
    ].filter(Boolean);

    const imagesUrl = await Promise.all(
      imageFiles.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    // 2. Process videos (Matching frontend keys: video1, video2)
    const videoFiles = [
      req.files?.video1?.[0],
      req.files?.video2?.[0]
    ].filter(Boolean);

    const videosUrl = await Promise.all(
      videoFiles.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { 
          resource_type: "video", // Crucial for Cloudinary to accept MP4/MOV
          chunk_size: 6000000 // Helpful for larger files
        });
        return result.secure_url;
      })
    );

    // 3. Parse JSON strings from FormData
    let parsedSizes = [];
    try { parsedSizes = sizes ? JSON.parse(sizes) : []; } catch (e) { parsedSizes = []; }

    let parsedVariants = [];
    try { parsedVariants = variants ? JSON.parse(variants) : []; } catch (e) { parsedVariants = []; }

    let parsedVariantGroups = [];
    try {
      if (typeof variantGroups === 'string') {
        parsedVariantGroups = JSON.parse(variantGroups);
      } else {
        parsedVariantGroups = variantGroups || [];
      }
    } catch (e) { parsedVariantGroups = []; }

    // 4. Handle Variant Flattening Logic
    if (parsedVariantGroups.length > 0) {
      const flattened = [];
      parsedVariantGroups.forEach((g, gi) => {
        if (g.variants && Array.isArray(g.variants)) {
          g.variants.forEach((vv, vi) => {
            const composedName = vv.name && vv.name.trim() ? vv.name.trim() : `${g.label || ''}`.trim();
            const uid = `${Date.now().toString(36)}-${gi}-${vi}`;
            
            const variantObj = {
              uid,
              name: composedName,
              price: vv.price ? Number(vv.price) : undefined,
              stock: vv.stock ? Number(vv.stock) : 0,
              discount: vv.discount ? Number(vv.discount) : undefined,
              meta: { groupIndex: gi, variantIndex: vi, groupLabel: g.label }
            };

            // Link image from the main product images based on index
            if (vv.imageIndex) {
              const idx = Number(vv.imageIndex) - 1;
              if (imagesUrl[idx]) variantObj.images = [imagesUrl[idx]];
            }
            flattened.push(variantObj);
          });
        }
      });
      parsedVariants = [...parsedVariants, ...flattened];
    }

    // 5. Slug generation
    const slug = name.toLowerCase().split(' ').join('-') + '-' + Date.now();

    // 6. Create product in DB
    const productData = {
      name,
      description,
      manufacturerDetails: manufacturerDetails || '',
      manufacturerLabel: manufacturerLabel || 'Manufacturer Details',
      slug,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      videos: videosUrl, // This matches the "videos" field in your Product.jsx
      discount: Number(discount),
      variants: parsedVariants,
      variantGroups: parsedVariantGroups,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully", product });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Update Product (Fixed Version)
// const updateProduct = async (req, res) => {
//   try {
//     const { id, ...updateData } = req.body;

//     // Validate ID
//     if (!id) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Product ID is required" 
//       });
//     }

//     // Process images if updated: preserve slot positions (image1..image10)
//     let updatedImagesBySlot = null; // will be an array of length 10 (some slots may be null)
//     // First, load existing product images to preserve state
//     const existingProductForImages = await productModel.findById(id).select('image');
//     const existingImages = (existingProductForImages && Array.isArray(existingProductForImages.image)) ? existingProductForImages.image : [];

//     // Initialize slots from existing images (keep indices stable)
//     const imagesSlots = new Array(10).fill(null);
//     for (let i = 0; i < 10; i++) {
//       imagesSlots[i] = existingImages[i] || null;
//     }

//     // For each possible slot, if a new file is provided upload and replace that slot.
//     // Also support removeImageN flags sent from frontend to explicitly clear a slot.
//     for (let i = 0; i < 10; i++) {
//       const file = req.files?.[`image${i + 1}`]?.[0];
//       if (file) {
//         const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
//         imagesSlots[i] = result.secure_url;
//       } else if (req.body && req.body[`removeImage${i + 1}`] === 'true') {
//         imagesSlots[i] = null;
//       }
//     }

//     // Only set updatedImagesBySlot if any change happened (at least one non-null or removal/upload)
//     updatedImagesBySlot = imagesSlots;

//     // Process videos if updated
//     let updatedVideos;
//     const newVideos = [
//       req.files?.video1?.[0],
//       req.files?.video2?.[0]
//     ].filter(Boolean);

//     if (newVideos.length > 0) {
//       updatedVideos = await Promise.all(
//         newVideos.map(async (item) => {
//           const result = await cloudinary.uploader.upload(item.path, { 
//             resource_type: "video" // Changed to video
//           });
//           return result.secure_url;
//         })
//       );
//     }

//     // No separate variant image uploads on update; admin can update product images and provide imageIndex in variants

//     // Prepare update object
//     const update = {
//       ...updateData,
//       ...(updateData.price && { price: Number(updateData.price) }),
//       ...(updateData.discount !== undefined && { 
//         discount: Math.min(100, Math.max(0, Number(updateData.discount)))
//       }),
//   ...(updatedImagesBySlot && { image: updatedImagesBySlot }),
//       ...(updatedVideos && { videos: updatedVideos }), // Added videos
//       ...(updateData.manufacturerDetails !== undefined && { manufacturerDetails: updateData.manufacturerDetails }),
//       ...(updateData.manufacturerLabel !== undefined && { manufacturerLabel: updateData.manufacturerLabel }),
//       ...(updateData.bestseller !== undefined && { 
//         bestseller: updateData.bestseller === "true" 
//       })
//     };

//     if (updateData.variantLabel !== undefined) {
//       update.variantLabel = updateData.variantLabel;
//     }

//     // If name is being updated and slug not explicitly provided, regenerate unique slug
//     if (updateData.name && !updateData.slug) {
//       const slugify = (text) => {
//         return text
//           .toString()
//           .trim()
//           .toLowerCase()
//           .replace(/\s+/g, '-')
//           .replace(/[^a-z0-9\-]/g, '')
//           .replace(/-+/g, '-')
//           .replace(/^-|-$/g, '');
//       };

//       let baseSlug = slugify(updateData.name || 'product');
//       let slug = baseSlug;
//       let counter = 0;
//       while (await productModel.findOne({ slug, _id: { $ne: id } })) {
//         counter += 1;
//         slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}${counter}`;
//         if (counter > 5) break;
//       }
//       update.slug = slug;
//     }

//     // Handle variants update and map imageIndex to product images if provided
//     if (updateData.variants) {
//       // Try to parse variants from updateData if provided
//       let parsedUpdateVariants = [];
//       if (updateData.variants) {
//         try {
//           parsedUpdateVariants = JSON.parse(updateData.variants);
//           if (!Array.isArray(parsedUpdateVariants)) parsedUpdateVariants = [];
//         } catch (e) {
//           return res.status(400).json({ success: false, message: 'Invalid variants format.' });
//         }
//       }
//       // Map imageIndex to the updated images (if product images are updated in this request)
//       if (parsedUpdateVariants.length > 0) {
//   // If images were updated in this request, updatedImagesBySlot holds the new URLs
//   const currentImages = updatedImagesBySlot || undefined;
//         parsedUpdateVariants = parsedUpdateVariants.map((v) => {
//           const copy = { ...v };
//           if (v.imageIndex) {
//             const idx = Number(v.imageIndex) - 1;
//             if (!isNaN(idx)) {
//               // Prefer updatedImages (if provided), else the existing product images will be mapped later when resolving single product
//               if (currentImages && currentImages[idx]) {
//                 copy.images = [currentImages[idx]];
//               }
//             }
//           }
//           return copy;
//         });
//       }

//       update.variants = parsedUpdateVariants;
//     }

//     // Process sizes if updated
//     if (updateData.sizes) {
//       try {
//         update.sizes = JSON.parse(updateData.sizes);
//         if (!Array.isArray(update.sizes)) throw new Error();
//       } catch {
//         return res.status(400).json({ 
//           success: false, 
//           message: "Invalid sizes format." 
//         });
//       }
//     }

//     // Handle variantLabels update if provided (comma-separated or JSON array)
//     if (updateData.variantLabels !== undefined) {
//       try {
//         let parsed = updateData.variantLabels;
//         if (typeof parsed === 'string') {
//           try { parsed = JSON.parse(parsed); } catch { parsed = parsed.split(',').map(s => s.trim()).filter(Boolean); }
//         }
//         if (Array.isArray(parsed)) update.variantLabels = parsed;
//         else update.variantLabels = [String(parsed)];
//       } catch (e) {
//         // ignore
//       }
//     }

//     // Handle variantGroups update if provided (expect JSON array)
//     if (updateData.variantGroups !== undefined) {
//       try {
//         let parsed = updateData.variantGroups;
//         if (typeof parsed === 'string') parsed = JSON.parse(parsed);
//         if (Array.isArray(parsed)) update.variantGroups = parsed;
//       } catch (e) {
//         // ignore
//       }
//     }

//     // If nested variantGroups provided in update, flatten their variants into update.variants
//     if (update.variantGroups && Array.isArray(update.variantGroups) && update.variantGroups.length > 0) {
//       try {
//         const flattened = [];
//         update.variantGroups.forEach((g, gi) => {
//           if (g.variants && Array.isArray(g.variants)) {
//             g.variants.forEach((vv, vi) => {
//               const composedName = vv.name && vv.name.trim() ? vv.name.trim() : `${g.label || ''}`.trim();
//               const uid = `${Date.now().toString(36)}-${gi}-${vi}-${Math.random().toString(36).slice(2,6)}`;
//               flattened.push({
//                 uid,
//                 name: composedName,
//                 price: vv.price !== undefined && vv.price !== '' ? Number(vv.price) : undefined,
//                 stock: vv.stock !== undefined && vv.stock !== '' ? Number(vv.stock) : undefined,
//                 imageIndex: vv.imageIndex !== undefined && vv.imageIndex !== '' ? Number(vv.imageIndex) : undefined,
//                 discount: vv.discount !== undefined && vv.discount !== '' ? Number(vv.discount) : undefined,
//                 meta: { groupIndex: gi, variantIndex: vi, groupLabel: g.label }
//               });
//             });
//           }
//         });
//         // Merge: if update.variants exists, append flattened; else set flattened
//         if (update.variants && Array.isArray(update.variants) && update.variants.length > 0) {
//           update.variants = [...update.variants, ...flattened];
//         } else {
//           update.variants = flattened;
//         }
//         // Map imageIndex to updatedImagesBySlot if present
//         if (update.variants && updatedImagesBySlot && updatedImagesBySlot.length > 0) {
//           update.variants = update.variants.map((v) => {
//             const copy = { ...v };
//             if (v.imageIndex) {
//               const idx = Number(v.imageIndex) - 1;
//               if (!isNaN(idx) && updatedImagesBySlot[idx]) copy.images = [updatedImagesBySlot[idx]];
//             }
//             return copy;
//           });
//         }
//       } catch (e) {
//         // ignore
//       }
//     }

//     // If we processed images into slots, include them in the update (preserve ordering with nulls where cleared)
//     if (updatedImagesBySlot) {
//       // Keep the array as-is so admin placeholder indices continue to map to the same slots.
//       update.image = updatedImagesBySlot;
//     }

//     // If variants provided and they reference imageIndex, map their images from the updated image slots (or existing images if not updated)
//     if (update.variants && Array.isArray(update.variants) && update.variants.length > 0) {
//       update.variants = update.variants.map((v) => {
//         const copy = { ...v };
//         if (v.imageIndex) {
//           const idx = Number(v.imageIndex) - 1;
//           if (!isNaN(idx)) {
//             // prefer updated slot if present, else fall back to existingImages
//             const url = (updatedImagesBySlot && updatedImagesBySlot[idx]) || existingImages[idx] || undefined;
//             if (url) copy.images = [url];
//             else copy.images = [];
//           }
//         }
//         return copy;
//       });
//     }

//     // Perform update
//     const updatedProduct = await productModel.findByIdAndUpdate(
//       id,
//       update,
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Product not found" 
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: "Product updated successfully",
//       product: updatedProduct 
//     });

//   } catch (error) {
//     console.error("Update Product Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || "Failed to update product" 
//     });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) return res.status(404).json({ success: false, message: "Product not found" });

    // --- 1. Images Logic (Slots 1-10) ---
    // Ensure we have a clean array of 10 items based on existing data
    const existingImages = Array.isArray(existingProduct.image) ? existingProduct.image : [];
    const imagesSlots = new Array(10).fill(null).map((_, i) => existingImages[i] || null);

    let imageChanged = false;
    // Update slots with new files or removals
    for (let i = 0; i < 10; i++) {
      const file = req.files?.[`image${i + 1}`]?.[0];
      if (file) {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
        imagesSlots[i] = result.secure_url;
        imageChanged = true;
      } else if (req.body && req.body[`removeImage${i + 1}`] === 'true') {
        imagesSlots[i] = null;
        imageChanged = true;
      }
    }
    // Resulting array of URLs (filter out nulls later if needed, but keeping slots allows index mapping)
    const updatedImagesBySlot = imageChanged ? imagesSlots : existingImages;

    // --- 2. Videos Logic ---
    const existingVideos = Array.isArray(existingProduct.videos) ? existingProduct.videos : [];
    const videoSlots = new Array(2).fill(null).map((_, i) => existingVideos[i] || null);
    
    let videoChanged = false;
    for (let i = 0; i < 2; i++) {
        const file = req.files?.[`video${i + 1}`]?.[0];
        if (file) {
            const result = await cloudinary.uploader.upload(file.path, { resource_type: 'video', chunk_size: 6000000 });
            videoSlots[i] = result.secure_url;
            videoChanged = true;
        } else if (req.body && req.body[`removeVideo${i + 1}`] === 'true') {
            videoSlots[i] = null;
            videoChanged = true;
        }
    }
    const updatedVideosBySlot = videoChanged ? videoSlots : existingVideos;

    // --- 3. Prepare Base Update ---
    const update = {
      ...updateData,
      // Filter out nulls for the main image array
      ...(imageChanged && { image: updatedImagesBySlot.filter(Boolean) }),
      ...(videoChanged && { videos: updatedVideosBySlot.filter(Boolean) }),
    };

    // Parse numeric fields safely
    if (updateData.price) update.price = Number(updateData.price);
    if (updateData.discount !== undefined) update.discount = Number(updateData.discount);
    if (updateData.bestseller !== undefined) update.bestseller = updateData.bestseller === "true";

    // --- 4. Variants Logic ---
    // Parse Variant Groups string to JSON
    if (updateData.variantGroups) {
      try {
        let parsed = updateData.variantGroups;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) update.variantGroups = parsed;
      } catch (e) { console.error("Error parsing variantGroups", e); }
    }

    // Flatten Variant Groups into 'variants' array for Frontend Logic
    if (update.variantGroups && Array.isArray(update.variantGroups)) {
      const flattened = [];
      
      update.variantGroups.forEach((g, gi) => {
        if (g.variants && Array.isArray(g.variants)) {
          g.variants.forEach((vv, vi) => {
            // Safe Name
            const composedName = vv.name && String(vv.name).trim() ? String(vv.name).trim() : `${g.label || ''}`.trim();
            const uid = `${id}-${gi}-${vi}-${Date.now()}`;

            // STRICT Number parsing. If empty string, set to undefined so it falls back to product price
            const vPrice = (vv.price !== undefined && vv.price !== '') ? Number(vv.price) : undefined;
            const vStock = (vv.stock !== undefined && vv.stock !== '') ? Number(vv.stock) : 0;
            const vDiscount = (vv.discount !== undefined && vv.discount !== '') ? Number(vv.discount) : undefined;

            // Map Image Index to Actual URL
            let variantImages = [];
            if (vv.imageIndex) {
                const idx = Number(vv.imageIndex) - 1; // 1-based to 0-based
                // Check if the slot has an image URL
                if (!isNaN(idx) && updatedImagesBySlot[idx]) {
                    variantImages = [updatedImagesBySlot[idx]];
                }
            }

            flattened.push({
              uid,
              name: composedName,
              price: vPrice,
              stock: vStock,
              discount: vDiscount,
              imageIndex: vv.imageIndex, // Store for Admin UI reference
              images: variantImages,     // Store actual URL for Frontend
              meta: { groupIndex: gi, variantIndex: vi, groupLabel: g.label } // Critical for selection logic
            });
          });
        }
      });
      update.variants = flattened; 
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    
    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update product" });
  }
};

const listProducts = async (req, res) => {
  try {
    const { category, subCategory, onDiscount, sortBy = 'date', sortOrder = 'desc' } = req.query;

    // Build filter
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (onDiscount === "true") filter.discount = { $gt: 0 };

    // Build sort
    const sort = {};
    if (sortBy === 'discount') sort.discount = sortOrder === 'asc' ? 1 : -1;
    else if (sortBy === 'price') sort.price = sortOrder === 'asc' ? 1 : -1;
    else sort.date = sortOrder === 'asc' ? 1 : -1;

    // Query with discount field explicitly included
    const products = await productModel.find(filter)
      .sort(sort)
      .select('name price discount image videos category subCategory date variants variantGroups variantLabels description manufacturerDetails manufacturerLabel bestseller reviews'); // include reviews for admin view

    res.json({ 
      success: true, 
      products,
      count: products.length 
    });

  } catch (error) {
    console.error("List Products Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch products" 
    });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required." 
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Product Removed",
      product: deletedProduct 
    });

  } catch (error) {
    console.error("Remove Product Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to remove product" 
    });
  }
};

// Get Single Product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required." 
      });
    }

    const product = await productModel.findById(productId)
      .select('-__v');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found." 
      });
    }

    res.json({ 
      success: true, 
      product 
    });

  } catch (error) {
    console.error("Single Product Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch product" 
    });
  }
};

export {
  addProduct,
  updateProduct,
  listProducts,
  removeProduct,
  singleProduct,
  addProductReview,
  removeProductReview,
  listAllReviews,
};

// Add review to a product (optional auth). Body: { productId, rating, comment, name }
const addProductReview = async (req, res) => {
  try {
    const { productId, rating, comment, name } = req.body;
    if (!productId || !rating) return res.status(400).json({ success: false, message: 'productId and rating are required' });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Try to extract user from token if provided
    let reviewerName = name || 'Anonymous';
    let userId = null;
    try {
      const token = req.headers.token || req.headers.authorization;
      if (token) {
        const t = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(t, process.env.JWT_SECRET);
        if (decoded && decoded.id) {
          const user = await UserModel.findById(decoded.id).select('name');
          if (user) {
            reviewerName = user.name || reviewerName;
            userId = user._id;
          }
        }
      }
    } catch (e) {
      // ignore token errors, allow anonymous review submission
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
    }

    const review = {
      userId: userId || null,
      name: reviewerName,
      rating: numericRating,
      comment: comment || '',
      date: Date.now()
    };

    // Use atomic $push to avoid triggering full-document validation
    try {
      const updated = await productModel.findByIdAndUpdate(
        productId,
        { $push: { reviews: review } },
        { new: true, runValidators: false }
      );

      if (!updated) return res.status(500).json({ success: false, message: 'Failed to save review' });

      const savedReview = updated.reviews && updated.reviews.length ? updated.reviews[updated.reviews.length - 1] : review;
      return res.json({ success: true, message: 'Review added', review: savedReview });
    } catch (err) {
      console.error('Add review save error (atomic push):', err);
      return res.status(500).json({ success: false, message: 'Failed to save review' });
    }
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};

// Remove a review (admin only). Body: { productId, reviewId }
const removeProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.body;
    if (!productId || !reviewId) return res.status(400).json({ success: false, message: 'productId and reviewId required' });

    // Use atomic $pull to remove the review subdocument. This avoids re-validating the whole product.
    const result = await productModel.updateOne(
      { _id: productId },
      { $pull: { reviews: { _id: reviewId } } }
    );

    // For Mongoose >=6, result.modifiedCount indicates number of documents modified
    const modified = result && (result.modifiedCount || result.nModified || 0);
    if (!modified) {
      // Either product not found or review not present
      // Determine which is the case for a clearer error
      const productExists = await productModel.exists({ _id: productId });
      if (!productExists) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    return res.json({ success: true, message: 'Review removed' });
  } catch (error) {
    console.error('Remove review error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove review' });
  }
};

// List all reviews across products (admin only)
const listAllReviews = async (req, res) => {
  try {
    // Find products that have at least one review
    const productsWithReviews = await productModel.find({ 'reviews.0': { $exists: true } })
      .select('name reviews image')
      .lean();

    // Flatten into array of { productId, productName, review }
    const all = [];
    for (const p of productsWithReviews) {
      const productId = p._id;
      // If product has no name, leave it null so UI doesn't display raw IDs
      const productName = p.name || null;
      const productImage = Array.isArray(p.image) && p.image.length ? p.image[0] : null;
      const reviews = Array.isArray(p.reviews) ? p.reviews : [];
      for (const r of reviews) {
        // Resolve reviewer name if userId is present
        let reviewerName = r.name || null;
        try {
          if ((!reviewerName || reviewerName === 'Anonymous') && r.userId) {
            const user = await UserModel.findById(r.userId).select('name email').lean();
            if (user) reviewerName = user.name || user.email || reviewerName;
          }
        } catch (e) {
          // ignore lookup errors
        }

        const reviewCopy = { ...r, reviewerName: reviewerName || (r.name || 'Anonymous') };
        all.push({ productId, productName, productImage, review: reviewCopy });
      }
    }

    return res.json({ success: true, reviews: all });
  } catch (error) {
    console.error('List all reviews error:', error);
    return res.status(500).json({ success: false, message: 'Failed to list reviews' });
  }
};