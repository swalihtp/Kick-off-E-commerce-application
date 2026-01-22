import { useEffect, useState } from 'react'
import api from '../api/axios'

function ReviewsSection ({ productId }) {
  const [reviews, setReviews] = useState([])
  const [canReview, setCanReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
    checkCanReview()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const res = await api.get(
        `/products/${productId}/reviews/`
      )
      setReviews(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const checkCanReview = async () => {
    try {
      const res = await api.get(
        `/products/${productId}/can-review/`
      )
      setCanReview(res.data.can_review)
    } catch (err) {
      console.error(err)
    }
  }

  const submitReview = async e => {
    e.preventDefault()

    try {
      const res = await api.post(
        `/products/${productId}/reviews/`,
        { rating, review }
      )

      setReviews(prev => [res.data, ...prev])
      setReview('')
      setRating(5)
      setCanReview(false)
    } catch (err) {
      alert(err.response?.data || 'Unable to submit review')
    }
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>
      <h2 className='text-2xl font-semibold mb-6'>Customer Reviews</h2>

      {/* Review Form */}
      {canReview && (
        <form
          onSubmit={submitReview}
          className='mb-8 rounded-xl bg-white p-6 shadow'
        >
          <h3 className='mb-4 font-semibold'>Write a Review</h3>

          <select
            value={rating}
            onChange={e => setRating(e.target.value)}
            className='mb-3 w-full rounded border p-2'
          >
            {[5, 4, 3, 2, 1].map(num => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>

          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder='Write your review...'
            className='w-full rounded border p-3'
            rows='4'
            required
          />

          <button
            type='submit'
            className='mt-4 rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800'
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className='text-gray-500'>No reviews yet.</p>
      ) : (
        <div className='space-y-4'>
          {reviews.map(r => (
            <div
              key={r.id}
              className='rounded-lg border p-4 bg-white'
            >
              <div className='flex justify-between mb-1'>
                <p className='font-semibold'>{r.user}</p>
                <p className='text-sm text-gray-500'>
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>

              <p className='text-yellow-500'>
                {'★'.repeat(r.rating)}
                {'☆'.repeat(5 - r.rating)}
              </p>

              <p className='mt-2 text-gray-700'>{r.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewsSection
