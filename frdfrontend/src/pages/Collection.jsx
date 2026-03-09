
// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import Title from "../components/Title";
// import ProductItem from "../components/ProductItem";
// import { useLocation } from "react-router-dom";

// const Collection = () => {
//   const { products, search, showSearch } = useContext(ShopContext);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [sortType, setSortType] = useState("relevant");
//   const [mainCategory, setMainCategory] = useState("");
//   const [subCategory, setSubCategory] = useState("");
//   const [price, setPrice] = useState(6000);

//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const cat = params.get("category");
//     if (cat) setMainCategory(cat);
//   }, [location.search]);

//   const categories = [
//     "Protein",
//     "Creatine",
//     "BCAA",
//     "Mass Gainer",
//     "Pre Workout",
//     "Post Workout",
//     "Vitamins",
//   ];

//   const subCategories = [
//     "Popular",
//     "Just Launched",
//     "Editor's Choice",
//     "Trending",
//   ];

//   const applyFilters = () => {
//     let filtered = [...products];

//     if (showSearch && search) {
//       filtered = filtered.filter((item) =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (mainCategory) {
//       filtered = filtered.filter((item) => item.category === mainCategory);
//     }

//     if (subCategory) {
//       filtered = filtered.filter((item) => item.subCategory === subCategory);
//     }

//     filtered = filtered.filter((item) => {
//       const finalPrice =
//         item.discount > 0
//           ? Math.round(item.price - (item.price * item.discount) / 100)
//           : item.price;
//       return finalPrice <= price;
//     });

//     switch (sortType) {
//       case "low-high":
//         filtered.sort((a, b) => {
//           const aPrice =
//             a.discount > 0
//               ? a.price - (a.price * a.discount) / 100
//               : a.price;
//           const bPrice =
//             b.discount > 0
//               ? b.price - (b.price * b.discount) / 100
//               : b.price;
//           return aPrice - bPrice;
//         });
//         break;
//       case "high-low":
//         filtered.sort((a, b) => {
//           const aPrice =
//             a.discount > 0
//               ? a.price - (a.price * a.discount) / 100
//               : a.price;
//           const bPrice =
//             b.discount > 0
//               ? b.price - (b.price * b.discount) / 100
//               : b.price;
//           return bPrice - aPrice;
//         });
//         break;
//       default:
//         break;
//     }

//     setFilteredProducts(filtered);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [search, showSearch, products, sortType, mainCategory, subCategory, price]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 md:px-10 lg:px-20 py-10 text-slate-900">
//       {/* Header + Sort */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
//         <div>
//           <Title text1="OUR" text2="PRODUCTS" />
//           <p className="text-sm md:text-base text-slate-500 mt-1">
//             Curated selection of premium supplements for serious results.
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <span className="hidden md:inline text-xs tracking-wide uppercase text-slate-400">
//             Sort &amp; Refine
//           </span>
//           <select
//             value={sortType}
//             onChange={(e) => setSortType(e.target.value)}
//             className="border border-slate-200 bg-white/80 text-slate-700 text-sm px-3 py-2 rounded-xl shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//           >
//             <option value="relevant">Sort by: Relevance</option>
//             <option value="low-high">Sort by: Low to High</option>
//             <option value="high-low">Sort by: High to Low</option>
//           </select>
//         </div>
//       </div>

//       {/* Filter Bar Card */}
//       <div className="mb-8 bg-white/90 border border-slate-100 rounded-2xl shadow-sm px-4 py-4 md:px-6 md:py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between backdrop-blur">
//         <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
//           <select
//             value={mainCategory}
//             onChange={(e) => setMainCategory(e.target.value)}
//             className="px-3 py-2 border border-slate-200 bg-white text-slate-700 text-sm rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-w-[170px]"
//           >
//             <option value="">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>

//           <select
//             value={subCategory}
//             onChange={(e) => setSubCategory(e.target.value)}
//             className="px-3 py-2 border border-slate-200 bg-white text-slate-700 text-sm rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-w-[170px]"
//           >
//             <option value="">All Tags</option>
//             {subCategories.map((sub) => (
//               <option key={sub} value={sub}>
//                 {sub}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
//           <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
//             <span className="text-xs uppercase tracking-wide text-slate-400">
//               Max Price
//             </span>
//             <span className="text-sm font-semibold text-blue-600">
//               ₹{price}
//             </span>
//           </div>
//           <input
//             id="price"
//             type="range"
//             min="100"
//             max="6000"
//             step="100"
//             value={price}
//             onChange={(e) => setPrice(Number(e.target.value))}
//             className="w-full sm:w-[220px] accent-emerald-500 cursor-pointer"
//           />
//         </div>
//       </div>

//       {/* Result meta */}
//       <div className="flex justify-between items-center mb-4 text-xs md:text-sm text-slate-500">
//         <span>
//           Showing{" "}
//           <span className="font-semibold text-slate-700">
//             {filteredProducts.length}
//           </span>{" "}
//           products
//         </span>
//         {search && (
//           <span>
//             Search: <span className="font-medium text-slate-700">{search}</span>
//           </span>
//         )}
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
//         {filteredProducts.length ? (
//           filteredProducts.map((product) => {
//             const finalPrice =
//               product.discount > 0
//                 ? Math.round(
//                     product.price - (product.price * product.discount) / 100
//                   )
//                 : product.price;

//             return (
//               <ProductItem
//                 key={product._id}
//                 id={product._id}
//                 name={product.name}
//                 price={finalPrice}
//                 image={product.image}
//                 originalPrice={product.price}
//                 discount={product.discount}
//                 showStars={false}
//               />
//             );
//           })
//         ) : (
//           <p className="col-span-full text-center text-slate-400 py-12 text-lg">
//             No products match your filters. Try adjusting category or price.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Collection;

// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import ProductItem from '../components/ProductItem';
// import { useLocation } from 'react-router-dom';

// const Collection = () => {
//   const { products, search, showSearch } = useContext(ShopContext);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [sortType, setSortType] = useState('relevant');
//   const [mainCategory, setMainCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');
//   const [price, setPrice] = useState(6000);

//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const cat = params.get('category');
//     if (cat) setMainCategory(cat);
//   }, [location.search]);

//   const categories = [
//     'Protein', 'Creatine', 'BCAA', 'Mass Gainer', 'Pre Workout', 'Post Workout', 'Vitamins'
//   ];

//   const subCategories = [
//     'Popular', 'Just Launched', "Editor's Choice", 'Trending'
//   ];

//   const applyFilters = () => {
//     let filtered = [...products];

//     if (showSearch && search) {
//       filtered = filtered.filter(item =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (mainCategory) {
//       filtered = filtered.filter(item => item.category === mainCategory);
//     }

//     if (subCategory) {
//       filtered = filtered.filter(item => item.subCategory === subCategory);
//     }

//     filtered = filtered.filter(item => {
//       const finalPrice = item.discount > 0
//         ? Math.round(item.price - (item.price * item.discount) / 100)
//         : item.price;
//       return finalPrice <= price;
//     });

//     switch (sortType) {
//       case 'low-high':
//         filtered.sort((a, b) => {
//           const aPrice = a.discount > 0 ? a.price - (a.price * a.discount) / 100 : a.price;
//           const bPrice = b.discount > 0 ? b.price - (b.price * b.discount) / 100 : b.price;
//           return aPrice - bPrice;
//         });
//         break;
//       case 'high-low':
//         filtered.sort((a, b) => {
//           const aPrice = a.discount > 0 ? a.price - (a.price * a.discount) / 100 : a.price;
//           const bPrice = b.discount > 0 ? b.price - (b.price * b.discount) / 100 : b.price;
//           return bPrice - aPrice;
//         });
//         break;
//       default:
//         break;
//     }

//     setFilteredProducts(filtered);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [search, showSearch, products, sortType, mainCategory, subCategory, price]);

//   return (
//     <div className="px-4 md:px-12 py-8 bg-white min-h-screen text-slate-800">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//         <Title text1="OUR" text2="PRODUCTS" />
//         <select
//           value={sortType}
//           onChange={(e) => setSortType(e.target.value)}
//           className="border-2 border-gray-300 bg-white text-blue-600 text-sm px-3 py-1 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//         >
//           <option value="relevant">Sort by: Relevance</option>
//           <option value="low-high">Sort by: Low to High</option>
//           <option value="high-low">Sort by: High to Low</option>
//         </select>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <select
//           value={mainCategory}
//           onChange={(e) => setMainCategory(e.target.value)}
//           className="px-3 py-2 border border-gray-300 bg-white text-blue-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>

//         <select
//           value={subCategory}
//           onChange={(e) => setSubCategory(e.target.value)}
//           className="px-3 py-2 border border-gray-300 bg-white text-blue-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//         >
//           <option value="">All Tags</option>
//           {subCategories.map((sub) => (
//             <option key={sub} value={sub}>{sub}</option>
//           ))}
//         </select>

