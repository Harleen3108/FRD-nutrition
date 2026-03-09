import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const DynamicSEO = () => {
    const { backendUrl } = useContext(ShopContext);
    const location = useLocation();

    useEffect(() => {
        const fetchSEO = async () => {
            let slug = location.pathname;
            
            // Normalize slug
            if (slug === '/') slug = 'home';
            else {
                // Remove leading slash and trailing slashes
                slug = slug.replace(/^\/|\/$/g, '');
            }

            // For product pages, the slug in SEO table could be 'product/product-slug'
            // but the current pathname would be '/product/product-slug'
            // The normalization above handles it ('product/product-slug')

            try {
                const res = await axios.get(`${backendUrl}/api/seo/get/${slug}`);
                if (res.data.success && res.data.seo) {
                    const { meta_title, meta_description, meta_keywords } = res.data.seo;
                    
                    // Update Title
                    if (meta_title) document.title = meta_title;

                    // Update Meta Description
                    if (meta_description) {
                        let descTag = document.querySelector('meta[name="description"]');
                        if (descTag) {
                            descTag.setAttribute('content', meta_description);
                        } else {
                            descTag = document.createElement('meta');
                            descTag.name = "description";
                            descTag.content = meta_description;
                            document.head.appendChild(descTag);
                        }
                    }

                    // Update Meta Keywords
                    if (meta_keywords) {
                        let keywordsTag = document.querySelector('meta[name="keywords"]');
                        if (keywordsTag) {
                            keywordsTag.setAttribute('content', meta_keywords);
                        } else {
                            keywordsTag = document.createElement('meta');
                            keywordsTag.name = "keywords";
                            keywordsTag.content = meta_keywords;
                            document.head.appendChild(keywordsTag);
                        }
                    }
                }
            } catch (err) {
                // Silent fail if no SEO record exists for the slug
            }
        };

        fetchSEO();
    }, [location.pathname, backendUrl]);

    return null; // This component doesn't render anything
};

export default DynamicSEO;
