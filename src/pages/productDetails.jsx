import api from '../api/axios'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart, addToCart } from '../redux/cartSlice'
import ReviewsSection from '../components/ReviewsSection'
import { useNavigate } from 'react-router-dom'
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist
} from '../redux/wishlistSlice'

function ProductDetails () {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { items: wishlistItems } = useSelector(state => state.wishlist)
  const dispatch = useDispatch()
  const { items: cartItems } = useSelector(state => state.cart)
  const navigate=useNavigate()



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`http://127.0.0.1:8000/api/products/products/${id}/`)
        setProduct(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const isInWishlist = id => {
    return wishlistItems.some(item => item.product === id)
  }

  const isInCart = id => cartItems.some(item => item.product === id)

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500 text-lg'>Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-red-500 text-lg'>Product not found</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className='bg-gray-50 min-h-screen py-10'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow'>
            {/* IMAGE SECTION */}
            <div className='flex justify-center'>
              <img
                src={product.image}
                alt={product.name}
                className='w-full max-h-112.5 object-contain rounded-xl'
              />
            </div>

            {/* PRODUCT DETAILS */}
            <div>
              <h1 className='text-3xl font-semibold text-gray-900'>
                {product.name}
              </h1>

              <p className='text-gray-500 mt-3'>{product.description}</p>

              {/* PRICE */}
              <div className='mt-6'>
                <span className='text-3xl font-bold text-green-600'>
                  ₹{product.price}
                </span>
              </div>

              {/* STOCK */}
              <p
                className={`mt-3 font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>

              {/* ACTION BUTTONS */}
              <div className='flex gap-4 mt-8'>
                {isInCart(product.id) ? (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      navigate('/cart')
                    }}
                    className='
                      flex-1 rounded-md
                      bg-linear-to-r from-[#420300] to-[#1E1E1E]
                      px-3 py-2 text-sm font-semibold text-white
                      transition-all duration-300
                      hover:scale-105
                      hover:from-[#5A0A05] hover:to-[#2A2A2A]'
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(addToCart(product.id))
                    }}
                    className='
                    flex-1 rounded-md
                    bg-linear-to-r from-[#1E1E1E] to-[#420300]
                    px-3 py-2 text-sm font-semibold text-white
                    transition-all duration-300
                    hover:scale-105
                    hover:from-[#2A2A2A] hover:to-[#5A0A05]'
                  >
                    Add to Cart
                  </button>
                )}

                {isInWishlist(product.id) ? (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(removeFromWishlist(product.id))
                    }}
                    className='bg-transparent border-none cursor-pointer'
                  >
                    <img
                      src='/icons/icons8-heart-50 (9).png'
                      alt='remove from wishlist'
                      className='h-7 w-7 scale-125 transition-transform duration-300'
                    />
                  </button>
                ) : (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(addToWishlist(product))
                    }}
                    className='bg-transparent border-none cursor-pointer'
                  >
                    <img
                      src='/icons/icons8-heart-50 (8).png'
                      alt='add to wishlist'
                      className='h-7 w-7 transition-transform duration-300'
                    />
                  </button>
                )}
              </div>

              {/* EXTRA INFO */}
              <div className='mt-10 border-t pt-6'>
                <h3 className='text-lg font-semibold mb-2'>
                  Product Information
                </h3>
                <ul className='text-gray-600 space-y-2 text-sm'>
                  <li>Secure payment</li>
                  <li>Easy returns</li>
                  <li>Fast delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ReviewsSection productId={product.id} />
      </div>
    

    </>
  )
}

export default ProductDetails
