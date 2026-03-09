

// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from './Title';
// import ProductItem from './ProductItem';
// import { motion } from 'framer-motion';

// const BestSeller = () => {
//   const { products } = useContext(ShopContext);
//   const [popularProducts, setPopularProducts] = useState([]);

//   const movingImages = [
//     'https://images.pexels.com/photos/4720778/pexels-photo-4720778.jpeg',
//     'https://images.pexels.com/photos/11439928/pexels-photo-11439928.jpeg',
//     'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % movingImages.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ POPULAR PRODUCTS FROM BACKEND
//   useEffect(() => {
//     if (!Array.isArray(products)) return;

//   const filtered = products.filter(
//   (item) => item?.subCategory?.toLowerCase() === "popular"
// );


//     setPopularProducts(filtered.slice(0, 10));
//   }, [products]);

//   return (
//     <div className="my-20 bg-white text-slate-800 px-4 py-14 rounded-xl shadow-xl border border-gray-200">

//       {/* Title */}
//       <div className="text-center mb-14">
//         <Title text1="POPULAR" text2="SUPPLEMENTS" />
//         <p className="w-3/4 md:w-1/2 mx-auto text-sm text-slate-600 mt-4">
//           Trusted by athletes and fitness lovers — our most loved supplements.
//         </p>
//       </div>

//       {/* Products */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
//         {popularProducts.length > 0 ? (
//           popularProducts.map((item, index) => {
//             const discountedPrice =
//               item?.discount > 0
//                 ? Math.round(item.price - (item.price * item.discount) / 100)
//                 : item.price;

//             return (
//               <motion.div
//                 key={item?._id || index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.05, duration: 0.4 }}
//               >
//                 <ProductItem
//                   id={item?._id}
//                   image={Array.isArray(item?.image) ? item.image : [item?.image]}
//                   name={item?.name}
//                   price={String(discountedPrice)}
//                   originalPrice={String(item?.price)}
//                   discount={item?.discount}
//                   showStars={false}
//                   showDiscountBadge={false}
//                 />
//               </motion.div>
//             );
//           })
//         ) : (
//           <p className="col-span-full text-center text-slate-600">
//             No popular supplements found.
//           </p>
//         )}
//       </div>

//       {/* Banner */}
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
//           <div className="absolute inset-0 flex items-center justify-center text-center p-8">
//             <div>
//               <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
//                 Best Sellers for <span className="text-blue-500">Peak Performance</span>
//               </h3>
//               <p className="text-white/90 max-w-xl mx-auto">
//                 Proven results. Trusted formulas. Chosen by thousands.
//               </p>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//     </div>
//   );
// };

// export default BestSeller;

import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [popularProducts, setPopularProducts] = useState([]);
  const navigate = useNavigate();

  const movingImages = [
    'https://images.pexels.com/photos/4720778/pexels-photo-4720778.jpeg',
    'https://images.pexels.com/photos/11439928/pexels-photo-11439928.jpeg',
    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % movingImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FETCH 20 POPULAR PRODUCTS
  useEffect(() => {
    if (!Array.isArray(products)) return;

    const filtered = products.filter(
      (item) => item?.subCategory?.toLowerCase() === 'popular'
    );

    setPopularProducts(filtered.slice(0, 20));
  }, [products]);

  return (
    <div className="my-20 bg-white text-slate-800 px-4 py-14 rounded-xl shadow-xl border border-gray-200">

      {/* Title */}
      <div className="text-center mb-14">
        <Title text1="POPULAR" text2="SUPPLEMENTS" />
        <p className="w-3/4 md:w-1/2 mx-auto text-sm text-slate-600 mt-4">
          Trusted by athletes and fitness lovers — our most loved supplements.
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        {popularProducts.length > 0 ? (
          popularProducts.map((item, index) => {
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
            No popular supplements found.
          </p>
        )}
      </div>

      {/* ✅ VIEW ALL BUTTON */}
      <div className="text-center mb-16">
        <button
          onClick={() => navigate('/collection?subCategory=Popular')}
          className="px-8 py-3 rounded-full bg-black text-white font-medium
                     hover:bg-gray-800 transition-all duration-300"
        >
          View All Popular Products →
        </button>
      </div>

      {/* Banner */}
      <motion.div
        className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl border border-gray-200"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <motion.img
            key={currentImageIndex}
            src={movingImages[currentImageIndex]}
            alt="Popular Supplements"
            className="w-full object-cover h-72 sm:h-80 lg:h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Best Sellers for <span className="text-blue-500">Peak Performance</span>
              </h3>
              <p className="text-white/90 max-w-xl mx-auto">
                Proven results. Trusted formulas. Chosen by thousands.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default BestSeller;

