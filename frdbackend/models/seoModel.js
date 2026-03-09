import mongoose from "mongoose";

const seoSchema = new mongoose.Schema(
  {
    page_slug: { type: String, required: true, unique: true },
    meta_title: { type: String, required: true },
    meta_description: { type: String, required: true },
    meta_keywords: { type: String, required: true },
  },
  { timestamps: true }
);

const seoModel = mongoose.models.seo || mongoose.model("seo", seoSchema);

export default seoModel;
