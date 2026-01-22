import React, { useState, useEffect } from 'react'
import DashboardHeader from '../components/admin/DashboardHeader'
import DashboardSidebar from '../components/admin/DashboardSidebar'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Users () {
  const [users, setUsers] = useState([])
  const [refresh, setRefresh] = useState(false)
  const navigate=useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [refresh])

  const fetchUsers = async () => {
    try {
      const res = await api.get('admin/users/')
      console.log(res.data);
      
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }
  const toggleUserStatus = async (e,userId, status) => {
    e.stopPropagation()
    try {
      await api.patch(`admin/users/`, { id: userId, status: status })
      setRefresh(prev => !prev)
      alert('user status updated')
    } catch (err) {
      alert('something gone wrong')
      console.error(err)
    }
  }


  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <DashboardHeader />

      <div className='flex flex-1'>
        <DashboardSidebar />

        {/* Main Content */}
        <main className='flex-1 p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-6'>
            Users Management
          </h2>

          {/* Users List */}
          <div className='space-y-4'>
            {users.map(user => (
              <div
                key={user.id}
                onClick={()=>navigate(`/admin/userdetails/${user.id}/`)}
                className='bg-white rounded-xl shadow-sm
                 hover:shadow-md transition
                 p-6 flex items-center justify-between cursor-pointer'
              >
                {/* Left Side */}
                <div className='flex items-center gap-5'>
                  {/* Avatar */}
                  <div className='w-14 h-14 rounded-full overflow-hidden border'>
                    <img
                      src={user.profile_image || '/avatar.png'}
                      alt={user.first_name}
                      className='w-full h-full object-cover'
                    />
                  </div>

                  {/* User Info */}
                  <div>
                    <p className='font-semibold text-gray-800 text-lg'>
                      {user.first_name} {user.last_name}
                    </p>
                    <p className='text-sm text-gray-500'>{user.email}</p>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className='flex gap-3'>
                  {user.is_active ? (
                    <button
                      onClick={(e) => toggleUserStatus(e,user.id, false)}
                      className='px-4 py-2 text-sm rounded-lg
                 bg-white text-black border-2
                 hover:bg-gray-100 transition'
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={(e) => toggleUserStatus(e,user.id, true)}
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
  )
}

export default Users
