// import React, { useContext, useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import RelatedProducts from '../components/RelatedProducts';
// import axios from 'axios';

// // Star SVG component
// const StarIcon = ({ className = 'w-5 h-5', rating, maxStars = 5 }) => (
//     <div className="flex items-center">
//         {[...Array(maxStars)].map((_, index) => {
//             const starValue = index + 1;
//             return (
//                 <svg 
//                     key={index} 
//                     className={`${className} ${starValue <= Math.round(rating) ? 'text-blue-600 fill-current' : 'text-gray-300'}`} 
//                     viewBox="0 0 24 24" 
//                     fill="currentColor"
//                 >
//                     <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
//                 </svg>
//             );
//         })}
//     </div>
// );

// // Share Icon Component
// const ShareIcon = ({ className = "w-5 h-5" }) => (
//     <svg 
//         className={className} 
//         viewBox="0 0 24 24" 
//         fill="none" 
//         stroke="currentColor" 
//         strokeWidth="2"
//     >
//         <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
//         <polyline points="16 6 12 2 8 6" />
//         <line x1="12" y1="2" x2="12" y2="15" />
//     </svg>
// );

// // YEHI EK CHANGE HAI — AddReviewForm ko bahar nikaal diya (smooth typing ke liye)
// const AddReviewForm = ({ reviewRating, setReviewRating, reviewComment, setReviewComment, submitReview }) => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8 shadow-xl">
//         <h3 className="text-xl font-bold text-black mb-4">Add Your Review</h3>
        
//         <div className="space-y-4">
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
//                 <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                                 key={star}
//                                 type="button"
//                                 onClick={() => setReviewRating(String(star))}
//                                 className={`p-0.5 transition hover:scale-110`}
//                                 aria-label={`${star} star rating`}
//                             >
//                                 <svg 
//                                     className={`w-7 h-7 fill-current transition-colors ${star <= Number(reviewRating) ? 'text-blue-600' : 'text-gray-300'}`} 
//                                     viewBox="0 0 24 24" 
//                                     fill="currentColor"
//                                 >
//                                     <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
//                                 </svg>
//                             </button>
//                         ))}
//                     </div>
//                     <span className="text-lg font-bold text-blue-600">
//                         {Number(reviewRating).toFixed(0)} / 5
//                     </span>
//                 </div>
//             </div>

//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
//                 <textarea
//                     value={reviewComment}
//                     onChange={(e) => setReviewComment(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none shadow-inner"
//                     placeholder="What did you like or dislike?"
//                     rows={3}
//                 />
//             </div>

//             <div className="flex justify-end pt-2">
//                 <button
//                     onClick={submitReview}
//                     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-base shadow-md transition transform hover:scale-[1.02]"
//                 >
//                     Submit Review
//                 </button>
//             </div>
//         </div>
//     </div>
// );

// const Product = () => {
//     const navigate = useNavigate();
//     const { productId } = useParams();
//     const { products, currency, addToCart, user, token } = useContext(ShopContext);
//     const [productData, setProductData] = useState(null);
//     const [reviewRating, setReviewRating] = useState('5');
//     const [reviewComment, setReviewComment] = useState('');
//     const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//     const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
//     const [groupSelections, setGroupSelections] = useState([]);
//     const [revPage, setRevPage] = useState(1);
//     const [isZoomed, setIsZoomed] = useState(false);
//     const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//     const [showShareMessage, setShowShareMessage] = useState(false);
//     const revPageSize = 3;
//     const [activeTab, setActiveTab] = useState('description');

//     const imageRef = useRef(null);
//     const zoomRef = useRef(null);

//     useEffect(() => {
//         const selectedProduct = products.find((item) => item._id === productId);
//         if (selectedProduct) {
//             setProductData(selectedProduct);
            
//             const hasSimpleVariants = selectedProduct.variants && selectedProduct.variants.length > 0;
//             setSelectedVariantIndex(hasSimpleVariants ? 0 : null);
            
//             setSelectedImageIndex(0);
            
//             const hasVariantGroups = selectedProduct.variantGroups && selectedProduct.variantGroups.length > 0;
//             setGroupSelections(hasVariantGroups ? selectedProduct.variantGroups.map(() => 0) : []);
//         }
//     }, [productId, products]);

//     const handleMouseMove = (e) => {
//         if (!isZoomed || !imageRef.current || !zoomRef.current) return;

//         const { left, top, width, height } = imageRef.current.getBoundingClientRect();
//         const x = ((e.clientX - left) / width) * 100;
//         const y = ((e.clientY - top) / height) * 100;

//         setZoomPosition({ x, y });
//     };

//     const handleMouseEnter = () => setIsZoomed(true);
//     const handleMouseLeave = () => setIsZoomed(false);

//     const handleShareProduct = async () => {
//         const productUrl = window.location.href;
//         try {
//             await navigator.clipboard.writeText(productUrl);
//             setShowShareMessage(true);
//             setTimeout(() => setShowShareMessage(false), 2000);
//         } catch (error) {
//             const textArea = document.createElement('textarea');
//             textArea.value = productUrl;
//             document.body.appendChild(textArea);
//             textArea.select();
//             document.execCommand('copy');
//             document.body.removeChild(textArea);
//             setShowShareMessage(true);
//             setTimeout(() => setShowShareMessage(false), 2000);
//         }
//     };
    
//     const currentVariant = selectedVariantIndex !== null && productData
//         ? productData.variants?.[selectedVariantIndex]
//         : null;

//     const getCarouselImages = () => {
//         if (!productData) return [];
//         const variantImgs = currentVariant?.images || [];
//         const baseImgs = productData.image || [];
//         const all = variantImgs.length > 0 ? [...variantImgs, ...baseImgs] : baseImgs;
//         const seen = new Set();
//         return all.filter((url) => url && !seen.has(url) && seen.add(url));
//     };

//     const carouselImages = getCarouselImages();
//     const selectedImage = carouselImages[selectedImageIndex] || '';

//     const basePrice = currentVariant?.price ?? productData?.price ?? 0;
//     const discount = currentVariant?.discount ?? productData?.discount ?? 0;
//     const finalPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

//     const averageRating = productData?.reviews?.length 
//         ? (productData.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / productData.reviews.length).toFixed(1)
//         : '0.0';

//     const handleAddToCart = () => {
//       if (currentVariant?.stock === 0 || (currentVariant?.stock !== undefined && currentVariant.stock <= 0)) {
//         toast.error('Sorry, The product is out of stock');
//         return;
//     }

//     if (!token) {
//         toast.error('Please Login!');
//         navigate('/login');
//         return;
//     }
//         if (!user && !token) {
//             toast.error('Please login first to add items to your cart.');
//             navigate('/login');
//             return;
//         }

//         let variantKey = '';
//         if (productData.variantGroups?.length > 0) {
//             variantKey = 'g:' + groupSelections.map((sel, gi) => `${gi}-${sel}`).join('|');
//         } else {
//             variantKey = selectedVariantIndex !== null ? String(selectedVariantIndex) : '';
//         }

//         addToCart(productData._id, variantKey);
//         toast.success('Product added to cart.');
//     };
    
//     const submitReview = async () => {
//       if (!token) {
//     toast.error('Please Login to give review');
//     navigate('/login');
//     return;
// }
//         if (!reviewRating) return toast.error('Please select a rating');
//         try {
//             const payload = { productId: productData._id, rating: Number(reviewRating), comment: reviewComment };
//             const headers = { 'Content-Type': 'application/json' };
//             if (token) headers.token = token;
            
