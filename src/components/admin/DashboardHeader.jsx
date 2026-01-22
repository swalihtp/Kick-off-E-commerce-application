import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function DashboardHeader () {
  const [user, setUser] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
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

  if (!user) return <p>loading</p>

  return (
    <header className='relative flex items-center justify-between px-6 py-4 bg-black shadow-md'>
      <h3 className='text-xl font-semibold text-white tracking-wide'>
        Kick-Off
      </h3>

      <div className='relative flex items-center gap-4'>
        {/* 🔍 Search Input */}
        <input
          type='text'
          placeholder='Search users, products...'
          value={query}
          onChange={e => setQuery(e.target.value)}
          className='hidden md:block w-64 px-4 py-2 text-sm rounded-lg
                     bg-black text-white placeholder-gray-400
                     border border-gray-600 focus:outline-none'
        />

        {/* 🔽 Search Results Dropdown */}
        {results && (
          <div className='absolute top-12 right-0 w-80 bg-white rounded-lg shadow-lg z-50 p-3 text-sm'>
            
            {/* Users */}
            {results.users?.length > 0 && (
              <>
                <p className='font-semibold text-gray-500 mb-1'>Users</p>
                {results.users.map(u => (
                  <div
                    key={u.id}
                    onClick={() => navigate(`/admin/userdetails/${u.id}`)}
                    className='px-2 py-1 rounded hover:bg-gray-100 cursor-pointer'
                  >
                    {u.email}
                  </div>
                ))}
              </>
            )}

            {/* Products */}
            {results.products?.length > 0 && (
              <>
                <p className='font-semibold text-gray-500 mt-2 mb-1'>Products</p>
                {results.products.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/admin/updateproduct/${p.id}`)}
                    className='px-2 py-1 rounded hover:bg-gray-100 cursor-pointer'
                  >
                    {p.name}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Avatar */}
        <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-600 cursor-pointer'>
          <img
            src={user.profile_image}
            alt={user.name}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
