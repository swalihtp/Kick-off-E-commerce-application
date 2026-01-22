import { useState } from 'react'
import api from '../api/axios'

function RegisterAdmin ({onClose}) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setLoading(true)

    try {
      const res = await api.post('accounts/register-admin/', form)
      setSuccess(res.data.message)
      setForm({ first_name: '', last_name: '', email: '', password: '' })
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-xl shadow-xl p-6 relative'>
      <button
        onClick={onClose}
        className='absolute top-3 right-3 text-gray-400 hover:text-black'
      >
        ✕
      </button>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-xl shadow-lg w-full max-w-md'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>Create Admin</h2>

        {success && (
          <p className='bg-green-100 text-green-700 p-2 rounded mb-4 text-center'>
            {success}
          </p>
        )}

        {/* First Name */}
        <input
          type='text'
          name='first_name'
          placeholder='First Name'
          value={form.first_name}
          onChange={handleChange}
          className='w-full mb-3 p-2 border rounded'
        />

        {/* Last Name */}
        <input
          type='text'
          name='last_name'
          placeholder='Last Name'
          value={form.last_name}
          onChange={handleChange}
          className='w-full mb-3 p-2 border rounded'
        />

        {/* Email */}
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          className='w-full mb-1 p-2 border rounded'
        />
        {errors.email && (
          <p className='text-red-500 text-sm mb-2'>{errors.email}</p>
        )}

        {/* Password */}
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          className='w-full mb-1 p-2 border rounded'
        />
        {errors.password && (
          <p className='text-red-500 text-sm mb-2'>{errors.password}</p>
        )}

        <button
          disabled={loading}
          className='w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800 transition'
        >
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </div>
  )
}

export default RegisterAdmin
