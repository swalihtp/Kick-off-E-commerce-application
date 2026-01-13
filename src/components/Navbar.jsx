import { useEffect, useState, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '../redux/cartSlice'
import { fetchProducts } from '../redux/productSlice'

function Navbar () {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { items } = useSelector(state => state.cart)
  const { items: productItems } = useSelector(state => state.products)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const dropdownRef = useRef(null)

  useEffect(() => {
    dispatch(fetchCart())
    dispatch(fetchProducts())
  }, [dispatch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const filteredProducts = productItems.filter(p =>
    p.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  return (
    <>
      {/* NAVBAR */}
      <nav className='sticky top-0 z-1000 bg-black px-4 md:px-8 py-3 text-white'>
        <div className='flex items-center justify-between md:justify-evenly'>
          {/* LOGO */}

          {/* DESKTOP LINKS */}
          <div className='hidden md:flex gap-6'>
            <Link to='/' className='font-semibold text-lg'>
              Kick-Off
            </Link>
            {['Football', 'Cricket', 'Volleyball', 'Gym'].map(link => (
              <Link
                key={link}
                to={`/${link.toLowerCase()}`}
                className='font-medium hover:text-green-500'
              >
                {link}
              </Link>
            ))}
          </div>

          {/* RIGHT ICONS */}
          <div className='flex items-center gap-4 relative'>
            {/* SEARCH */}
            <button
              onClick={() => {
                setIsSearchOpen(true)
              }}
              className='flex items-center gap-2 border border-white px-3 py-2 rounded hover:scale-110 transition'
            >
              <img src='/icons/icons8-search-50.png' className='h-5' />
              <span className='hidden md:inline text-sm'>SEARCH</span>
            </button>

            {/* WISHLIST */}
            <button onClick={() => navigate('/wishlist')}>
              <img
                src='/icons/icons8-heart-50.png'
                className='h-6 w-6 hover:scale-110 transition'
              />
            </button>

            {/* CART */}
            <button
              onClick={() => navigate('/cart')}
              className='relative hover:scale-110 transition'
            >
              <img src='/icons/icons8-cart-50.png' className='h-6 w-6' />
              {items.length > 0 && (
                <span className='absolute -top-2 -right-2 text-xs bg-red-600 rounded-full px-1'>
                  {items.length}
                </span>
              )}
            </button>

            {/* USER DROPDOWN */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className='hover:scale-110 transition'
              >
                <img src='/icons/icons8-user-50.png' className='h-7 w-7' />
              </button>

              {dropdownOpen && (
                <div className='absolute right-0 mt-3 w-44 rounded-lg bg-white text-black shadow-lg overflow-hidden z-2000'>
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          navigate('/orders')
                          setDropdownOpen(false)
                        }}
                        className='block w-full px-4 py-2 text-left hover:bg-gray-100'
                      >
                        My Orders
                      </button>

                      <button
                        onClick={() => {
                          logout()
                          setDropdownOpen(false)
                          navigate('/')
                        }}
                        className='block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100'
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate('/login')
                          setDropdownOpen(false)
                        }}
                        className='block w-full px-4 py-2 text-left hover:bg-gray-100'
                      >
                        Login
                      </button>

                      <button
                        onClick={() => {
                          navigate('/register')
                          setDropdownOpen(false)
                        }}
                        className='block w-full px-4 py-2 text-left hover:bg-gray-100'
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* HAMBURGER */}
            <button
              className='md:hidden text-2xl'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-4 flex flex-col gap-4 bg-[#1E1E1E] p-4 rounded-lg'>
            {['Football', 'Cricket', 'Volleyball', 'Gym'].map(link => (
              <Link
                key={link}
                to={`/${link.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className='hover:text-green-500'
              >
                {link}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className='fixed inset-0 z-3000 bg-black/30 backdrop-blur-md'>
          <div className='fixed top-0 left-0 w-full bg-white p-4 flex flex-col items-center'>
            <div className='flex w-full max-w-xl'>
              <input
                autoFocus
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder='Search products...'
                className='flex-1 rounded-md px-4 py-3 text-lg'
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchInput('')
                }}
                className='ml-4 text-2xl'
              >
                ✕
              </button>
            </div>

            {searchInput && (
              <div className='mt-4 w-full max-w-xl bg-white rounded-md shadow max-h-64 overflow-y-auto'>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <p
                      key={p.id}
                      className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                      onClick={() => {
                        navigate(`/productDetails/${p.id}`)
                        setIsSearchOpen(false)
                        setSearchInput('')
                      }}
                    >
                      {p.name}
                    </p>
                  ))
                ) : (
                  <p className='px-4 py-3 text-gray-500 text-center'>
                    No items found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
