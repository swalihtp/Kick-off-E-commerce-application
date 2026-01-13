import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Checkout () {
  const { items, total_price } = useSelector(state => state.cart)
  const userEmail = localStorage.getItem('userEmail')
  const navigate = useNavigate()

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

  useEffect(() => {
    if (userEmail) {
      setUserInput(prev => ({ ...prev, email: userEmail }))
    }
  }, [userEmail])

  const handleChange = e => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value
    })
  }

  const placeOrder = async () => {
    if (
      !userInput.fullName ||
      !userInput.addressLine1 ||
      !userInput.addressLine2 ||
      !userInput.city ||
      !userInput.state ||
      !userInput.pincode ||
      !userInput.email ||
      !userInput.phoneNumber ||
      !userInput.paymentMethod
    ) {
      alert('Please fill all required fields')
      return
    }
    if (userInput.paymentMethod === 'cod') {
      placeCODOrder()
    } else {
      simulatePayment();
    }
  }

  const placeCODOrder = async () => {
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
        payment_method: 'cod'
      }

      await api.post('/orders/', payload)

      navigate('/orders')
    } catch (err) {
      alert('Failed to place order')
    }
  }

const simulatePayment = async () => {
  const confirmPay = window.confirm(
    "Simulate successful payment?"
  );

  if (!confirmPay) return;

  await placePaidOrder();
};


const placePaidOrder = async () => {
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
  };

  await api.post("/orders/", payload);
  navigate("/orders");
};


  return (
    <>
      <Navbar />

      <div className='mx-auto my-10 flex max-w-300 flex-wrap gap-8 p-5'>
        {/* LEFT – FORM */}
        <div className='flex-1 basis-125 rounded-xl bg-white p-5 shadow'>
          <h2 className='mb-5 text-xl font-semibold'>Checkout</h2>

          <form onSubmit={e => e.preventDefault()}>
            <input
              type='text'
              name='fullName'
              value={userInput.fullName}
              onChange={handleChange}
              placeholder='Full Name'
              className='mb-4 w-full rounded border p-2'
            />

            <input
              type='text'
              name='pincode'
              value={userInput.pincode}
              onChange={handleChange}
              placeholder='PIN Code'
              className='mb-4 w-full rounded border p-2'
            />

            <input
              type='text'
              name='addressLine1'
              value={userInput.addressLine1}
              onChange={handleChange}
              placeholder='Address Line 1'
              className='mb-4 w-full rounded border p-2'
            />

            <input
              type='text'
              name='addressLine2'
              value={userInput.addressLine2}
              onChange={handleChange}
              placeholder='Address Line 2'
              className='mb-4 w-full rounded border p-2'
            />

            <input
              type='text'
              name='city'
              value={userInput.city}
              onChange={handleChange}
              placeholder='City'
              className='mb-4 w-full rounded border p-2'
            />

            <select
              name='state'
              value={userInput.state}
              onChange={handleChange}
              className='mb-4 w-full rounded border p-2'
            >
              <option value=''>Select State</option>
              <option value='Kerala'>Kerala</option>
              <option value='Goa'>Goa</option>
              <option value='Karnataka'>Karnataka</option>
            </select>

            <input
              type='email'
              name='email'
              value={userInput.email}
              onChange={handleChange}
              placeholder='Email'
              className='mb-4 w-full rounded border p-2'
            />

            <input
              type='text'
              name='phoneNumber'
              value={userInput.phoneNumber}
              onChange={handleChange}
              placeholder='Phone Number'
              className='mb-4 w-full rounded border p-2'
            />

            <select
              name='paymentMethod'
              value={userInput.paymentMethod}
              onChange={handleChange}
              className='mb-4 w-full rounded border p-2'
            >
              <option value=''>Select Payment Method</option>
              <option value='cod'>Cash on Delivery</option>
              <option value='card'>Card</option>
              <option value='upi'>UPI</option>
              <option value='netbanking'>Net Banking</option>
            </select>
          </form>
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className='h-fit flex-1 basis-87 rounded-xl bg-white p-5 shadow'>
          <h2 className='mb-5 text-xl font-semibold'>Your Order</h2>

          {items.length > 0 ? (
            items.map(item => (
              <div key={item.product} className='mb-4 flex gap-4'>
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className='h-16 w-16 rounded border object-cover'
                />
                <div>
                  <p className='font-semibold'>{item.product_name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.product_price * item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}

          <hr className='my-4' />

          <h3 className='text-lg font-semibold'>Total: ₹{total_price}</h3>

          <button
            type='button'
            onClick={placeOrder}
            disabled={items.length === 0}
            className='mt-4 w-full rounded bg-black p-3 text-white font-semibold disabled:opacity-50'
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  )
}

export default Checkout
