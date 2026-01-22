import React, { useState, useEffect } from 'react'
import DashboardHeader from '../components/admin/DashboardHeader'
import DashboardSidebar from '../components/admin/DashboardSidebar'
import api from '../api/axios'
import RegisterAdmin from '../components/RegisterAdmin'

function Admins () {
  const [users, setUsers] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [profile, setProfile] = useState(null)

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
      const res = await api.get('admin/admins/')
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const toggleUserStatus = async (userId, status) => {
    try {
      await api.patch(`admin/users/`, { id: userId, status })
      setRefresh(prev => !prev)
      alert('User status updated')
    } catch (err) {
      alert('Something went wrong')
      console.error(err)
    }
  }

  if (!profile) return <p>loading</p>
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col relative'>
      {/* ===== BLURRED DASHBOARD CONTENT ===== */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300
          ${addAdminOpen ? 'blur-sm pointer-events-none select-none' : ''}
        `}
      >
        <DashboardHeader />

        <div className='flex flex-1'>
          <DashboardSidebar />

          {/* ===== MAIN CONTENT ===== */}
          <main className='flex-1 p-6'>
            {/* Header Row */}
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-2xl font-semibold text-gray-800'>
                Admin Management
              </h1>

              {profile.is_superuser && (
                <button
                  onClick={() => setAddAdminOpen(true)}
                  className='bg-black text-white px-4 py-2 rounded-lg
                hover:bg-gray-800 transition'
                >
                  + Add Admin
                </button>
              )}
            </div>

            {/* Users List */}
            <div className='space-y-4'>
              {users.map(user => (
                <div
                  key={user.id}
                  className='bg-white rounded-xl shadow-sm
                  hover:shadow-md transition
                  p-6 flex items-center justify-between'
                >
                  {/* Left */}
                  <div className='flex items-center gap-5'>
                    <div className='w-14 h-14 rounded-full overflow-hidden border'>
                      <img
                        src={user.profile_image || '/avatar.png'}
                        alt={user.first_name}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div>
                      <p className='font-semibold text-gray-800 text-lg'>
                        {user.first_name} {user.last_name}
                      </p>
                      <p className='text-sm text-gray-500'>{user.email}</p>
                    </div>
                  </div>

                  {/* Right */}
                  <div>
                    {user.is_active ? (
                      <button
                        onClick={() => toggleUserStatus(user.id, false)}
                        className='px-4 py-2 text-sm rounded-lg
                        bg-white text-black border-2
                        hover:bg-gray-100 transition'
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleUserStatus(user.id, true)}
                        className='px-4 py-2 text-sm rounded-lg
                        bg-black text-white
                        hover:bg-gray-800 transition'
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {users.length === 0 && (
              <div className='text-center text-gray-500 mt-12'>
                No users found
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {addAdminOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          {/* Dark Overlay */}
          <div
            className='absolute inset-0 bg-black/40'
            onClick={() => setAddAdminOpen(false)}
          />

          {/* Modal Content */}
          <div className='relative z-10 w-full max-w-md'>
            <RegisterAdmin onClose={() => setAddAdminOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Admins
