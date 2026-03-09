import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [reviewerFilter, setReviewerFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const base = backendUrl || 'http://localhost:4000'
      const res = await axios.get(base + '/api/product/reviews/all', { headers: { token } })
        if (res.data.success) {
          // show newest reviews first in admin view
          const revs = (res.data.reviews || []).slice();
          revs.sort((a, b) => {
            const da = a && a.review && a.review.date ? new Date(a.review.date).getTime() : 0;
            const db = b && b.review && b.review.date ? new Date(b.review.date).getTime() : 0;
            return db - da;
          });
          setReviews(revs);
      } else {
        toast.error(res.data.message || 'Failed to load reviews')
      }
    } catch (err) {
      console.error('Fetch reviews error', err)
      toast.error(err.response?.data?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (productId, reviewId) => {
    if (!confirm('Delete this review? This action cannot be undone.')) return
    try {
      const base = backendUrl || 'http://localhost:4000'
      const res = await axios.post(base + '/api/product/review/remove', { productId, reviewId }, { headers: { token } })
      if (res.data && res.data.success) {
        toast.success('Review deleted')
        setReviews(prev => prev.filter(r => String(r.review._id) !== String(reviewId)))
      } else {
        toast.error(res.data.message || 'Failed to delete')
      }
    } catch (err) {
      console.error('Delete review error', err)
      toast.error(err.response?.data?.message || 'Failed to delete review')
    }
  }

  // Client-side filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reviews.filter(({ productName, review }) => {
      if (productFilter && !productName.toLowerCase().includes(productFilter.toLowerCase())) return false
      if (reviewerFilter && !(review.name || '').toLowerCase().includes(reviewerFilter.toLowerCase())) return false
      if (ratingFilter && String(review.rating) !== String(ratingFilter)) return false
      if (!q) return true
      // search in product name, reviewer name, and comment
      const inProduct = productName && productName.toLowerCase().includes(q)
      const inReviewer = review && review.name && review.name.toLowerCase().includes(q)
      const inComment = review && review.comment && review.comment.toLowerCase().includes(q)
      return inProduct || inReviewer || inComment
    })
  }, [reviews, query, productFilter, reviewerFilter, ratingFilter])

  // No pagination on admin list — show all filtered results

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="text-sm text-gray-500">{filtered.length} of {reviews.length}</div>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search product, reviewer or comment" className="px-3 py-2 rounded border w-64" />
        <input value={productFilter} onChange={e => setProductFilter(e.target.value)} placeholder="Filter by product name" className="px-3 py-2 rounded border w-56" />
        <input value={reviewerFilter} onChange={e => setReviewerFilter(e.target.value)} placeholder="Filter by reviewer name" className="px-3 py-2 rounded border w-56" />
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="px-3 py-2 rounded border">
          <option value="">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
        <button onClick={() => { setQuery(''); setProductFilter(''); setReviewerFilter(''); setRatingFilter('') }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-gray-500">No reviews match your filters</div>
          ) : (
            filtered.map((r, idx) => (
              <div key={String(r.review._id) + '-' + idx} className="bg-white border rounded p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {r.productImage ? (
                      <img src={r.productImage} alt={r.productName || 'Product image'} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No image</div>
                    )}
                    <div>
                      {/* Show product name as primary title when available, otherwise reviewer name */}
                      <div className="font-semibold">{r.productName || r.review.reviewerName || r.review.name || 'Unknown Product'}</div>
                      {/* If productName exists, show reviewer name as secondary info */}
                      {r.productName && (
                        <div className="text-sm text-gray-600">Reviewer: {r.review.reviewerName || r.review.name || 'Anonymous'}</div>
                      )}
                      <div className="text-xs text-gray-500">{new Date(r.review.date).toLocaleString()}</div>
                      <div className="mt-2 text-sm">{r.review.comment || <span className="text-gray-400">(no comment)</span>}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold mb-2">{r.review.rating} / 5</div>
                    <button onClick={() => handleDelete(r.productId, r.review._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Admin view shows all results — pagination removed per request */}
    </div>
  )
}

export default Reviews
