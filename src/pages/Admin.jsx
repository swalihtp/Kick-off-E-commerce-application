import React, { useState, useEffect } from 'react'
import DashboardHeader from '../components/admin/DashboardHeader'
import DashboardSidebar from '../components/admin/DashboardSidebar'
import api from '../api/axios'
import RegisterAdmin from '../components/RegisterAdmin'

function Admins () {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchUsers()

    const fetchProfile = () => {
      api
        .get('/accounts/profile/')
        .then(res => setProfile(res.data))
        .catch(err => console.error(err.message))
    }

    fetchProfile()
  }, [refresh])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('admin/admins/')
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId, status) => {
    const action = status ? 'activate' : 'block'
    const confirmMessage = `Are you sure you want to ${action} this admin?`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      await api.patch(`admin/users/`, { id: userId, status })
      setRefresh(prev => !prev)
      
      // Show success notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slideIn'
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Admin ${action}d successfully</span>
        </div>
      `
      document.body.appendChild(notification)
      setTimeout(() => {
        notification.remove()
      }, 3000)
    } catch (err) {
      alert('Something went wrong')
      console.error(err)
    }
  }

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active)
    
    return matchesSearch && matchesStatus
  })

  // Add animation style
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slideIn {
        animation: slideIn 0.3s ease-out;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  if (!profile) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      {/* Header */}
      <DashboardHeader />

      {/* Main Layout */}
      <div className='flex flex-1'>
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className='flex-1 p-6'>
          {/* Page Header */}
          <div className='bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Admin Management</h1>
                <p className='text-gray-500 text-sm mt-1'>Manage administrator accounts and permissions</p>
              </div>
              
              <div className='flex items-center space-x-4'>
                <div className='px-4 py-2 bg-gray-50 rounded-lg'>
                  <span className='text-gray-600 text-sm font-medium'>
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'admin' : 'admins'}
                  </span>
                </div>
                
                {profile.is_superuser && (
                  <button
                    onClick={() => setAddAdminOpen(true)}
                    className='px-6 py-3 rounded-xl bg-black text-white font-medium
                              hover:bg-gray-800 transition-all duration-200
                              flex items-center justify-center shadow-sm hover:shadow-md'
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Admin
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter & Search Section */}
          <div className='bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {/* Search Input */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Search Admins
                </label>
                <div className='relative'>
                  <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type='text'
                    placeholder='Search by name or email...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white
                             focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                             text-gray-700 shadow-sm'
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           text-gray-700 shadow-sm'
                >
                  <option value='all'>All Admins</option>
                  <option value='active'>Active Only</option>
                  <option value='inactive'>Blocked Only</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className='flex items-end'>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterStatus('all')
                  }}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 bg-white
                           text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200'
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className='bg-white rounded-xl shadow-sm p-8 border border-gray-200'>
              <div className='flex flex-col items-center justify-center py-12'>
                <div className='w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4'></div>
                <p className='text-gray-600'>Loading admins...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            /* Admins List */
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredUsers.map(user => {
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name'
                const userImage = user.profile_image || `https://ui-avatars.com/api/?name=${fullName}&background=374151&color=fff`
                
                return (
                  <div
                    key={user.id}
                    className='bg-white rounded-xl shadow-sm border border-gray-200
                             hover:shadow-md transition-all duration-300 overflow-hidden group'
                  >
                    {/* Admin Card Header */}
                    <div className='p-6'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='relative'>
                            <img
                              src={userImage}
                              alt={fullName}
                              className='w-16 h-16 rounded-full object-cover border-2 border-gray-200'
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${fullName}&background=374151&color=fff`
                              }}
                            />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                          
                          <div>
                            <h3 className='font-semibold text-gray-900 text-lg'>{fullName}</h3>
                            <p className='text-gray-500 text-sm mt-1'>{user.email}</p>
                          </div>
                        </div>
                        
                        {user.is_superuser && (
                          <span className='px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'>
                            Super Admin
                          </span>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div className='grid grid-cols-2 gap-3 mt-4 p-4 bg-gray-50 rounded-lg'>
                        <div>
                          <p className='text-xs text-gray-500'>Account Status</p>
                          <p className={`text-sm font-semibold ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {user.is_active ? 'Active' : 'Blocked'}
                          </p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-500'>Joined Date</p>
                          <p className='text-sm font-semibold text-gray-900'>
                            {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='mt-6'>
                        {user.id !== profile.id ? (
                          user.is_active ? (
                            <button
                              onClick={() => toggleUserStatus(user.id, false)}
                              className='w-full px-4 py-3 rounded-lg border border-red-200 text-red-600 font-medium
                                       hover:bg-red-50 transition-all duration-200 flex items-center justify-center'
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              Block Admin
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleUserStatus(user.id, true)}
                              className='w-full px-4 py-3 rounded-lg bg-black text-white font-medium
                                       hover:bg-gray-800 transition-all duration-200 flex items-center justify-center'
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Activate Admin
                            </button>
                          )
                        ) : (
                          <div className='px-4 py-3 rounded-lg bg-gray-100 text-gray-500 text-sm text-center'>
                            This is your account
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className='bg-white rounded-xl shadow-sm p-12 border border-gray-200'>
              <div className='text-center py-12'>
                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>No admins found</h3>
                <p className='text-gray-500 mb-6'>
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : profile.is_superuser 
                      ? 'Add your first admin to get started' 
                      : 'No other admins in the system'}
                </p>
                {profile.is_superuser && (
                  <button
                    onClick={() => setAddAdminOpen(true)}
                    className='px-6 py-3 rounded-xl bg-black text-white font-medium
                              hover:bg-gray-800 transition-all duration-200 inline-flex items-center'
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add First Admin
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===== MODAL OVERLAY ===== */}
      {addAdminOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* Dark Overlay */}
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setAddAdminOpen(false)}
          />

          {/* Modal Content */}
          <div className='relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <RegisterAdmin onClose={() => setAddAdminOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Admins