//             const res = await axios.post(`${(import.meta.env.VITE_BACKEND_URL || '')}/api/product/review`, payload, { headers });
            
//             if (res.data.success) {
//                 toast.success('Review submitted successfully.');
//                 setProductData(prev => ({ 
//                     ...prev, 
//                     reviews: [...(prev.reviews||[]), res.data.review] 
//                 }));
//                 setReviewComment(''); 
//                 setReviewRating('5');
//                 setRevPage(1);
//             } else {
//                 toast.error(res.data.message || 'Failed to submit review');
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to submit review. Please ensure you are logged in.');
//         }
//     };

//     if (!productData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="text-xl text-gray-500">Loading product details...</div>
//             </div>
//         );
//     }

//     const ReviewSummary = () => (
//         <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-100 shadow-inner">
//             <div className="flex flex-col md:flex-row items-center justify-between">
//                 <div className="text-center md:text-left mb-4 md:mb-0 md:w-1/3">
//                     <div className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-2">{averageRating}</div>
//                     <StarIcon rating={averageRating} className="w-6 h-6 mx-auto md:mx-0" />
//                     <p className="text-gray-600 text-sm mt-2">
//                         Based on {productData.reviews?.length || 0} customer reviews
//                     </p>
//                 </div>
                
//                 <div className="w-full md:w-2/3 max-w-md">
//                     {[5, 4, 3, 2, 1].map((rating) => {
//                         const count = productData.reviews?.filter(r => r.rating === rating).length || 0;
//                         const total = productData.reviews?.length || 1;
//                         const percentage = (count / total) * 100;
                        
//                         return (
//                             <div key={rating} className="flex items-center gap-3 mb-2">
//                                 <span className="text-sm font-medium text-gray-600 w-2">{rating}</span>
//                                 <StarIcon rating={5} className="w-3 h-3 text-blue-600 fill-current" />
//                                 <div className="flex-1 bg-gray-200 rounded-full h-2">
//                                     <div 
//                                         className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
//                                         style={{ width: `${percentage}%` }}
//                                     ></div>
//                                 </div>
//                                 <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );

//     const ReviewsList = () => {
//         const rev = productData.reviews?.slice().reverse() || []; 
//         const total = rev.length;
//         const totalPages = Math.max(1, Math.ceil(total / revPageSize));
//         const start = (revPage - 1) * revPageSize;
//         const visible = rev.slice(start, start + revPageSize);

//         return (
//             <div className="space-y-4 pt-4">
//                 <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">All Feedback ({total})</h4>
                
//                 {total > 0 ? (
//                     <>
//                         {visible.map((review) => (
//                             <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-lg transition">
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
//                                             {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
//                                         </div>
//                                         <div>
//                                             <div className="font-bold text-gray-900 text-sm">
//                                                 {review.name || 'Anonymous User'}
//                                             </div>
//                                             <div className="text-xs text-gray-500">
//                                                 {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                     <StarIcon rating={review.rating} className="w-4 h-4" />
//                                 </div>
                                
//                                 {review.comment && (
//                                     <p className="text-gray-700 leading-relaxed text-sm mt-3 border-l-4 border-blue-400 pl-4 py-1 bg-gray-50 rounded-sm">
//                                         "{review.comment}"
//                                     </p>
//                                 )}
//                             </div>
//                         ))}

//                         {total > revPageSize && (
//                             <div className="flex items-center justify-center gap-4 pt-6">
//                                 <button
//                                     onClick={() => setRevPage(p => Math.max(1, p - 1))}
//                                     disabled={revPage === 1}
//                                     className={`px-4 py-2 rounded-lg font-medium text-sm transition ${revPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                                 >
//                                     Previous
//                                 </button>
//                                 <div className="text-sm text-gray-700 font-medium">Page {revPage} of {totalPages}</div>
//                                 <button
//                                     onClick={() => setRevPage(p => Math.min(totalPages, p + 1))}
//                                     disabled={revPage === totalPages}
//                                     className={`px-4 py-2 rounded-lg font-medium text-sm transition ${revPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 ) : (
//                     <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
//                         <p className="text-gray-500 text-base font-medium">No reviews found. Be the first!</p>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen py-4 md:py-8">
//             <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg md:shadow-xl">

//                     <div className="lg:col-span-7 relative">
//                         <div className="absolute top-3 right-3 z-20">
//                             <div className="relative">
//                                 <button
//                                     onClick={handleShareProduct}
//                                     className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110 hover:shadow-xl z-10"
//                                     aria-label="Share product"
//                                 >
//                                     <ShareIcon className="w-5 h-5" />
//                                 </button>
                                
//                                 {showShareMessage && (
//                                     <div className="absolute top-12 right-0 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg z-30">
//                                         Link Copied!
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div 
//                             className="hidden lg:block relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-lg aspect-[4/3] cursor-zoom-in"
//                             onMouseEnter={handleMouseEnter}
//                             onMouseLeave={handleMouseLeave}
//                             onMouseMove={handleMouseMove}
//                             ref={imageRef}
//                         >
//                             <img
//                                 src={selectedImage}
//                                 alt={productData.name}
//                                 className="w-full h-full object-contain p-3 md:p-4 lg:p-6 transition-transform duration-500"
//                             />
                            
//                             {isZoomed && (
//                                 <div 
//                                     className="absolute inset-0 bg-white overflow-hidden pointer-events-none z-10"
//                                     ref={zoomRef}
//                                 >
//                                     <img
//                                         src={selectedImage}
//                                         alt={productData.name}
//                                         className="absolute origin-top-left scale-150"
//                                         style={{
//                                             left: `-${zoomPosition.x * 1.5}%`,
//                                             top: `-${zoomPosition.y * 1.5}%`,
//                                         }}
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                         <div className="lg:hidden relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
//                             <img
//                                 src={selectedImage}
//                                 alt={productData.name}
//                                 className="w-full h-full object-contain"
//                             />
//                         </div>

//                         {carouselImages.length > 1 && (
//                             <div className="flex justify-start gap-2 md:gap-3 mt-2 md:mt-3 overflow-x-auto pb-1">
//                                 {carouselImages.map((img, i) => (
//                                     <button
//                                         key={i}
//                                         onClick={() => setSelectedImageIndex(i)}
//                                         className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 md:min-w-18 md:min-h-18 border-2 rounded-lg transition-all ${
//                                             i === selectedImageIndex ? 'border-blue-600 shadow-md p-0.5' : 'border-gray-300 hover:border-blue-400'
//                                         }`}
//                                         aria-label={`View image ${i + 1}`}
//                                     >
//                                         <img src={img} alt="" className="w-full h-full object-cover rounded-md" />
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className="lg:col-span-5 flex flex-col justify-start pt-3 lg:pt-0">
                        
//                         <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight sm:leading-snug mb-2">{productData.name}</h1>
                        
//                         <div className="flex flex-col gap-2 text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">
//                             <div className="flex items-center gap-2">
//                                 <StarIcon rating={averageRating} className="w-4 h-4" />
//                                 <span className="font-bold text-black text-base">{averageRating}</span> 
//                                 <span className="text-gray-500 text-sm">({productData.reviews?.length || 0} reviews)</span>
//                             </div>
                            
