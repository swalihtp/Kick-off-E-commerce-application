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
  const [scrolled, setScrolled] = useState(false)

  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    dispatch(fetchCart())
    dispatch(fetchProducts())
  }, [dispatch])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target) && isSearchOpen) {
        setIsSearchOpen(false)
        setSearchInput('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSearchOpen])

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setSearchInput('')
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const filteredProducts = productItems.filter(p =>
    p.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  return (
    <>
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-1000 bg-black transition-all duration-300 ${
        scrolled ? 'py-2 shadow-2xl' : 'py-3'
      }`}>
        <div className='container mx-auto px-4 md:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            {/* LOGO - LEFT */}
            <Link 
              to='/' 
              className='flex items-center gap-2 group'
            >
              <div className='h-10 w-10 rounded-full bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center'>
                <span className='font-bold text-white text-lg'>K</span>
              </div>
              <span className='font-bold text-xl bg-linear-to-r from-white to-green-200 bg-clip-text text-transparent'>
                Kick-Off
              </span>
            </Link>

            {/* DESKTOP NAVIGATION LINKS - CENTER */}
            <div className='hidden lg:flex items-center gap-8'>
              {['Football', 'Cricket', 'Volleyball', 'Gym'].map(link => (
                <Link
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  className='relative font-medium text-gray-300 hover:text-white transition-colors duration-200 group'
                >
                  {link}
                  <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300'></span>
                </Link>
              ))}
              <Link
                to='/new-arrivals'
                className='relative font-medium text-gray-300 hover:text-white transition-colors duration-200 group flex items-center gap-2'
              >
                <span className='h-2 w-2 rounded-full bg-red-500 animate-pulse'></span>
                New Arrivals
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300'></span>
              </Link>
            </div>

            {/* RIGHT SECTION - ICONS & ACTIONS */}
            <div className='flex items-center gap-3 sm:gap-4 md:gap-6'>
              {/* SEARCH ICON */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className='p-2 rounded-full hover:bg-gray-800 transition-all duration-200 group relative'
                aria-label='Search'
              >
                <img 
                  src='/icons/icons8-search-50.png' 
                  className='h-5 w-5 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity' 
                  alt='Search'
                />
              </button>

              {/* WISHLIST */}
              <button 
                onClick={() => navigate('/wishlist')}
                className='p-2 rounded-full hover:bg-gray-800 transition-all duration-200 group relative'
                aria-label='Wishlist'
              >
                <img
                  src='/icons/icons8-heart-50.png'
                  className='h-6 w-6 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity'
                  alt='Wishlist'
                />
              </button>

              {/* CART WITH BADGE */}
              <button
                onClick={() => navigate('/cart')}
                className='p-2 rounded-full hover:bg-gray-800 transition-all duration-200 group relative'
                aria-label='Cart'
              >
                <img 
                  src='/icons/icons8-cart-50.png' 
                  className='h-6 w-6 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity' 
                  alt='Cart'
                />
                {items.length > 0 && (
                  <span className='absolute -top-1 -right-1 bg-linear-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce'>
                    {items.length > 9 ? '9+' : items.length}
                  </span>
                )}
              </button>

              {/* USER DROPDOWN */}
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className='flex items-center gap-2 p-2 rounded-full hover:bg-gray-800 transition-all duration-200 group'
                  aria-label='User menu'
                >
                  <div className='h-8 w-8 rounded-full bg-linear-to-r from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600 group-hover:border-green-500 transition-colors'>
                    <img 
                      src='/icons/icons8-user-50.png' 
                      className='h-4 w-4 filter brightness-0 invert opacity-80 group-hover:opacity-100' 
                      alt='User'
                    />
                  </div>
                  <span className='hidden md:inline text-sm text-gray-300 group-hover:text-white'>
                    {user ? 'Account' : 'Login'}
                  </span>
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <div className='absolute right-0 mt-3 w-56 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden z-2000 animate-fadeIn'>
                    <div className='p-4 border-b border-gray-800'>
                      {user ? (
                        <div className='flex items-center gap-3'>
                          <div className='h-10 w-10 rounded-full bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center'>
                            <span className='font-bold text-white'>
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className='font-semibold text-white'>{user.name || 'User'}</p>
                            <p className='text-xs text-gray-400'>{user.email}</p>
                          </div>
                        </div>
                      ) : (
                        <p className='text-white font-medium'>Welcome Guest</p>
                      )}
                    </div>
                    
                    <div className='py-2'>
                      {user ? (
                        <>
                          <button
                            onClick={() => {
                              navigate('/profile')
                              setDropdownOpen(false)
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors'
                          >
                            <img 
                              src='/icons/icons8-user-50.png' 
                              className='h-4 w-4 filter brightness-0 invert opacity-70' 
                              alt='Profile'
                            />
                            <span>My Profile</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/orders')
                              setDropdownOpen(false)
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors'
                          >
                            <img 
                              src='/icons/icons8-purchase-order-50.png' 
                              className='h-4 w-4 filter brightness-0 invert opacity-70' 
                              alt='Orders'
                            />
                            <span>My Orders</span>
                          </button>
                          <button
                            onClick={() => {
                              logout()
                              setDropdownOpen(false)
                              navigate('/')
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors border-t border-gray-800 mt-2'
                          >
                            <img 
                              src='/icons/icons8-logout-50.png' 
                              className='h-4 w-4 filter brightness-0 invert opacity-70' 
                              alt='Logout'
                            />
                            <span>Logout</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigate('/login')
                              setDropdownOpen(false)
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors'
                          >
                            <img 
                              src='/icons/icons8-login-50.png' 
                              className='h-4 w-4 filter brightness-0 invert opacity-70' 
                              alt='Login'
                            />
                            <span>Login</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/register')
                              setDropdownOpen(false)
                            }}
                            className='flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-t border-gray-800'
                          >
                            <img 
                              src='/icons/icons8-registration-50.png' 
                              className='h-4 w-4 filter brightness-0 invert opacity-70' 
                              alt='Register'
                            />
                            <span>Register</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* MOBILE MENU TOGGLE */}
              <button
                className='lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label='Toggle menu'
              >
                <div className='flex flex-col gap-1.5'>
                  <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}></span>
                  <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}>
            <div className='bg-gray-900 rounded-xl p-4 border border-gray-800'>
              <div className='grid grid-cols-2 gap-3'>
                {['Football', 'Cricket', 'Volleyball', 'Gym', 'New Arrivals'].map(link => (
                  <Link
                    key={link}
                    to={`/${link.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className='flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group'
                  >
                    {link === 'New Arrivals' && (
                      <span className='h-2 w-2 rounded-full bg-red-500 animate-pulse'></span>
                    )}
                    <span className='text-gray-300 group-hover:text-white font-medium'>
                      {link}
                    </span>
                  </Link>
                ))}
              </div>
              {user && (
                <div className='mt-4 pt-4 border-t border-gray-800'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-full bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center'>
                        <span className='font-bold text-white'>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className='font-semibold text-white'>{user.name || 'User'}</p>
                        <p className='text-xs text-gray-400'>View Profile</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        navigate('/')
                        setMobileMenuOpen(false)
                      }}
                      className='px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors flex items-center gap-2'
                    >
                      <img 
                        src='/icons/icons8-logout-50.png' 
                        className='h-4 w-4 filter brightness-0 invert' 
                        alt='Logout'
                      />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY - ENHANCED */}
      {isSearchOpen && (
        <div 
          className='fixed inset-0 z-3000 bg-black/90 backdrop-blur-lg animate-fadeIn'
          ref={searchRef}
        >
          <div className='container mx-auto px-4 pt-20'>
            <div className='max-w-3xl mx-auto'>
              {/* SEARCH BAR */}
              <div className='relative'>
                <input
                  autoFocus
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder='What are you looking for? Search products...'
                  className='w-full rounded-2xl bg-gray-900 border-2 border-gray-700 focus:border-green-500 px-6 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all'
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchInput('')
                  }}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 hover:text-white transition-colors p-2'
                  aria-label='Close search'
                >
                  ✕
                </button>
              </div>

              {/* SEARCH RESULTS */}
              {searchInput && (
                <div className='mt-6 bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-slideDown'>
                  <div className='p-4 border-b border-gray-800'>
                    <h3 className='text-white font-semibold'>
                      Search Results {filteredProducts.length > 0 && `(${filteredProducts.length})`}
                    </h3>
                  </div>
                  
                  <div className='max-h-96 overflow-y-auto'>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate(`/productDetails/${p.id}`)
                            setIsSearchOpen(false)
                            setSearchInput('')
                          }}
                          className='flex items-center gap-4 p-4 hover:bg-gray-800/50 cursor-pointer transition-colors group border-b border-gray-800 last:border-0'
                        >
                          <div className='h-12 w-12 rounded-lg bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform'>
                            <img 
                              src={p.image}
                              className='h-12 w-12 object-contain' 
                              alt='Product'
                            />
                          </div>
                          <div className='flex-1'>
                            <p className='text-white font-medium group-hover:text-green-300 transition-colors'>
                              {p.name}
                            </p>
                            <p className='text-gray-400 text-sm mt-1'>
                              {p.category || 'Sports Equipment'}
                            </p>
                          </div>
                          <div className='text-green-500 font-semibold'>
                            ${p.price || '99.99'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='p-8 text-center'>
                        <div className='h-16 w-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-4'>
                          <img 
                            src='/icons/icons8-search-50.png' 
                            className='h-8 w-8 filter brightness-0 invert opacity-50' 
                            alt='No results'
                          />
                        </div>
                        <p className='text-gray-400'>No products found for "{searchInput}"</p>
                        <p className='text-sm text-gray-500 mt-2'>Try different keywords</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* RECENT SEARCHES/SUGGESTIONS */}
              <div className='mt-6'>
                <p className='text-gray-400 text-sm mb-3'>Popular Categories</p>
                <div className='flex flex-wrap gap-2'>
                  {['Football Shoes', 'Cricket Bats', 'Gym Equipment', 'Volleyballs'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSearchInput(cat)}
                      className='px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors text-sm'
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add these styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Navbar