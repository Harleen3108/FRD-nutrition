import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Seo = ({ token }) => {
  const [pageSlug, setPageSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [seoList, setSeoList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSeoList = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/seo/list`, { headers: { token } });
      if (res.data.success) {
        setSeoList(res.data.seoList || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSeoList();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pageSlug || !metaTitle || !metaDescription || !metaKeywords) {
      return toast.error('All fields are required');
    }
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/seo/save`, {
        page_slug: pageSlug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords
      }, {
        headers: { token }
      });

      if (res.data.success) {
        toast.success('SEO data saved');
        setPageSlug('');
        setMetaTitle('');
        setMetaDescription('');
        setMetaKeywords('');
        fetchSeoList();
      } else {
        toast.error(res.data.message || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setPageSlug(item.page_slug);
    setMetaTitle(item.meta_title);
    setMetaDescription(item.meta_description);
    setMetaKeywords(item.meta_keywords);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this SEO record?')) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/seo/delete/${id}`, { headers: { token } });
      if (res.data.success) {
        toast.success('Deleted');
        fetchSeoList();
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#052659] mb-4">SEO Management</h2>

      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Page Slug / Name</label>
            <input 
              value={pageSlug} 
              onChange={(e) => setPageSlug(e.target.value)} 
              placeholder="e.g. home, about, contact" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#052659]" 
            />
            <p className="text-xs text-gray-500 mt-1">Use 'home' or '/' for home page, or slugs like 'about', 'services'</p>
          </div>
          <div>
            <label className="block mb-1 font-medium">Meta Title</label>
            <input 
              value={metaTitle} 
              onChange={(e) => setMetaTitle(e.target.value)} 
              placeholder="Page title for SEO" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#052659]" 
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Meta Description</label>
          <textarea 
            value={metaDescription} 
            onChange={(e) => setMetaDescription(e.target.value)} 
            placeholder="Brief description of the page content" 
            className="w-full px-3 py-2 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-[#052659]" 
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Meta Keywords (comma-separated)</label>
          <input 
            value={metaKeywords} 
            onChange={(e) => setMetaKeywords(e.target.value)} 
            placeholder="gym, fitness, nutrition, supplements" 
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#052659]" 
          />
        </div>

        <div>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2 bg-[#052659] text-white rounded hover:bg-[#0a3a7a] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save SEO Data'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Configured SEO Pages</h3>
        <div className="space-y-4">
          {seoList.length === 0 ? (
            <p className="text-gray-500">No SEO records found.</p>
          ) : (
            seoList.map(item => (
              <div key={item._id} className="bg-white p-4 rounded shadow border-l-4 border-[#052659]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-[#052659]">Slug: {item.page_slug}</h4>
                    <p className="text-sm font-medium text-gray-700">Title: {item.meta_title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">Desc: {item.meta_description}</p>
                    <p className="text-xs text-gray-500 mt-1 italic">Keywords: {item.meta_keywords}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(item)} 
                      className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Seo;
