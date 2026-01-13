import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/productSlice'
import { fetchCart, addToCart } from '../redux/cartSlice'
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist
} from '../redux/wishlistSlice'
import Navbar from '../components/Navbar'
import FootballJerseyBanner from '../Banners/FootballJerseyBanner'
import { useNavigate } from 'react-router-dom'
import GymBanner2 from '../Banners/GymBanner2'

function Football () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items } = useSelector(state => state.products)
  const { items: cartItems } = useSelector(state => state.cart)
  const { items: wishlistItems } = useSelector(state => state.wishlist)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCart())
    dispatch(fetchWishlist())
  }, [dispatch])

  const footballProducts = items.filter(
    item => item.category_name?.toLowerCase() === 'gym'
  )
  const isInCart = id => cartItems.some(item => item.product === id)

  const isInWishlist = id => {    
    return wishlistItems.some(item => item.product === id)
    
  }
  console.log(isInWishlist(1));
  
  
  return (
    <>
      <Navbar />
      <GymBanner2/>
      <div className='min-h-screen bg-gray-100 px-8 py-12'>
        <div className='grid gap-8 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'>
          {footballProducts.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/productDetails/${item.id}`)}
              className='group flex cursor-pointer flex-col justify-between overflow-hidden rounded-[14px] bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
            >
              {/* Image */}
              <div className='flex h-65 items-center justify-center bg-gray-200 overflow-hidden'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='h-full w-full object-contain transition-transform duration-400 group-hover:scale-110'
                />
              </div>

              {/* Details */}
              <div className='p-4 text-center'>
                <p className='mb-1 text-[1.1rem] font-semibold text-gray-900'>
                  {item.name}
                </p>
                <p className='font-bold text-[#1E1E1E]'>₹{item.price}</p>
              </div>

              {/* Buttons */}
              <div className='flex items-center gap-2 px-4 pb-4 pt-3'>
                {isInCart(item.id) ? (
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
                      dispatch(addToCart(item.id))
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
                {isInWishlist(item.id) ? (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(removeFromWishlist(item.id))
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
                      dispatch(addToWishlist(item))
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
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Football
