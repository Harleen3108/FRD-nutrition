import seoModel from "../models/seoModel.js";

// Add or update SEO data
export const saveSeo = async (req, res) => {
  try {
    const { page_slug, meta_title, meta_description, meta_keywords } = req.body;

    if (!page_slug || !meta_title || !meta_description || !meta_keywords) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Use findOneAndUpdate with upsert: true to create or update
    const seo = await seoModel.findOneAndUpdate(
      { page_slug },
      { meta_title, meta_description, meta_keywords },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "SEO data saved", seo });
  } catch (error) {
    console.error("Save SEO error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to save SEO data" });
  }
};

// Get SEO data by page_slug
export const getSeoBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const seo = await seoModel.findOne({ page_slug: slug });
    
    if (!seo) {
      return res.json({ success: false, message: "SEO data not found" });
    }

    res.json({ success: true, seo });
  } catch (error) {
    console.error("Get SEO error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch SEO data" });
  }
};

// List all SEO records
export const listSeo = async (req, res) => {
  try {
    const seoList = await seoModel.find({}).sort({ updatedAt: -1 });
    res.json({ success: true, seoList });
  } catch (error) {
    console.error("List SEO error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to list SEO records" });
  }
};

// Delete SEO record
export const deleteSeo = async (req, res) => {
  try {
    const { id } = req.params;
    await seoModel.findByIdAndDelete(id);
    res.json({ success: true, message: "SEO record deleted" });
  } catch (error) {
    console.error("Delete SEO error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete SEO record" });
  }
};
