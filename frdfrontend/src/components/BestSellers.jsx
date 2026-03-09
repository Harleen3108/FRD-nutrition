import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BestSeller from './BestSeller';

const BestSellers = () => {
  const { products } = useContext(ShopContext);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(products)) return;

    const filtered = products.filter(
      (item) => item?.subCategory?.toLowerCase() === 'trending'
    );

    setTrendingProducts(filtered.slice(0, 10));
  }, [products]);

  return (
    <div className="my-20 bg-white text-slate-800 px-4 py-14 rounded-xl shadow-xl border border-gray-200">

      {/* Title */}
      <div className="text-center mb-14">
        <Title text1="TRENDING" text2="PRODUCTS" />
        <p className="w-3/4 md:w-1/2 mx-auto text-sm text-slate-600 mt-4">
          What’s hot right now — trending supplements everyone’s talking about.
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        {trendingProducts.length > 0 ? (
          trendingProducts.map((item, index) => {
            const discountedPrice =
              item?.discount > 0
                ? Math.round(item.price - (item.price * item.discount) / 100)
                : item.price;

            return (
              <motion.div
                key={item?._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <ProductItem
                  id={item?._id}
                  image={Array.isArray(item?.image) ? item.image : [item?.image]}
                  name={item?.name}
                  price={String(discountedPrice)}
                  originalPrice={String(item?.price)}
                  discount={item?.discount}
                  showStars={false}
                  showDiscountBadge={false}
                />
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-slate-600">
            No trending products found.
          </p>
        )}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button
          onClick={() => navigate('/collection?subCategory=Trending')}
          className="px-8 py-3 rounded-full bg-black text-white font-medium
                     hover:bg-gray-800 transition-all duration-300"
        >
          View All Trending Products →
        </button>
      </div>

    </div>
  );
};

export default BestSellers;
