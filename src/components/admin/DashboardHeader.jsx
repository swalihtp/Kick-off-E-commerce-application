import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function DashboardHeader () {
  const [user, setUser] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('accounts/profile/')
        setUser(res.data)
      } catch (err) {
        console.error(err.message)
      }
    }
    fetchUser()
  }, [])

  // 🔍 Search effect (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const timeout = setTimeout(() => {
      api
        .get(`/admin/search/?q=${query}`)
        .then(res => setResults(res.data))
        .catch(() => setResults(null))
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  if (!user) {
    return (
      <header className='relative flex items-center justify-between px-6 py-4 bg-black shadow-lg'>
        <div className='flex items-center space-x-2'>
          <div className='w-6 h-6 bg-gray-800 rounded animate-pulse'></div>
          <div className='w-32 h-6 bg-gray-800 rounded animate-pulse'></div>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='hidden md:block w-64 h-10 bg-gray-800 rounded-lg animate-pulse'></div>
          <div className='w-10 h-10 bg-gray-800 rounded-full animate-pulse'></div>
        </div>
      </header>
    )
  }

  return (
    <header className='relative flex items-center justify-between px-6 py-4 bg-black shadow-lg border-b border-gray-800'>
      {/* Logo/Brand */}
      <div className='flex items-center space-x-3'>
        <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center'>
          <span className='text-black font-bold text-sm'>KO</span>
        </div>
        <h3 className='text-xl font-bold text-white tracking-tight'>
          Kick-Off
          <span className='text-gray-400 text-sm font-normal ml-2'>Admin Dashboard</span>
        </h3>
      </div>

      {/* Right Section */}
      <div className='relative flex items-center gap-4'>
        {/* 🔍 Search Input */}
        <div className='relative'>
          <div className={`hidden md:flex items-center ${isSearchFocused ? 'ring-2 ring-blue-500' : ''} rounded-lg transition-all duration-200`}>
            <svg 
              className={`w-5 h-5 absolute left-3 ${isSearchFocused ? 'text-blue-500' : 'text-gray-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type='text'
              placeholder='Search users, products...'
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className='w-64 pl-10 pr-4 py-2.5 text-sm rounded-lg
                         bg-gray-900 text-white placeholder-gray-500
                         border border-gray-700 focus:outline-none
                         focus:border-blue-500 transition-colors duration-200'
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className='absolute right-3 text-gray-500 hover:text-gray-300'
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 🔽 Search Results Dropdown */}
        {results && (
          <div className='absolute top-14 right-0 w-96 bg-gray-900 rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-700'>
            <div className='p-3 border-b border-gray-800'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-gray-300'>Search Results</p>
                <span className='text-xs text-gray-500'>
                  {[results.users?.length || 0, results.products?.length || 0].reduce((a, b) => a + b)} found
                </span>
              </div>
            </div>
            
            <div className='max-h-96 overflow-y-auto'>
              {/* Users */}
              {results.users?.length > 0 && (
                <div className='p-3 border-b border-gray-800'>
                  <div className='flex items-center mb-2'>
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>Users</p>
                  </div>
                  {results.users.map(u => (
                    <div
                      key={u.id}
                      onClick={() => navigate(`/admin/userdetails/${u.id}`)}
                      className='flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors duration-150 group'
                    >
                      <div className='w-8 h-8 rounded-full bg-gray-700 overflow-hidden mr-3'>
                        {u.profile_image ? (
                          <img src={u.profile_image} alt="" className='w-full h-full object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-white text-xs'>
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-white font-medium'>{u.email}</p>
                        {u.name && (
                          <p className='text-xs text-gray-500'>{u.name}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* Products */}
              {results.products?.length > 0 && (
                <div className='p-3'>
                  <div className='flex items-center mb-2'>
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>Products</p>
                  </div>
                  {results.products.map(p => (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/admin/updateproduct/${p.id}`)}
                      className='flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors duration-150 group'
                    >
                      <div className='w-10 h-10 rounded bg-gray-700 overflow-hidden mr-3 flex items-center justify-center'>
                        {p.image ? (
                          <img src={p.image} alt="" className='w-full h-full object-cover' />
                        ) : (
                          <div className='text-white text-xs p-2'>🛒</div>
                        )}
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-white font-medium truncate'>{p.name}</p>
                        <div className='flex items-center space-x-2'>
                          <span className='text-xs text-gray-500'>${p.price?.toFixed(2)}</span>
                          <span className='text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400'>
                            {p.category || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {(!results.users?.length && !results.products?.length) && (
                <div className='p-6 text-center'>
                  <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className='text-gray-400 text-sm'>No results found for "{query}"</p>
                  <p className='text-gray-600 text-xs mt-1'>Try different keywords</p>
                </div>
              )}
            </div>

            {/* View All Results */}
            {(results.users?.length > 0 || results.products?.length > 0) && (
              <div className='p-3 border-t border-gray-800 bg-gray-950'>
                <button
                  onClick={() => {
                    // You can implement a full search results page here
                    setQuery('')
                    setResults(null)
                  }}
                  className='w-full py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-150 flex items-center justify-center'
                >
                  View all results
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* User Avatar & Menu */}
        <div className='flex items-center space-x-3'>
          <div className='hidden md:block text-right'>
            <p className='text-sm text-white font-medium'>{user.name || user.email}</p>
            <p className='text-xs text-gray-500'>Administrator</p>
          </div>
          
          <div className='relative group'>
            <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 cursor-pointer hover:border-blue-500 transition-colors duration-200'>
              <img
                src={user.profile_image}
                alt={user.name}
                className='w-full h-full object-cover'
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.name || user.email}&background=374151&color=fff`
                }}
              />
            </div>
            
            {/* User Menu Dropdown */}
            <div className='absolute right-0 top-12 w-48 bg-gray-900 rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-700'>
              <div className='p-4 border-b border-gray-800'>
                <p className='text-sm text-white font-medium truncate'>{user.name || user.email}</p>
                <p className='text-xs text-gray-500 truncate'>{user.email}</p>
              </div>
              <div className='p-2'>
                <button
                  onClick={() => navigate('/admin/profile')}
                  className='w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-150'
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </button>
                <button
                  onClick={() => navigate('/admin/settings')}
                  className='w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-150'
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => {
                    // Implement logout logic here
                    navigate('/login')
                  }}
                  className='w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg transition-colors duration-150 mt-1'
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader