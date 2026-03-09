


// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import { Link } from 'react-router-dom';

// // --- Helper Components ---
// const Star = ({ filled = false, size = 14 }) => (
//   <svg
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill={filled ? '#FFB800' : '#E2E8F0'} // Gold vs Light Gray
//     className="inline-block transition-colors duration-300"
//   >
//     <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
//   </svg>
// );

// const StarsInline = ({ rating = 0, size = 14 }) => {
//   const rounded = Math.round(rating);
//   const stars = [0, 1, 2, 3, 4].map((i) => (
//     <Star key={i} filled={i < rounded} size={size} />
//   ));
//   return <span className="inline-flex items-center gap-0.5">{stars}</span>;
// };

// const ViewIcon = ({ className = 'w-5 h-5' }) => (
//   <svg
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth="1.5"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//   </svg>
// );

// const ProductItem = ({
//   id,
//   image,
//   name,
//   price,
//   originalPrice,
//   discount,
//   reviews = [],
//   showStars = true,
//   showDiscountBadge = true,
// }) => {
//   const { currency } = useContext(ShopContext);

//   const avg =
//     reviews && reviews.length
//       ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
//       : 0;

//   // ----- IMAGE SLIDESHOW LOGIC -----
//   const images = Array.isArray(image) ? image : [image].filter(Boolean);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     if (isHovered && images.length > 1) {
//       intervalRef.current = setInterval(() => {
//         setActiveIndex((prev) => (prev + 1) % images.length);
//       }, 1000); // elegant slide speed
//     } else {
//       clearInterval(intervalRef.current);
//       setActiveIndex(0); // reset on leave
//     }
//     return () => clearInterval(intervalRef.current);
//   }, [isHovered, images.length]);

//   return (
//     <Link
//       onClick={() => window.scrollTo(0, 0)}
//       to={`/product/${id}`}
//       className="group block w-full h-full"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* OUTER WRAPPER: gradient edge + lift */}
//       <div className="relative w-full h-full rounded-[24px] bg-gradient-to-br from-slate-100 via-white to-slate-100 p-[1.5px] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.45)]">
//         {/* CARD */}
//         <div className="relative w-full h-full bg-white rounded-[22px] overflow-hidden transition-all duration-500 ease-out border border-slate-100/60">
//           {/* --- 1. IMAGE AREA --- */}
//           <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden">
//             {/* grey gradient background like sample */}
//             <div className="absolute inset-0 bg-gradient-to-t from-[#e5e7eb] via-[#f5f5f7] to-[#f9fafb] transition-colors duration-500 group-hover:from-[#d4d4d8] group-hover:via-white group-hover:to-white" />

//             {/* top light bar */}
//             <div className="pointer-events-none absolute top-0 left-0 w-full h-[22%] bg-gradient-to-b from-white/80 via-white/10 to-transparent" />

//             {/* Discount badge */}
//             {discount > 0 && showDiscountBadge && (
//               <div className="absolute top-3 left-3 z-20">
//                 <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-slate-100">
//                   -{discount}%
//                 </span>
//               </div>
//             )}

//             {/* Quick view icon */}
//             <div className="absolute top-3 right-3 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
//               <div className="bg-white/80 backdrop-blur-md text-slate-700 hover:text-blue-600 hover:bg-white p-2.5 rounded-full shadow-lg border border-white/60 transition-colors">
//                 <ViewIcon className="w-5 h-5" />
//               </div>
//             </div>

//             {/* Image + subtle hover overlay */}
//             <div className="relative w-full h-full flex items-center justify-center p-6">
//               {/* soft overlay on hover */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//               <img
//                 src={images[activeIndex]}
//                 alt={name}
//                 className="relative w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:-translate-y-1"
//               />
//             </div>

//             {/* slide dots */}
//             {images.length > 1 && (
//               <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 {images.map((_, i) => (
//                   <div
//                     key={i}
//                     className={`h-1 rounded-full transition-all duration-300 shadow-sm ${
//                       i === activeIndex ? 'w-4 bg-slate-900' : 'w-1.5 bg-slate-300'
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* --- 2. DETAILS AREA --- */}
//           <div className="p-4 sm:p-5 flex flex-col justify-between bg-white relative z-10">
//             <div className="space-y-1">
//               {/* Name */}
//               <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#1f4f94] transition-colors duration-300">
//                 {name}
//               </h3>

//               {/* Rating */}
//               {showStars && (
//                 <div className="flex items-center gap-2 pt-1">
//                   <StarsInline rating={avg} />
//                   <span className="text-[11px] text-slate-400 font-medium">
//                     ({reviews.length})
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Price + arrow */}
//             <div className="mt-3 flex items-center justify-between">
//               <div className="flex flex-col">
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-lg font-bold text-slate-900">
//                     {currency}
//                     {price}
//                   </span>
//                   {discount > 0 && (
//                     <span className="text-xs text-slate-400 line-through">
//                       {currency}
//                       {originalPrice}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* arrow button with glow */}
//               <div className="relative">
//                 <div className="absolute inset-0 rounded-full bg-[#2b6cb0]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 <div className="relative w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#2b6cb0] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_10px_20px_-8px_rgba(37,99,235,0.7)]">
//                   <svg
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M5 12h14" />
//                     <path d="M12 5l7 7-7 7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductItem;
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

// --- Helper Components ---
const Star = ({ filled = false, size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? '#FFB800' : '#E2E8F0'} // Gold vs Light Gray
    className="inline-block transition-colors duration-300"
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const StarsInline = ({ rating = 0, size = 14 }) => {
  const rounded = Math.round(rating);
  const stars = [0, 1, 2, 3, 4].map((i) => (
    <Star key={i} filled={i < rounded} size={size} />
  ));
  return <span className="inline-flex items-center gap-0.5">{stars}</span>;
};

const ViewIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ProductItem = ({
  id,
  image,
  videos = [], // Accept videos prop
  name,
  price,
  originalPrice,
  discount,
  reviews = [],
  showStars = true,
  showDiscountBadge = true,
}) => {
  const { currency } = useContext(ShopContext);

  const avg =
    reviews && reviews.length
      ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
      : 0;

  // ----- MEDIA SLIDESHOW LOGIC (Images + Videos) -----
  const validImages = Array.isArray(image) ? image : [image].filter(Boolean);
  const validVideos = Array.isArray(videos) ? videos : [videos].filter(Boolean);

  // Combine items into a single array of objects
  const mediaItems = [
    ...validImages.map(url => ({ type: 'image', url })),
    ...validVideos.map(url => ({ type: 'video', url }))
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Only cycle if we have more than 1 item and are hovering
    if (isHovered && mediaItems.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % mediaItems.length);
      }, 1200); // Slightly slower speed (1.2s) to let videos play a bit
    } else {
      clearInterval(intervalRef.current);
      setActiveIndex(0); // reset to first image on leave
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovered, mediaItems.length]);

  const currentMedia = mediaItems[activeIndex];

  return (
    <Link
      onClick={() => window.scrollTo(0, 0)}
      to={`/product/${id}`}
      className="group block w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* OUTER WRAPPER: gradient edge + lift */}
      <div className="relative w-full h-full rounded-[24px] bg-gradient-to-br from-slate-100 via-white to-slate-100 p-[1.5px] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.45)]">
        {/* CARD */}
        <div className="relative w-full h-full bg-white rounded-[22px] overflow-hidden transition-all duration-500 ease-out border border-slate-100/60">
          {/* --- 1. MEDIA AREA --- */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden">
            {/* grey gradient background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#e5e7eb] via-[#f5f5f7] to-[#f9fafb] transition-colors duration-500 group-hover:from-[#d4d4d8] group-hover:via-white group-hover:to-white" />

            {/* top light bar */}
            <div className="pointer-events-none absolute top-0 left-0 w-full h-[22%] bg-gradient-to-b from-white/80 via-white/10 to-transparent" />

            {/* Discount badge */}
            {discount > 0 && showDiscountBadge && (
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  -{discount}%
                </span>
              </div>
            )}

            {/* Quick view icon */}
            <div className="absolute top-3 right-3 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
              <div className="bg-white/80 backdrop-blur-md text-slate-700 hover:text-blue-600 hover:bg-white p-2.5 rounded-full shadow-lg border border-white/60 transition-colors">
                <ViewIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Media Content (Image or Video) */}
            <div className="relative w-full h-full flex items-center justify-center p-6">
              {/* soft overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              
              {currentMedia?.type === 'video' ? (
                <video
                  src={currentMedia.url}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="relative w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:-translate-y-1"
                />
              ) : (
                <img
                  src={currentMedia?.url}
                  alt={name}
                  className="relative w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:-translate-y-1"
                />
              )}
            </div>

            {/* Slide dots */}
            {mediaItems.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {mediaItems.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 shadow-sm ${
                      i === activeIndex ? 'w-4 bg-slate-900' : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* --- 2. DETAILS AREA --- */}
          <div className="p-4 sm:p-5 flex flex-col justify-between bg-white relative z-10">
            <div className="space-y-1">
              {/* Name */}
              <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#1f4f94] transition-colors duration-300">
                {name}
              </h3>

              {/* Rating */}
              {showStars && (
                <div className="flex items-center gap-2 pt-1">
                  <StarsInline rating={avg} />
                  <span className="text-[11px] text-slate-400 font-medium">
                    ({reviews.length})
                  </span>
                </div>
              )}
            </div>

            {/* Price + arrow */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">
                    {currency}
                    {price}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      {currency}
                      {originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow button with glow */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#2b6cb0]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#2b6cb0] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_10px_20px_-8px_rgba(37,99,235,0.7)]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;