//         <div className="flex items-center gap-2">
//           <label htmlFor="price" className="text-gray-300 font-medium whitespace-nowrap">
//             Max Price: <span className="text-blue-600 font-semibold">₹{price}</span>
//           </label>
//           <input
//             id="price"
//             type="range"
//             min="100"
//             max="6000"
//             step="100"
//             value={price}
//             onChange={(e) => setPrice(Number(e.target.value))}
//             className="w-[200px] accent-green-500"
//           />
//         </div>
//       </div>

//       {/* YEHI CHANGE KIYA HAI - BAS GRID CLASSES KO THODA BETTER KIYA */}
//       <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
//         {filteredProducts.length ? (
//           filteredProducts.map((product) => {
//             const finalPrice = product.discount > 0
//               ? Math.round(product.price - (product.price * product.discount) / 100)
//               : product.price;

//             return (
//               <ProductItem
//                 key={product._id}
//                 id={product._id}
//                 name={product.name}
//                 price={finalPrice}
//                 image={product.image}
//                 videos={product.videos}
//                 originalPrice={product.price}
//                 discount={product.discount}
//                 showStars={false}
//                 showDiscountBadge={false}
//               />
//             );
//           })
//         ) : (
//           <p className="col-span-full text-center text-gray-500 py-10 text-lg">
//             No products found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Collection;

import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation } from 'react-router-dom';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState(6000);

  const location = useLocation();

  /* =========================
     READ QUERY PARAMS (FIX)
  ========================== */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const cat = params.get('category');
    const subCat = params.get('subCategory');

    if (cat) setMainCategory(cat);
    if (subCat) setSubCategory(subCat);
  }, [location.search]);

  const categories = [
    'Protein',
    'Creatine',
    'BCAA',
    'Mass Gainer',
    'Pre Workout',
    'Post Workout',
    'Vitamins',
  ];

  const subCategories = [
    'Popular',
    'Just Launched',
    "Editor's Choice",
    'Trending',
  ];

  /* =========================
     APPLY FILTERS
  ========================== */
  const applyFilters = () => {
    let filtered = [...products];

    // Search
    if (showSearch && search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Main Category
    if (mainCategory) {
      filtered = filtered.filter(
        item => item.category === mainCategory
      );
    }

    // Sub Category (CASE SAFE)
    if (subCategory) {
      filtered = filtered.filter(
        item =>
          item?.subCategory?.toLowerCase() ===
          subCategory.toLowerCase()
      );
    }

    // Price
    filtered = filtered.filter(item => {
      const finalPrice =
        item.discount > 0
          ? Math.round(item.price - (item.price * item.discount) / 100)
          : item.price;

      return finalPrice <= price;
    });

    // Sorting
    if (sortType === 'low-high') {
      filtered.sort((a, b) => {
        const aPrice =
          a.discount > 0 ? a.price - (a.price * a.discount) / 100 : a.price;
        const bPrice =
          b.discount > 0 ? b.price - (b.price * b.discount) / 100 : b.price;
        return aPrice - bPrice;
      });
    }

    if (sortType === 'high-low') {
      filtered.sort((a, b) => {
        const aPrice =
          a.discount > 0 ? a.price - (a.price * a.discount) / 100 : a.price;
        const bPrice =
          b.discount > 0 ? b.price - (b.price * b.discount) / 100 : b.price;
        return bPrice - aPrice;
      });
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [
    products,
    search,
    showSearch,
    sortType,
    mainCategory,
    subCategory,
    price,
  ]);

  return (
    <div className="px-4 md:px-12 py-8 bg-white min-h-screen text-slate-800">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <Title text1="OUR" text2="PRODUCTS" />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border-2 border-gray-300 bg-white text-blue-600 text-sm px-3 py-1 rounded"
        >
          <option value="relevant">Sort by: Relevance</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <select
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 bg-white text-blue-600 rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 bg-white text-blue-600 rounded"
        >
          <option value="">All Tags</option>
          {subCategories.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-gray-400 font-medium">
            Max Price:
            <span className="text-blue-600 font-semibold ml-1">
              ₹{price}
            </span>
          </label>
          <input
            type="range"
            min="100"
            max="6000"
            step="100"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-[200px] accent-green-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.length ? (
          filteredProducts.map(product => {
            const finalPrice =
              product.discount > 0
                ? Math.round(product.price - (product.price * product.discount) / 100)
                : product.price;

            return (
              <ProductItem
                key={product._id}
                id={product._id}
                name={product.name}
                price={finalPrice}
                originalPrice={product.price}
                image={product.image}
                videos={product.videos}
                discount={product.discount}
                showStars={false}
                showDiscountBadge={false}
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10 text-lg">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Collection;