//                             <div className="flex flex-col gap-1">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-xs font-medium text-gray-500">Category:</span>
//                                     <span className='text-sm font-semibold text-blue-600'>
//                                         {productData.category}
//                                     </span>
//                                 </div>
//                                 {productData.subCategory && (
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-500">Subcategory:</span>
//                                         <span className='text-sm font-semibold text-green-600'>
//                                             {productData.subCategory}
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="mb-4">
//                             {discount > 0 ? (
//                                 <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4">
//                                     <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600">{currency}{finalPrice}</span>
//                                     <span className="text-xl sm:text-2xl text-gray-500 line-through">{currency}{basePrice}</span>
//                                     <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shadow-md">
//                                         SAVE {discount}%
//                                     </span>
//                                 </div>
//                             ) : (
//                                 <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600">{currency}{basePrice}</span>
//                             )}
//                         </div>
                        
//                         {(productData.variantGroups?.length > 0 || productData.variants?.length > 0) && (
//                             <div className="mt-2 space-y-2 sm:space-y-3 pb-3 border-b border-gray-100">
//                                 {productData.variantGroups?.map((group, gi) => (
//                                     <div key={gi}>
//                                         <p className="text-sm font-bold text-black mb-1 sm:mb-2">{group.label}:</p>
//                                         <div className="flex flex-wrap gap-1 sm:gap-2">
//                                             {group.variants.map((opt, oi) => {
//                                                 const isSelected = groupSelections[gi] === oi;
//                                                 return (
//                                                     <button
//                                                         key={oi}
//                                                         onClick={() => {
//                                                             const newSelections = [...groupSelections];
//                                                             newSelections[gi] = oi;
//                                                             setGroupSelections(newSelections);
                                                            
//                                                             let matchedIdx = productData.variants?.findIndex(v => v.meta?.groupIndex === gi && v.meta?.variantIndex === oi);
//                                                             setSelectedVariantIndex(matchedIdx !== -1 ? matchedIdx : selectedVariantIndex);
//                                                             setSelectedImageIndex(0);
//                                                         }}
//                                                         className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 text-xs font-medium transition-all shadow-sm ${
//                                                             isSelected
//                                                                 ? 'border-blue-600 bg-blue-600 text-white'
//                                                                 : 'border-gray-300 bg-white text-gray-800 hover:border-blue-400'
//                                                         }`}
//                                                     >
//                                                         {opt.name || opt}
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 ))}

//                                 {productData.variants?.length > 0 && !productData.variantGroups?.length && (
//                                     <div className="mt-2 sm:mt-3">
//                                         <p className="text-sm font-bold text-black mb-1 sm:mb-2">Options:</p>
//                                         <div className="flex flex-wrap gap-2 sm:gap-3">
//                                             {productData.variants.map((v, i) => {
//                                                 const isSelected = selectedVariantIndex === i;
//                                                 const vPrice = v.price ?? productData.price;
//                                                 const vDiscount = v.discount ?? productData.discount ?? 0;
//                                                 const vFinal = vDiscount > 0 ? Math.round(vPrice * (1 - vDiscount / 100)) : vPrice;

//                                                 return (
//                                                     <button
//                                                         key={i}
//                                                         onClick={() => { setSelectedVariantIndex(i); setSelectedImageIndex(0); }}
//                                                         className={`p-1.5 sm:p-2 rounded-lg border-2 text-left transition-all ${
//                                                             isSelected 
//                                                                 ? 'border-blue-600 bg-blue-50 shadow-md' 
//                                                                 : 'border-gray-300 bg-white hover:border-blue-400'
//                                                         }`}
//                                                     >
//                                                         <div className="font-semibold text-gray-900 text-xs sm:text-sm">{v.name}</div>
//                                                         <div className="text-xs text-blue-600 font-bold">{currency}{vFinal}</div>
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         <p className={`mt-3 text-sm font-bold ${currentVariant?.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
//                             {currentVariant?.stock === 0 ? 'Out of Stock' : currentVariant?.stock !== undefined ? `${currentVariant.stock} in stock` : 'Available'}
//                         </p>

//                         <button
//                             onClick={handleAddToCart}

//                             disabled={currentVariant?.stock === 0}
//                             className={`mt-3 sm:mt-4 w-full py-2.5 sm:py-3 md:py-4 rounded-lg text-white font-black text-base sm:text-lg md:text-xl transition-all shadow-lg md:shadow-xl ${
//                                 currentVariant?.stock === 0
//                                     ? 'bg-gray-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transform hover:-translate-y-0.5'
//                             }`}
//                         >
//                             {currentVariant?.stock === 0 ? 'NOT AVAILABLE' : 'ADD TO CART'}
//                         </button>
//                     </div>
//                 </div>

//                 <div className="mt-8 md:mt-12 bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg md:shadow-xl">
//                     <div className="border-b border-gray-200 overflow-x-auto">
//                         <nav className="-mb-px flex space-x-4 md:space-x-6 lg:space-x-8 min-w-full" aria-label="Tabs">
//                             {['description', 'reviews', 'videos', 'manufacturer'].filter(tab => {
//                                 if (tab === 'videos') return productData.videos?.length > 0;
//                                 if (tab === 'manufacturer') return productData.manufacturerDetails;
//                                 return true;
//                             }).map(tab => (
//                                 <button 
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab)}
//                                     className={`whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg transition ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
//                                 >
//                                     {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'reviews' && `(${productData.reviews?.length || 0})`}
//                                 </button>
//                             ))}
//                         </nav>
//                     </div>

//                     <div className="pt-4 sm:pt-6 md:pt-8">
//                         {activeTab === 'description' && (
//                             <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 text-gray-700 leading-relaxed whitespace-pre-line shadow-inner text-sm sm:text-base">
//                                 {productData.description}
//                             </div>
//                         )}
                        
//                         {activeTab === 'reviews' && (
//                             <div className="max-w-full lg:max-w-4xl">
//                                 <ReviewSummary />
//                                 <AddReviewForm 
//                                     reviewRating={reviewRating}
//                                     setReviewRating={setReviewRating}
//                                     reviewComment={reviewComment}
//                                     setReviewComment={setReviewComment}
//                                     submitReview={submitReview}
//                                 />
//                                 <ReviewsList />
//                             </div>
//                         )}

//                         {activeTab === 'videos' && productData.videos?.length > 0 && (
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-full lg:max-w-5xl">
//                                 {productData.videos.map((video, i) => (
//                                     <div key={i} className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video">
//                                         <video controls className="w-full h-full" poster={productData.image?.[0]}>
//                                             <source src={video} type="video/mp4" />
//                                             Your browser does not support video.
//                                         </video>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {activeTab === 'manufacturer' && productData.manufacturerDetails && (
//                             <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 text-gray-700 leading-relaxed whitespace-pre-line shadow-inner max-w-full lg:max-w-4xl text-sm sm:text-base">
//                                 {productData.manufacturerDetails}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="mt-12 md:mt-16">
//                     <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 border-b border-gray-200 pb-2 sm:pb-3">You Might Also Like</h2>
//                     <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// // export default Product;
                            
// import React, { useContext, useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import RelatedProducts from '../components/RelatedProducts';
// import axios from 'axios';

// // Star SVG component
// const StarIcon = ({ className = 'w-5 h-5', rating, maxStars = 5 }) => (
//     <div className="flex items-center">
//         {[...Array(maxStars)].map((_, index) => {
//             const starValue = index + 1;
//             return (
//                 <svg 
//                     key={index} 
//                     className={`${className} ${starValue <= Math.round(rating) ? 'text-blue-600 fill-current' : 'text-gray-300'}`} 
//                     viewBox="0 0 24 24" 
//                     fill="currentColor"
//                 >
//                     <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
//                 </svg>
//             );
//         })}
//     </div>
// );

