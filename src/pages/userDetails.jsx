import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import DashboardHeader from '../components/admin/DashboardHeader'
import DashboardSidebar from '../components/admin/DashboardSidebar'

function UserDetails () {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`admin/userdetails/${id}/`)
        setUser(res.data)
        console.log(res.data);
        
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get(`admin/users/${id}/orders/`)
        setOrders(res.data)
      } catch (error) {
        console.error('Error fetching orders', error)
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchUser()
    fetchOrders()
  }, [id])

  const handleStatusToggle = async () => {
    try {
      await api.patch(`admin/users/`, {
        id:id,
        status: !user.is_active
      })
      setUser(prev => ({ ...prev, is_active: !prev.is_active }))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-100'>
        <DashboardHeader />
        <div className='flex justify-center mt-24 text-gray-600'>
          Loading user details...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-100'>
        <DashboardHeader />
        <div className='flex justify-center mt-24 text-red-600'>
          User not found
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <DashboardHeader />

      <div className='flex'>
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className='flex-1 p-6'>
          <div className='max-w-4xl mx-auto space-y-8'>
            {/* ================= USER CARD ================= */}
            <div className='bg-white rounded-2xl shadow-md border border-gray-200'>
              {/* Card Header */}
              <div className='flex items-center gap-5 px-6 py-5 border-b bg-gray-50 rounded-t-2xl'>
                {/* Avatar */}
                <div className='w-20 h-20 rounded-full overflow-hidden border bg-white shadow-sm'>
                  <img
                    src={user.profile_image || '/default-user.png'}
                    alt='User'
                    className='w-full h-full object-cover'
                    onError={e => (e.target.src = '/default-user.png')}
                  />
                </div>

                {/* Title + Status */}
                <div className='flex-1'>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    User Profile
                  </h2>

                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      user.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.is_active ? 'ACTIVE USER' : 'BLOCKED USER'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className='p-6 space-y-4'>
                <DetailRow label='Email' value={user.email} />
                <DetailRow label='Phone Number' value={user.phone_number} />
                <DetailRow
                  label='Joined'
                  value={user.date_joined?.slice(0, 10)}
                />
              </div>

              {/* Card Footer */}
              <div className='px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end'>
                <button
                  onClick={handleStatusToggle}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
                    user.is_active
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {user.is_active ? 'Block User' : 'Activate User'}
                </button>
              </div>
            </div>

            {/* ================= ORDERS CARD ================= */}
            <div className='bg-white rounded-2xl shadow-md border border-gray-200'>
              <div className='px-6 py-5 border-b bg-gray-50 rounded-t-2xl'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  User Orders
                </h3>
              </div>

              <div className='p-6'>
                {ordersLoading ? (
                  <p className='text-gray-500'>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className='text-gray-500'>No orders found</p>
                ) : (
                  <div className='space-y-4'>
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className='flex items-center justify-between p-4 rounded-xl border bg-gray-50 hover:bg-gray-100 transition'
                      >
                        <div>
                          <p className='text-sm font-semibold text-gray-900'>
                            Order #{order.id}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {order.created_at.slice(0, 10)}
                          </p>
                        </div>

                        <div className='text-right'>
                          <p className='text-sm font-semibold text-gray-900'>
                            ₹{order.total_price}
                          </p>
                          <span
                            className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full capitalize ${
                              order.order_status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function DetailRow ({ label, value }) {
  return (
    <div className='flex justify-between items-center bg-gray-50 border rounded-lg px-4 py-3'>
      <span className='text-gray-500 text-sm'>{label}</span>
      <span className='font-medium text-gray-900 text-sm'>{value || '—'}</span>
    </div>
  )
}

export default UserDetails
