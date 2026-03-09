

// import React, { useContext, useEffect, useState, useMemo } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from './Title';
// import ProductItem from './ProductItem';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// const LatestCollection = () => {
//   const { products = [], currency } = useContext(ShopContext);
//   const [popularProducts, setPopularProducts] = useState([]);
//   const navigate = useNavigate();

//   // Moving banner images
//   const movingImages = [
//     'https://images.pexels.com/photos/13534122/pexels-photo-13534122.jpeg',
//     'https://images.pexels.com/photos/12314077/pexels-photo-12314077.jpeg',
//     'https://images.pexels.com/photos/7690207/pexels-photo-7690207.jpeg',
//     'https://images.pexels.com/photos/5929236/pexels-photo-5929236.jpeg'
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Banner rotation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % movingImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // ---------- Helpers ----------
//   const toArray = (v) => (Array.isArray(v) ? v : v != null ? [v] : []);
//   const norm = (s) => String(s).toLowerCase();
//   const hasPopular = (val) => toArray(val).some((v) => norm(v).includes('popular'));

//   const isPopularProduct = (item) =>
//     hasPopular(item?.subCategory) ||
//     hasPopular(item?.category) ||
//     hasPopular(item?.tags) ||
//     hasPopular(item?.labels) ||
//     hasPopular(item?.badges) ||
//     item?.isPopular === true ||
//     item?.popular === true;

//   const safeNum = (n, fallback = 0) => {
//     const x = typeof n === 'string' ? parseFloat(n) : n;
//     return Number.isFinite(x) ? x : fallback;
//   };

//   // ---------- Compute popular products ----------
//   const computedPopular = useMemo(() => {
//     if (!Array.isArray(products) || products.length === 0) return [];

//     let list = products.filter(isPopularProduct);

//     if (list.length === 0) {
//       const scored = [...products].map((p) => ({
//         item: p,
//         score:
//           safeNum(p.sold) * 3 +
//           safeNum(p.sales) * 3 +
//           safeNum(p.rating) * 2 +
//           safeNum(p.reviews),
//       }));

//       scored.sort((a, b) => b.score - a.score);
//       list = scored.map((s) => s.item);
//     }

//     return list.slice(0, 10);
//   }, [products]);

//   useEffect(() => {
//     setPopularProducts(computedPopular);
//   }, [computedPopular]);

//   // ---------- Render ----------
//   return (
//     <div className="my-20 bg-white text-slate-800 px-4 py-14 rounded-xl shadow-xl border border-gray-200">

//       {/* Title */}
//       <div className="text-center mb-14">
//         <Title text1="POPULAR" text2="SUPPLEMENTS" />
//         <p className="w-3/4 md:w-1/2 mx-auto text-sm text-slate-600 mt-4">
//           Trusted by athletes and fitness enthusiasts — explore our most popular,
//           performance-boosting supplements.
//         </p>
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
//         {popularProducts.length > 0 ? (
//           popularProducts.map((item, index) => {
//             const price = Math.round(safeNum(item?.price));
//             const discount = safeNum(item?.discount);
//             const hasDiscount = discount > 0;

//             const discountedPrice = Math.round(
//               hasDiscount ? price - (price * discount) / 100 : price
//             );

//             return (
//               <motion.div
//                 key={item?._id || index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.06, duration: 0.4 }}
//                 className="transition-all duration-300"
//               >
//                 <ProductItem
//                   id={item?._id || index}
//                   image={Array.isArray(item?.image) ? item.image : [item?.image]}
//                   name={item?.name || 'Popular Supplement'}
//                   price={discountedPrice}
//                   originalPrice={price}
//                   discount={discount}
//                   showStars={false}
//                   showDiscountBadge={false}
//                 />
//               </motion.div>
//             );
//           })
//         ) : (
//           <p className="col-span-full text-center text-slate-600">
//             Loading popular supplements...
//           </p>
//         )}
//       </div>

//       {/* Moving Banner */}
//       <motion.div
//         className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl border border-gray-200"
//         initial={{ opacity: 0, y: 40 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//       >
//         <div className="relative">
//           <motion.img
//             key={currentImageIndex}
//             src={movingImages[currentImageIndex]}
//             alt="Popular Supplements"
//             className="w-full object-cover h-72 sm:h-80 lg:h-96"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
//           <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
//             <div>
//               <motion.h3
//                 className="text-2xl sm:text-3xl font-bold text-white mb-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 Fuel Your <span className="text-blue-600 font-extrabold">Performance</span>
//               </motion.h3>
//               <motion.p
//                 className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 Premium formulas, tested for quality — crafted to power your goals, every single day.
//               </motion.p>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//     </div>
//   );
// };

// export default LatestCollection;

import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LatestCollection = () => {
  const { products = [] } = useContext(ShopContext);
  const navigate = useNavigate();

  const safeNum = (n, fallback = 0) => {
    const x = typeof n === 'string' ? parseFloat(n) : n;
    return Number.isFinite(x) ? x : fallback;
  };

  // ✅ Latest 20 products
  const latestProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return [...products]
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      })
      .slice(0, 20);
  }, [products]);

  return (
    <div className="my-20 bg-white text-slate-800 px-4 py-14 rounded-xl shadow-xl border border-gray-200">

      {/* Title */}
      <div className="text-center mb-14">
        <Title text1="LATEST" text2="COLLECTION" />
        <p className="w-3/4 md:w-1/2 mx-auto text-sm text-slate-600 mt-4">
          Fresh arrivals just for you — discover what’s new in our store.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-14">
        {latestProducts.length > 0 ? (
          latestProducts.map((item, index) => {
            const price = Math.round(safeNum(item?.price));
            const discount = safeNum(item?.discount);
            const discountedPrice = discount > 0
              ? Math.round(price - (price * discount) / 100)
              : price;

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
                  price={discountedPrice}
                  originalPrice={price}
                  discount={discount}
                  showStars={false}
                  showDiscountBadge={false}
                />
              </motion.div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-slate-600">
            Loading latest products...
          </p>
        )}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button
          onClick={() => navigate('/collection')}
          className="px-8 py-3 rounded-full bg-black text-white font-medium
                     hover:bg-gray-800 transition-all duration-300"
        >
          View All Products →
        </button>
      </div>

    </div>
  );
};

export default LatestCollection;