// // Share Icon Component
// const ShareIcon = ({ className = "w-5 h-5" }) => (
//     <svg 
//         className={className} 
//         viewBox="0 0 24 24" 
//         fill="none" 
//         stroke="currentColor" 
//         strokeWidth="2"
//     >
//         <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
//         <polyline points="16 6 12 2 8 6" />
//         <line x1="12" y1="2" x2="12" y2="15" />
//     </svg>
// );

// // Add Review Form Component
// const AddReviewForm = ({ reviewRating, setReviewRating, reviewComment, setReviewComment, submitReview }) => (
//     <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8 shadow-xl">
//         <h3 className="text-xl font-bold text-black mb-4">Add Your Review</h3>
        
//         <div className="space-y-4">
//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
//                 <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                                 key={star}
//                                 type="button"
//                                 onClick={() => setReviewRating(String(star))}
//                                 className={`p-0.5 transition hover:scale-110`}
//                                 aria-label={`${star} star rating`}
//                             >
//                                 <svg 
//                                     className={`w-7 h-7 fill-current transition-colors ${star <= Number(reviewRating) ? 'text-blue-600' : 'text-gray-300'}`} 
//                                     viewBox="0 0 24 24" 
//                                     fill="currentColor"
//                                 >
//                                     <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
//                                 </svg>
//                             </button>
//                         ))}
//                     </div>
//                     <span className="text-lg font-bold text-blue-600">
//                         {Number(reviewRating).toFixed(0)} / 5
//                     </span>
//                 </div>
//             </div>

//             <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
//                 <textarea
//                     value={reviewComment}
//                     onChange={(e) => setReviewComment(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none shadow-inner"
//                     placeholder="What did you like or dislike?"
//                     rows={3}
//                 />
//             </div>

//             <div className="flex justify-end pt-2">
//                 <button
//                     onClick={submitReview}
//                     className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-base shadow-md transition transform hover:scale-[1.02]"
//                 >
//                     Submit Review
//                 </button>
//             </div>
//         </div>
//     </div>
// );

// const Product = () => {
//     const navigate = useNavigate();
//     const { productId } = useParams();
//     const { products, currency, addToCart, user, token } = useContext(ShopContext);
//     const [productData, setProductData] = useState(null);
//     const [reviewRating, setReviewRating] = useState('5');
//     const [reviewComment, setReviewComment] = useState('');
    
//     // We rename this state to represent both images and videos
//     const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 
    
//     const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
//     const [groupSelections, setGroupSelections] = useState([]);
//     const [revPage, setRevPage] = useState(1);
//     const [isZoomed, setIsZoomed] = useState(false);
//     const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//     const [showShareMessage, setShowShareMessage] = useState(false);
//     const revPageSize = 3;
//     const [activeTab, setActiveTab] = useState('description');

//     const imageRef = useRef(null);
//     const zoomRef = useRef(null);

//     useEffect(() => {
//         const selectedProduct = products.find((item) => item._id === productId);
//         if (selectedProduct) {
//             setProductData(selectedProduct);
            
//             const hasSimpleVariants = selectedProduct.variants && selectedProduct.variants.length > 0;
//             setSelectedVariantIndex(hasSimpleVariants ? 0 : null);
            
//             setSelectedMediaIndex(0);
            
//             const hasVariantGroups = selectedProduct.variantGroups && selectedProduct.variantGroups.length > 0;
//             setGroupSelections(hasVariantGroups ? selectedProduct.variantGroups.map(() => 0) : []);
//         }
//     }, [productId, products]);

//     const currentVariant = selectedVariantIndex !== null && productData
//         ? productData.variants?.[selectedVariantIndex]
//         : null;

//     // --- LOGIC CHANGE: Combine Images and Videos into one array ---
//     const getCarouselItems = () => {
//         if (!productData) return [];
        
//         // 1. Gather Images
//         const variantImgs = currentVariant?.images || [];
//         const baseImgs = productData.image || [];
//         const allImages = variantImgs.length > 0 ? [...variantImgs, ...baseImgs] : baseImgs;
        
//         // Filter duplicates
//         const seen = new Set();
//         const uniqueImages = allImages.filter((url) => url && !seen.has(url) && seen.add(url));

//         // Create Image Objects
//         const imageItems = uniqueImages.map(url => ({ type: 'image', url }));

//         // 2. Gather Videos
//         const videoItems = (productData.videos || []).map(url => ({ type: 'video', url }));

//         // 3. Return Combined Array
//         return [...imageItems, ...videoItems];
//     };

//     const carouselItems = getCarouselItems();
//     // Safety check: ensure we have an item at the index, or fallback to the first one, or null
//     const activeMedia = carouselItems[selectedMediaIndex] || carouselItems[0];

//     const handleMouseMove = (e) => {
//         if (!isZoomed || !imageRef.current || !zoomRef.current) return;

//         const { left, top, width, height } = imageRef.current.getBoundingClientRect();
//         const x = ((e.clientX - left) / width) * 100;
//         const y = ((e.clientY - top) / height) * 100;

//         setZoomPosition({ x, y });
//     };

//     const handleMouseEnter = () => {
//         // Only zoom if it is an image
//         if (activeMedia?.type === 'image') {
//             setIsZoomed(true);
//         }
//     };
    
//     const handleMouseLeave = () => setIsZoomed(false);

//     const handleShareProduct = async () => {
//         const productUrl = window.location.href;
//         try {
//             await navigator.clipboard.writeText(productUrl);
//             setShowShareMessage(true);
//             setTimeout(() => setShowShareMessage(false), 2000);
//         } catch (error) {
//             const textArea = document.createElement('textarea');
//             textArea.value = productUrl;
//             document.body.appendChild(textArea);
//             textArea.select();
//             document.execCommand('copy');
//             document.body.removeChild(textArea);
//             setShowShareMessage(true);
//             setTimeout(() => setShowShareMessage(false), 2000);
//         }
//     };
    
//     const basePrice = currentVariant?.price ?? productData?.price ?? 0;
//     const discount = currentVariant?.discount ?? productData?.discount ?? 0;
//     const finalPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

//     const averageRating = productData?.reviews?.length 
//         ? (productData.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / productData.reviews.length).toFixed(1)
//         : '0.0';

//     const handleAddToCart = () => {
//       if (currentVariant?.stock === 0 || (currentVariant?.stock !== undefined && currentVariant.stock <= 0)) {
//         toast.error('Sorry, The product is out of stock');
//         return;
//     }

//     if (!token) {
//         toast.error('Please Login!');
//         navigate('/login');
//         return;
//     }
//         if (!user && !token) {
//             toast.error('Please login first to add items to your cart.');
//             navigate('/login');
//             return;
//         }

//         let variantKey = '';
//         if (productData.variantGroups?.length > 0) {
//             variantKey = 'g:' + groupSelections.map((sel, gi) => `${gi}-${sel}`).join('|');
//         } else {
//             variantKey = selectedVariantIndex !== null ? String(selectedVariantIndex) : '';
//         }

//         addToCart(productData._id, variantKey);
//         toast.success('Product added to cart.');
//     };
    
//     const submitReview = async () => {
//       if (!token) {
//             toast.error('Please Login to give review');
//             navigate('/login');
//             return;
//         }
//         if (!reviewRating) return toast.error('Please select a rating');
//         try {
//             const payload = { productId: productData._id, rating: Number(reviewRating), comment: reviewComment };
//             const headers = { 'Content-Type': 'application/json' };
//             if (token) headers.token = token;
            
