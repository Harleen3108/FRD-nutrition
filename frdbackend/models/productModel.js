// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   image: { type: Array, required: true },
//   videos: { type: Array, default: [] }, // Add this line for videos
//   category: { type: String, required: true },
//   manufacturerDetails: { type: String, default: '' },
//   manufacturerLabel: { type: String, default: 'Manufacturer Details' },
//   subCategory: { type: String, required: true },
//   sizes: { type: Array, required: true },
//   // Variants: array of { name, price?, stock, images: [] }
//   variants: { type: Array, default: [] },
//   bestseller: { type: Boolean },
//   popular: { type: Boolean, default: false },

//   slug: { type: String, unique: true, sparse: true },
//   // support multiple labels (stored as array) so product can have e.g. ['Flavour', 'Weight']
//   variantLabels: { type: Array, default: ['Flavour'] },
//   // grouped variant attributes: [{ label: 'Flavour', options: ['Chocolate','Vanilla'] }]
//   variantGroups: { type: Array, default: [] },
//   discount: { type: Number, default: 0 },
//   date: { type: Number, required: true },
//   // Reviews: array of subdocuments
//   reviews: {
//     type: [
//       {
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
//         name: { type: String, required: true },
//         rating: { type: Number, required: true, min: 1, max: 5 },
//         comment: { type: String, default: '' },
//         date: { type: Number, default: Date.now }
//       }
//     ],
//     default: []
//   }
  
// });

// const productModel =
//   mongoose.models.product || mongoose.model("product", productSchema);

// export default productModel;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    videos: { type: Array, default: [] }, // Add this line for videos
    category: { type: String, required: true },
    manufacturerDetails: { type: String, default: '' },
    manufacturerLabel: { type: String, default: 'Manufacturer Details' },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    // Variants: array of { name, price?, stock, images: [] }
    variants: { type: Array, default: [] },
    bestseller: { type: Boolean },
    popular: { type: Boolean, default: false },

    slug: { type: String, unique: true, sparse: true },
    // support multiple labels (stored as array) so product can have e.g. ['Flavour', 'Weight']
    variantLabels: { type: Array, default: ['Flavour'] },
    // grouped variant attributes: [{ label: 'Flavour', options: ['Chocolate','Vanilla'] }]
    variantGroups: { type: Array, default: [] },
    discount: { type: Number, default: 0 },
    date: { type: Number, required: true },

    // Reviews: array of subdocuments
    reviews: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
          name: { type: String, required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: { type: String, default: '' },
          date: { type: Number, default: Date.now }
        }
      ],
      default: []
    }
  },
  {
    timestamps: true // ✅ ADDED (creates createdAt & updatedAt automatically)
  }
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
