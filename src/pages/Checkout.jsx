import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { checkoutSchema } from '../validations/checkoutSchema'

function Checkout () {
  const { items, total_price } = useSelector(state => state.cart)
  const navigate = useNavigate()
  const userEmail = localStorage.getItem('userEmail')

  const [userInput, setUserInput] = useState({
    fullName: '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    email: '',
    phoneNumber: '',
    paymentMethod: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (userEmail) {
      setUserInput(prev => ({ ...prev, email: userEmail }))
    }
  }, [userEmail])

  const handleChange = e => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value })
  }

  const placeOrder = async () => {
    console.log('PLACE ORDER CLICKED')
    const { error } = checkoutSchema.validate(userInput, {
      abortEarly: false
    })
    console.log('VALIDATION RESULT:', error)
    if (error) {
      const validationErrors = {}
      error.details.forEach(err => {
        validationErrors[err.path[0]] = err.message
      })
      setErrors(validationErrors)
      return
    }

    setErrors({})

    try {
      const payload = {
        full_name: userInput.fullName,
        pin_code: userInput.pincode,
        address_line_1: userInput.addressLine1,
        address_line_2: userInput.addressLine2,
        city: userInput.city,
        state: userInput.state,
        country: userInput.country,
        email: userInput.email,
        phone_number: userInput.phoneNumber,
        payment_method: userInput.paymentMethod
      }

      if (userInput.paymentMethod !== 'cod') {
        const confirmPay = window.confirm('Simulate successful payment?')
        if (!confirmPay) return
      }

      await api.post('/orders/', payload)
      navigate('/orders')
    } catch (err) {
      console.error('ORDER API ERROR:', err.response?.data || err)
      alert('Order failed. Check console.')
    }
  }

  return (
    <>
      <Navbar />

      <div className='mx-auto my-10 flex max-w-5xl gap-8 p-5'>
        {/* LEFT */}
        <form
          onSubmit={e => {
            e.preventDefault()
            placeOrder()
          }}
          className='flex-1 rounded-xl bg-white p-5 shadow'
        >
          <h2 className='mb-5 text-xl font-semibold'>Checkout</h2>

          {[
            ['fullName', 'Full Name'],
            ['pincode', 'Pincode'],
            ['addressLine1', 'Address Line 1'],
            ['addressLine2', 'Address Line 2'],
            ['city', 'City'],
            ['email', 'Email'],
            ['phoneNumber', 'Phone Number']
          ].map(([name, label]) => (
            <div key={name}>
              <input
                name={name}
                value={userInput[name]}
                onChange={handleChange}
                placeholder={label}
                className='mb-1 w-full rounded border p-2'
              />
              {errors[name] && (
                <p className='mb-2 text-sm text-red-600'>{errors[name]}</p>
              )}
            </div>
          ))}

          <select
            name='state'
            value={userInput.state}
            onChange={handleChange}
            className='mb-2 w-full rounded border p-2'
          >
            <option value=''>Select State</option>
            <option value='Kerala'>Kerala</option>
            <option value='Goa'>Goa</option>
            <option value='Karnataka'>Karnataka</option>
          </select>
          {errors.state && (
            <p className='text-sm text-red-600'>{errors.state}</p>
          )}

          <select
            name='paymentMethod'
            value={userInput.paymentMethod}
            onChange={handleChange}
            className='mt-3 w-full rounded border p-2'
          >
            <option value=''>Select Payment Method</option>
            <option value='cod'>Cash on Delivery</option>
            <option value='card'>Card</option>
            <option value='upi'>UPI</option>
            <option value='netbanking'>Net Banking</option>
          </select>
          {errors.paymentMethod && (
            <p className='text-sm text-red-600'>{errors.paymentMethod}</p>
          )}

          <button
            type='submit'
            disabled={items.length === 0}
            className='mt-4 w-full rounded bg-black p-3 font-semibold text-white disabled:opacity-50'
          >
            Place Order
          </button>
        </form>

        {/* RIGHT */}
        <div className='w-80 rounded-xl bg-white p-5 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Your Order</h2>
          {items.map(item => (
            <div key={item.product} className='mb-3 flex gap-3'>
              <img
                src={item.product_image}
                className='h-14 w-14 rounded border'
              />
              <div>
                <p>{item.product_name}</p>
                <p>Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          <hr className='my-3' />
          <h3 className='font-semibold'>Total: ₹{total_price}</h3>
        </div>
      </div>
    </>
  )
}

export default Checkout