//             const res = await axios.post(`${(import.meta.env.VITE_BACKEND_URL || '')}/api/product/review`, payload, { headers });
            
//             if (res.data.success) {
//                 toast.success('Review submitted successfully.');
//                 setProductData(prev => ({ 
//                     ...prev, 
//                     reviews: [...(prev.reviews||[]), res.data.review] 
//                 }));
//                 setReviewComment(''); 
//                 setReviewRating('5');
//                 setRevPage(1);
//             } else {
//                 toast.error(res.data.message || 'Failed to submit review');
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message || 'Failed to submit review. Please ensure you are logged in.');
//         }
//     };

//     if (!productData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="text-xl text-gray-500">Loading product details...</div>
//             </div>
//         );
//     }

//     const ReviewSummary = () => (
//         <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-100 shadow-inner">
//             <div className="flex flex-col md:flex-row items-center justify-between">
//                 <div className="text-center md:text-left mb-4 md:mb-0 md:w-1/3">
//                     <div className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-2">{averageRating}</div>
//                     <StarIcon rating={averageRating} className="w-6 h-6 mx-auto md:mx-0" />
//                     <p className="text-gray-600 text-sm mt-2">
//                         Based on {productData.reviews?.length || 0} customer reviews
//                     </p>
//                 </div>
                
//                 <div className="w-full md:w-2/3 max-w-md">
//                     {[5, 4, 3, 2, 1].map((rating) => {
//                         const count = productData.reviews?.filter(r => r.rating === rating).length || 0;
//                         const total = productData.reviews?.length || 1;
//                         const percentage = (count / total) * 100;
                        
//                         return (
//                             <div key={rating} className="flex items-center gap-3 mb-2">
//                                 <span className="text-sm font-medium text-gray-600 w-2">{rating}</span>
//                                 <StarIcon rating={5} className="w-3 h-3 text-blue-600 fill-current" />
//                                 <div className="flex-1 bg-gray-200 rounded-full h-2">
//                                     <div 
//                                         className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
//                                         style={{ width: `${percentage}%` }}
//                                     ></div>
//                                 </div>
//                                 <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );

//     const ReviewsList = () => {
//         const rev = productData.reviews?.slice().reverse() || []; 
//         const total = rev.length;
//         const totalPages = Math.max(1, Math.ceil(total / revPageSize));
//         const start = (revPage - 1) * revPageSize;
//         const visible = rev.slice(start, start + revPageSize);

//         return (
//             <div className="space-y-4 pt-4">
//                 <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">All Feedback ({total})</h4>
                
//                 {total > 0 ? (
//                     <>
//                         {visible.map((review) => (
//                             <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-lg transition">
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
//                                             {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
//                                         </div>
//                                         <div>
//                                             <div className="font-bold text-gray-900 text-sm">
//                                                 {review.name || 'Anonymous User'}
//                                             </div>
//                                             <div className="text-xs text-gray-500">
//                                                 {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                     <StarIcon rating={review.rating} className="w-4 h-4" />
//                                 </div>
                                
//                                 {review.comment && (
//                                     <p className="text-gray-700 leading-relaxed text-sm mt-3 border-l-4 border-blue-400 pl-4 py-1 bg-gray-50 rounded-sm">
//                                         "{review.comment}"
//                                     </p>
//                                 )}
//                             </div>
//                         ))}

//                         {total > revPageSize && (
//                             <div className="flex items-center justify-center gap-4 pt-6">
//                                 <button
//                                     onClick={() => setRevPage(p => Math.max(1, p - 1))}
//                                     disabled={revPage === 1}
//                                     className={`px-4 py-2 rounded-lg font-medium text-sm transition ${revPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                                 >
//                                     Previous
//                                 </button>
//                                 <div className="text-sm text-gray-700 font-medium">Page {revPage} of {totalPages}</div>
//                                 <button
//                                     onClick={() => setRevPage(p => Math.min(totalPages, p + 1))}
//                                     disabled={revPage === totalPages}
//                                     className={`px-4 py-2 rounded-lg font-medium text-sm transition ${revPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 ) : (
//                     <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
//                         <p className="text-gray-500 text-base font-medium">No reviews found. Be the first!</p>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen py-4 md:py-8">
//             <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg md:shadow-xl">

//                     <div className="lg:col-span-7 relative">
//                         <div className="absolute top-3 right-3 z-20">
//                             <div className="relative">
//                                 <button
//                                     onClick={handleShareProduct}
//                                     className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110 hover:shadow-xl z-10"
//                                     aria-label="Share product"
//                                 >
//                                     <ShareIcon className="w-5 h-5" />
//                                 </button>
                                
//                                 {showShareMessage && (
//                                     <div className="absolute top-12 right-0 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg z-30">
//                                         Link Copied!
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* --- MAIN MEDIA DISPLAY (Image or Video) --- */}
//                         <div 
//                             className="relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-lg aspect-[4/3]"
//                             onMouseEnter={handleMouseEnter}
//                             onMouseLeave={handleMouseLeave}
//                             onMouseMove={handleMouseMove}
//                             ref={imageRef}
//                         >
//                             {/* Conditional Rendering based on Media Type */}
//                             {activeMedia?.type === 'video' ? (
//                                 <video 
//                                     controls 
//                                     autoPlay 
//                                     muted 
//                                     loop
//                                     className="w-full h-full object-contain bg-black"
//                                 >
//                                     <source src={activeMedia.url} type="video/mp4" />
//                                     Your browser does not support the video tag.
//                                 </video>
//                             ) : (
//                                 <img
//                                     src={activeMedia?.url || ''} // Fallback to empty string to avoid undefined src
//                                     alt={productData.name}
//                                     className="w-full h-full object-contain p-3 md:p-4 lg:p-6 transition-transform duration-500"
//                                 />
//                             )}
                            
//                             {isZoomed && activeMedia?.type === 'image' && (
//                                 <div 
//                                     className="absolute inset-0 bg-white overflow-hidden pointer-events-none z-10"
//                                     ref={zoomRef}
//                                 >
//                                     <img
//                                         src={activeMedia.url}
//                                         alt={productData.name}
//                                         className="absolute origin-top-left scale-150"
//                                         style={{
//                                             left: `-${zoomPosition.x * 1.5}%`,
//                                             top: `-${zoomPosition.y * 1.5}%`,
//                                         }}
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                         {/* --- THUMBNAILS (Mixed Images & Videos) --- */}
//                         {carouselItems.length > 1 && (
//                             <div className="flex justify-start gap-2 md:gap-3 mt-2 md:mt-3 overflow-x-auto pb-1">
//                                 {carouselItems.map((item, i) => (
//                                     <button
//                                         key={i}
//                                         onClick={() => setSelectedMediaIndex(i)}
//                                         className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 min-w-14 min-h-14 sm:min-w-16 sm:min-h-16 md:min-w-18 md:min-h-18 border-2 rounded-lg transition-all overflow-hidden relative ${
//                                             i === selectedMediaIndex ? 'border-blue-600 shadow-md p-0.5' : 'border-gray-300 hover:border-blue-400'
//                                         }`}
//                                         aria-label={`View media ${i + 1}`}
//                                     >
//                                         {item.type === 'video' ? (
//                                             <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white">
//                                                 <span className="text-lg">🎬</span>
//                                                 <span className="text-[8px] uppercase tracking-wide mt-1">Video</span>
//                                             </div>
//                                         ) : (
//                                             <img src={item.url} alt="" className="w-full h-full object-cover rounded-md" />
//                                         )}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className="lg:col-span-5 flex flex-col justify-start pt-3 lg:pt-0">
                        
