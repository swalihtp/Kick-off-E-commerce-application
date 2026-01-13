import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'

function Order () {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/view/')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async orderId => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this order?'
    )

    if (!confirmCancel) return

    try {
      await api.post(`/orders/${orderId}/cancel/`)

      // update UI instantly
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, order_status: 'cancelled' } : order
        )
      )
    } catch (err) {
      alert(err.response?.data?.error || 'Unable to cancel order')
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='flex justify-center mt-20 text-lg'>
          Loading your orders...
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className='mx-auto my-10 max-w-5xl p-5'>
        <h1 className='mb-6 text-2xl font-semibold text-gray-800'>My Orders</h1>

        {orders.length === 0 ? (
          <div className='rounded-lg bg-white p-6 text-center shadow'>
            <p className='text-gray-600'>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {orders.map(order => (
              <div
                key={order.id}
                className='rounded-xl bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)]'
              >
                {/* Order Header */}
                <div className='mb-4 flex flex-wrap justify-between gap-4 border-b pb-4'>
                  <div>
                    <p className='text-sm text-gray-500'>
                      Placed on{' '}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
{/* ---------------------------------------------------------------- */}
                  <div className='text-right'>
                    <p className='text-sm font-semibold capitalize'>
                      Status:{' '}
                      <span
                        className={`font-semibold ${
                          order.order_status === 'cancelled'
                            ? 'text-red-600'
                            : order.order_status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </p>

                    <p className='text-sm text-gray-600 capitalize'>
                      Payment: {order.payment_method}
                    </p>

                    {(order.order_status === 'pending' ||
                      order.order_status === 'confirmed') && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className='mt-2 rounded-md border border-red-600 px-4 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white'
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

  {/* ----------------------------------------------------------------------------------- */}

                {/* Order Items */}
                <div className='flex flex-col gap-4'>
                  {order.items.map((item, index) => (
                    <div key={index} className='flex items-center gap-4'>
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className='h-16 w-16 rounded-md border object-cover'
                      />

                      <div className='flex-1'>
                        <p className='font-semibold text-gray-800'>
                          {item.product_name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className='font-semibold'>
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className='mt-4 flex justify-between border-t pt-4'>
                  <p className='text-sm text-gray-600'>Total Amount</p>
                  <p className='text-lg font-semibold'>₹{order.total_price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Order