//                         <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight sm:leading-snug mb-2">{productData.name}</h1>
                        
//                         <div className="flex flex-col gap-2 text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">
//                             <div className="flex items-center gap-2">
//                                 <StarIcon rating={averageRating} className="w-4 h-4" />
//                                 <span className="font-bold text-black text-base">{averageRating}</span> 
//                                 <span className="text-gray-500 text-sm">({productData.reviews?.length || 0} reviews)</span>
//                             </div>
                            
//                             <div className="flex flex-col gap-1">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-xs font-medium text-gray-500">Category:</span>
//                                     <span className='text-sm font-semibold text-blue-600'>
//                                         {productData.category}
//                                     </span>
//                                 </div>
//                                 {productData.subCategory && (
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-xs font-medium text-gray-500">Subcategory:</span>
//                                         <span className='text-sm font-semibold text-green-600'>
//                                             {productData.subCategory}
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="mb-4">
//                             {discount > 0 ? (
//                                 <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-4">
//                                     <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600">{currency}{finalPrice}</span>
//                                     <span className="text-xl sm:text-2xl text-gray-500 line-through">{currency}{basePrice}</span>
//                                     <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shadow-md">
//                                         SAVE {discount}%
//                                     </span>
//                                 </div>
//                             ) : (
//                                 <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-600">{currency}{basePrice}</span>
//                             )}
//                         </div>
                        
//                         {(productData.variantGroups?.length > 0 || productData.variants?.length > 0) && (
//                             <div className="mt-2 space-y-2 sm:space-y-3 pb-3 border-b border-gray-100">
//                                 {productData.variantGroups?.map((group, gi) => (
//                                     <div key={gi}>
//                                         <p className="text-sm font-bold text-black mb-1 sm:mb-2">{group.label}:</p>
//                                         <div className="flex flex-wrap gap-1 sm:gap-2">
//                                             {group.variants.map((opt, oi) => {
//                                                 const isSelected = groupSelections[gi] === oi;
//                                                 return (
//                                                     <button
//                                                         key={oi}
//                                                         onClick={() => {
//                                                             const newSelections = [...groupSelections];
//                                                             newSelections[gi] = oi;
//                                                             setGroupSelections(newSelections);
                                                            
//                                                             let matchedIdx = productData.variants?.findIndex(v => v.meta?.groupIndex === gi && v.meta?.variantIndex === oi);
//                                                             setSelectedVariantIndex(matchedIdx !== -1 ? matchedIdx : selectedVariantIndex);
//                                                             setSelectedMediaIndex(0);
//                                                         }}
//                                                         className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 text-xs font-medium transition-all shadow-sm ${
//                                                             isSelected
//                                                                 ? 'border-blue-600 bg-blue-600 text-white'
//                                                                 : 'border-gray-300 bg-white text-gray-800 hover:border-blue-400'
//                                                         }`}
//                                                     >
//                                                         {opt.name || opt}
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 ))}

//                                 {productData.variants?.length > 0 && !productData.variantGroups?.length && (
//                                     <div className="mt-2 sm:mt-3">
//                                         <p className="text-sm font-bold text-black mb-1 sm:mb-2">Options:</p>
//                                         <div className="flex flex-wrap gap-2 sm:gap-3">
//                                             {productData.variants.map((v, i) => {
//                                                 const isSelected = selectedVariantIndex === i;
//                                                 const vPrice = v.price ?? productData.price;
//                                                 const vDiscount = v.discount ?? productData.discount ?? 0;
//                                                 const vFinal = vDiscount > 0 ? Math.round(vPrice * (1 - vDiscount / 100)) : vPrice;

//                                                 return (
//                                                     <button
//                                                         key={i}
//                                                         onClick={() => { setSelectedVariantIndex(i); setSelectedMediaIndex(0); }}
//                                                         className={`p-1.5 sm:p-2 rounded-lg border-2 text-left transition-all ${
//                                                             isSelected 
//                                                                 ? 'border-blue-600 bg-blue-50 shadow-md' 
//                                                                 : 'border-gray-300 bg-white hover:border-blue-400'
//                                                         }`}
//                                                     >
//                                                         <div className="font-semibold text-gray-900 text-xs sm:text-sm">{v.name}</div>
//                                                         <div className="text-xs text-blue-600 font-bold">{currency}{vFinal}</div>
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         <p className={`mt-3 text-sm font-bold ${currentVariant?.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
//                             {currentVariant?.stock === 0 ? 'Out of Stock' : currentVariant?.stock !== undefined ? `${currentVariant.stock} in stock` : 'Available'}
//                         </p>

//                         <button
//                             onClick={handleAddToCart}
//                             disabled={currentVariant?.stock === 0}
//                             className={`mt-3 sm:mt-4 w-full py-2.5 sm:py-3 md:py-4 rounded-lg text-white font-black text-base sm:text-lg md:text-xl transition-all shadow-lg md:shadow-xl ${
//                                 currentVariant?.stock === 0
//                                     ? 'bg-gray-400 cursor-not-allowed'
//                                     : 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl transform hover:-translate-y-0.5'
//                             }`}
//                         >
//                             {currentVariant?.stock === 0 ? 'NOT AVAILABLE' : 'ADD TO CART'}
//                         </button>
//                     </div>
//                 </div>

//                 <div className="mt-8 md:mt-12 bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg md:shadow-xl">
//                     <div className="border-b border-gray-200 overflow-x-auto">
//                         <nav className="-mb-px flex space-x-4 md:space-x-6 lg:space-x-8 min-w-full" aria-label="Tabs">
//                             {['description', 'reviews', 'manufacturer'].filter(tab => {
//                                 // Removed separate videos tab logic as videos are now in slider
//                                 if (tab === 'manufacturer') return productData.manufacturerDetails;
//                                 return true;
//                             }).map(tab => (
//                                 <button 
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab)}
//                                     className={`whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-bold text-xs sm:text-sm md:text-base lg:text-lg transition ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
//                                 >
//                                     {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'reviews' && `(${productData.reviews?.length || 0})`}
//                                 </button>
//                             ))}
//                         </nav>
//                     </div>

//                     <div className="pt-4 sm:pt-6 md:pt-8">
//                         {activeTab === 'description' && (
//                             <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 text-gray-700 leading-relaxed whitespace-pre-line shadow-inner text-sm sm:text-base">
//                                 {productData.description}
//                             </div>
//                         )}
                        
//                         {activeTab === 'reviews' && (
//                             <div className="max-w-full lg:max-w-4xl">
//                                 <ReviewSummary />
//                                 <AddReviewForm 
//                                     reviewRating={reviewRating}
//                                     setReviewRating={setReviewRating}
//                                     reviewComment={reviewComment}
//                                     setReviewComment={setReviewComment}
//                                     submitReview={submitReview}
//                                 />
//                                 <ReviewsList />
//                             </div>
//                         )}

//                         {activeTab === 'manufacturer' && productData.manufacturerDetails && (
//                             <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 text-gray-700 leading-relaxed whitespace-pre-line shadow-inner max-w-full lg:max-w-4xl text-sm sm:text-base">
//                                 {productData.manufacturerDetails}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="mt-12 md:mt-16">
//                     <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 border-b border-gray-200 pb-2 sm:pb-3">You Might Also Like</h2>
//                     <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Product;

import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';

// --- Sub-Components (Stars, Review Form) ---

const StarIcon = ({ className = 'w-5 h-5', rating, maxStars = 5 }) => (
    <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => {
            const starValue = index + 1;
            return (
                <svg 
                    key={index} 
                    className={`${className} ${starValue <= Math.round(rating) ? 'text-blue-600 fill-current' : 'text-gray-300'}`} 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                </svg>
            );
        })}
    </div>
);

const ShareIcon = ({ className = "w-5 h-5" }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

const AddReviewForm = ({ reviewRating, setReviewRating, reviewComment, setReviewComment, submitReview }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8 shadow-xl">
        <h3 className="text-xl font-bold text-black mb-4">Add Your Review</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setReviewRating(String(star))} className="p-0.5 transition hover:scale-110">
                                <svg className={`w-7 h-7 fill-current transition-colors ${star <= Number(reviewRating) ? 'text-blue-600' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.966z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    <span className="text-lg font-bold text-blue-600">{Number(reviewRating).toFixed(0)} / 5</span>
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none shadow-inner" placeholder="What did you like or dislike?" rows={3} />
            </div>
            <div className="flex justify-end pt-2">
                <button onClick={submitReview} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-base shadow-md transition transform hover:scale-[1.02]">Submit Review</button>
            </div>
        </div>
    </div>
);

// --- Main Product Component ---

const Product = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { products, currency, addToCart, user, token } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    
    // UI States
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0); 
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
    const [groupSelections, setGroupSelections] = useState([]);
    
    // Review States
    const [reviewRating, setReviewRating] = useState('5');
    const [reviewComment, setReviewComment] = useState('');
    const [revPage, setRevPage] = useState(1);
    
    // Media Zoom States
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [showShareMessage, setShowShareMessage] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    
    const revPageSize = 3;
    const imageRef = useRef(null);
    const zoomRef = useRef(null);

    // 1. Initialize Data
    useEffect(() => {
        const selectedProduct = products.find((item) => item._id === productId);
        if (selectedProduct) {
            setProductData(selectedProduct);
            
            // Default to first variant
            const hasVariants = selectedProduct.variants && selectedProduct.variants.length > 0;
            setSelectedVariantIndex(hasVariants ? 0 : null);
            setSelectedMediaIndex(0);
            
            // Initialize Group Selections (0,0)
            const hasVariantGroups = selectedProduct.variantGroups && selectedProduct.variantGroups.length > 0;
            setGroupSelections(hasVariantGroups ? selectedProduct.variantGroups.map(() => 0) : []);
        }
    }, [productId, products]);

    // 2. Derive Current Variant Data
    const currentVariant = selectedVariantIndex !== null && productData
        ? productData.variants?.[selectedVariantIndex]
        : null;

    // 3. Robust Media Slider Logic
    const getCarouselItems = () => {
        if (!productData) return [];
        
        // Variant Images
        const variantImgs = currentVariant?.images || [];
        // Base Product Images
        const baseImgs = productData.image || [];
        
        // Combine (Variant images first)
        const allImages = [...variantImgs, ...baseImgs];
        
        // Remove duplicates and filter valid URLs
        const uniqueImages = [...new Set(allImages)].filter(url => url && typeof url === 'string');

        const imageItems = uniqueImages.map(url => ({ type: 'image', url }));
        const videoItems = (productData.videos || []).map(url => ({ type: 'video', url }));

        return [...imageItems, ...videoItems];
    };

    const carouselItems = getCarouselItems();
    const activeMedia = carouselItems[selectedMediaIndex] || carouselItems[0];

    // 4. Mouse Handlers
    const handleMouseMove = (e) => {
        if (!isZoomed || !imageRef.current || !zoomRef.current) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => { if (activeMedia?.type === 'image') setIsZoomed(true); };
    const handleMouseLeave = () => setIsZoomed(false);

    // 5. Calculate Price & Stock Display
    // Fallback to product price if variant doesn't have specific price
    const basePrice = (currentVariant?.price !== undefined && currentVariant?.price !== null) 
                      ? currentVariant.price 
                      : (productData?.price || 0);
                      
    const discount = (currentVariant?.discount !== undefined && currentVariant?.discount !== null) 
                      ? currentVariant.discount 
                      : (productData?.discount || 0);
                      
    const finalPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;

    // Stock check
    const isOutOfStock = currentVariant?.stock === 0;
    const stockText = isOutOfStock ? 'Out of Stock' : (currentVariant?.stock ? `${currentVariant.stock} in stock` : 'Available');

    // 6. Handle Add to Cart
    const handleAddToCart = () => {
        if (isOutOfStock) {
            toast.error('Sorry, The product is out of stock');
            return;
        }
        if (!token) {
            toast.error('Please Login!');
            navigate('/login');
            return;
        }

        let variantKey = '';
        if (productData.variantGroups?.length > 0) {
            // Construct key based on selections e.g., "g:0-1|1-0"
            variantKey = 'g:' + groupSelections.map((sel, gi) => `${gi}-${sel}`).join('|');
        } else {
            variantKey = selectedVariantIndex !== null ? String(selectedVariantIndex) : '';
        }

        addToCart(productData._id, variantKey);
        toast.success('Product added to cart.');
    };

    // 7. Handle Sharing
    const handleShareProduct = async () => {
        const productUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(productUrl);
            setShowShareMessage(true);
            setTimeout(() => setShowShareMessage(false), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = productUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setShowShareMessage(true);
            setTimeout(() => setShowShareMessage(false), 2000);
        }
    };

    // 8. Submit Review Logic
    const submitReview = async () => {
        if (!token) { toast.error('Please Login to give review'); navigate('/login'); return; }
        if (!reviewRating) return toast.error('Please select a rating');
        try {
            const payload = { productId: productData._id, rating: Number(reviewRating), comment: reviewComment };
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers.token = token;
            const res = await axios.post(`${(import.meta.env.VITE_BACKEND_URL || '')}/api/product/review`, payload, { headers });
            if (res.data.success) {
                toast.success('Review submitted successfully.');
                setProductData(prev => ({ ...prev, reviews: [...(prev.reviews||[]), res.data.review] }));
                setReviewComment(''); setReviewRating('5'); setRevPage(1);
            } else { toast.error(res.data.message || 'Failed to submit review'); }
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review.'); }
    };

    // 9. Review Helpers
    const averageRating = productData?.reviews?.length 
        ? (productData.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / productData.reviews.length).toFixed(1)
        : '0.0';

    const ReviewSummary = () => (
        <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-6 md:mb-8 border border-gray-100 shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0 md:w-1/3">
                    <div className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-2">{averageRating}</div>
                    <StarIcon rating={averageRating} className="w-6 h-6 mx-auto md:mx-0" />
                    <p className="text-gray-600 text-sm mt-2">Based on {productData.reviews?.length || 0} reviews</p>
                </div>
                <div className="w-full md:w-2/3 max-w-md">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = productData.reviews?.filter(r => r.rating === rating).length || 0;
                        const percentage = (count / (productData.reviews?.length || 1)) * 100;
                        return (
                            <div key={rating} className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-gray-600 w-2">{rating}</span>
                                <StarIcon rating={5} className="w-3 h-3 text-blue-600 fill-current" />
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const ReviewsList = () => {
        const rev = productData.reviews?.slice().reverse() || []; 
        const total = rev.length;
        const totalPages = Math.max(1, Math.ceil(total / revPageSize));
        const start = (revPage - 1) * revPageSize;
        const visible = rev.slice(start, start + revPageSize);

        return (
            <div className="space-y-4 pt-4">
                <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">All Feedback ({total})</h4>
                {total > 0 ? (
                    <>
                        {visible.map((review) => (
                            <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">{review.name ? review.name.charAt(0).toUpperCase() : 'U'}</div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{review.name || 'Anonymous'}</div>
                                            <div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <StarIcon rating={review.rating} className="w-4 h-4" />
                                </div>
                                {review.comment && <p className="text-gray-700 text-sm mt-3 border-l-4 border-blue-400 pl-4 py-1 bg-gray-50">"{review.comment}"</p>}
                            </div>
                        ))}
                        {total > revPageSize && (
                            <div className="flex items-center justify-center gap-4 pt-6">
                                <button onClick={() => setRevPage(p => Math.max(1, p - 1))} disabled={revPage === 1} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-200">Prev</button>
                                <span className="text-sm font-medium">Page {revPage} of {totalPages}</span>
                                <button onClick={() => setRevPage(p => Math.min(totalPages, p + 1))} disabled={revPage === totalPages} className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-200">Next</button>
                            </div>
                        )}
                    </>
                ) : <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">No reviews yet.</div>}
            </div>
        );
    };

    if (!productData) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl shadow-lg">
                    
                    {/* LEFT: Media */}
                    <div className="lg:col-span-7 relative">
                        <div className="absolute top-3 right-3 z-20">
                            <button onClick={handleShareProduct} className="bg-white p-2 rounded-full shadow border hover:scale-110 transition"><ShareIcon /></button>
                            {showShareMessage && <div className="absolute top-12 right-0 bg-green-500 text-white px-3 py-1 rounded text-sm shadow z-30">Copied!</div>}
                        </div>

                        <div className="relative bg-gray-100 border rounded-lg overflow-hidden aspect-[4/3]"
                             onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} ref={imageRef}>
                            {activeMedia?.type === 'video' ? (
                                <video controls autoPlay muted loop className="w-full h-full object-contain bg-black"><source src={activeMedia.url} type="video/mp4" /></video>
                            ) : (
                                <img src={activeMedia?.url || ''} alt={productData.name} className="w-full h-full object-contain p-4" />
                            )}
                            {isZoomed && activeMedia?.type === 'image' && (
                                <div className="absolute inset-0 bg-white pointer-events-none z-10 overflow-hidden" ref={zoomRef}>
                                    <img src={activeMedia.url} className="absolute origin-top-left scale-150" style={{ left: `-${zoomPosition.x * 1.5}%`, top: `-${zoomPosition.y * 1.5}%` }} />
                                </div>
                            )}
                        </div>

                        {carouselItems.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                {carouselItems.map((item, i) => (
                                    <button key={i} onClick={() => setSelectedMediaIndex(i)} className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${i === selectedMediaIndex ? 'border-blue-600' : 'border-gray-300'}`}>
                                        {item.type === 'video' ? <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center">▶</div> : <img src={item.url} className="w-full h-full object-cover" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Details */}
                    <div className="lg:col-span-5">
                        <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
                        <div className="flex flex-col gap-1 text-sm text-gray-500 mb-3 pb-3 border-b">
                            <div className="flex items-center gap-2"><StarIcon rating={averageRating} /><span className="font-bold text-black">{averageRating}</span> ({productData.reviews?.length || 0})</div>
                            <div className="font-medium">Category: <span className="text-blue-600">{productData.category}</span></div>
                            {productData.subCategory && <div className="font-medium">Subcategory: <span className="text-green-600">{productData.subCategory}</span></div>}
                        </div>

                        <div className="mb-4 flex items-center gap-3">
                            <span className="text-4xl font-black text-blue-600">{currency}{finalPrice}</span>
                            {discount > 0 && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">{currency}{basePrice}</span>
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SAVE {discount}%</span>
                                </>
                            )}
                        </div>

                        {/* --- VARIANT SELECTION (FIXED) --- */}
                        {(productData.variantGroups?.length > 0 || productData.variants?.length > 0) && (
                            <div className="mt-2 space-y-3 pb-3 border-b">
                                {productData.variantGroups?.map((group, gi) => (
                                    <div key={gi}>
                                        <p className="text-sm font-bold mb-2">{group.label}:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {group.variants.map((opt, oi) => {
                                                const isSelected = groupSelections[gi] === oi;
                                                return (
                                                    <button
                                                        key={oi}
                                                        onClick={() => {
                                                            // 1. Update UI
                                                            const newSelections = [...groupSelections];
                                                            newSelections[gi] = oi;
                                                            setGroupSelections(newSelections);

                                                            // 2. FIND DATA MATCH (The Fix)
                                                            // First try to match by Meta ID (if backend provided it)
                                                            let matchedIdx = productData.variants?.findIndex(v => 
                                                                v.meta && v.meta.groupIndex === gi && v.meta.variantIndex === oi
                                                            );

                                                            // FALLBACK: Match by Name (Robust against missing meta)
                                                            if (matchedIdx === -1 && productData.variants) {
                                                                const selectedName = opt.name || opt;
                                                                matchedIdx = productData.variants.findIndex(v => 
                                                                    v.name && String(v.name).toLowerCase() === String(selectedName).toLowerCase()
                                                                );
                                                            }

                                                            // 3. Update State
                                                            if (matchedIdx !== -1) {
                                                                setSelectedVariantIndex(matchedIdx);
                                                                setSelectedMediaIndex(0);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 hover:border-blue-400'}`}
                                                    >
                                                        {opt.name || opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                                {/* Fallback for simple variants without groups */}
                                {productData.variants?.length > 0 && !productData.variantGroups?.length && (
                                    <div className="mt-2">
                                        <p className="text-sm font-bold mb-2">Options:</p>
                                        <div className="flex gap-2">
                                            {productData.variants.map((v, i) => (
                                                <button key={i} onClick={() => { setSelectedVariantIndex(i); setSelectedMediaIndex(0); }} className={`px-3 py-1.5 border-2 rounded ${selectedVariantIndex === i ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                                                    {v.name} - {currency}{v.price}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className={`mt-3 text-sm font-bold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>{stockText}</p>
                        <button onClick={handleAddToCart} disabled={isOutOfStock} className={`mt-3 w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {isOutOfStock ? 'NOT AVAILABLE' : 'ADD TO CART'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex border-b gap-6 overflow-x-auto">
                        {['description', 'reviews', 'manufacturer'].filter(tab => tab !== 'manufacturer' || productData.manufacturerDetails).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 font-bold capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>
                                {tab} {tab === 'reviews' && `(${productData.reviews?.length || 0})`}
                            </button>
                        ))}
                    </div>
                    <div className="pt-6">
                        {activeTab === 'description' && <div className="whitespace-pre-line text-gray-700">{productData.description}</div>}
                        {activeTab === 'reviews' && <><ReviewSummary /><AddReviewForm reviewRating={reviewRating} setReviewRating={setReviewRating} reviewComment={reviewComment} setReviewComment={setReviewComment} submitReview={submitReview} /><ReviewsList /></>}
                        {activeTab === 'manufacturer' && <div className="whitespace-pre-line text-gray-700">{productData.manufacturerDetails}</div>}
                    </div>
                </div>

                {/* Related */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
                    <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
                </div>
            </div>
        </div>
    );
};

export default Product;