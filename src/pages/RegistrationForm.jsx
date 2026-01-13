import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import api from '../api/axios'

function RegistrationForm () {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  function handleChange (e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validation (value) {
    const errors = {}
    if (value.first_name.trim().length < 2) {
      errors.first_name = 'Enter a valid first name'
    }
    if (value.last_name.trim().length < 2) {
      errors.last_name = 'Enter a valid last name'
    }
    if (!value.email.includes('@')) {
      errors.email = 'Enter a valid email address'
    }
    if (value.password.length < 8) {
      errors.password = 'Password must contain at least 8 characters'
    }
    return errors
  }


  async function handleSubmit (e) {
    e.preventDefault()

    const validationErrors = validation(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    try {
      await api.post('http://127.0.0.1:8000/api/accounts/register/', form)
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      })
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <form
        onSubmit={handleSubmit}
        className='
          w-full max-w-md
          rounded-xl bg-white
          p-8 shadow-xl
          border border-[#1E1E1E]/10
        '
      >
        {/* Title */}
        <h1 className='mb-6 text-center text-3xl font-bold text-[#1E1E1E]'>
          Register
        </h1>

        {/*First Name */}
        <input
          type='text'
          name='first_name'
          placeholder='First Name'
          value={form.first_name}
          onChange={handleChange}
          required
          className='
            mb-1 w-full rounded-md
            border border-gray-300
            px-4 py-2 text-sm
            focus:border-[#420300]
            focus:outline-none
            focus:ring-2 focus:ring-[#420300]/30
          '
        />
        {errors.first_name && (
          <p className='mb-3 text-xs text-red-600'>{errors.first_name}</p>
        )}
        {/*Last Name */}
        <input
          type='text'
          name='last_name'
          placeholder='Last Name'
          value={form.last_name}
          onChange={handleChange}
          required
          className='
            mb-1 w-full rounded-md
            border border-gray-300
            px-4 py-2 text-sm
            focus:border-[#420300]
            focus:outline-none
            focus:ring-2 focus:ring-[#420300]/30
          '
        />
        {errors.last_name && (
          <p className='mb-3 text-xs text-red-600'>{errors.last_name}</p>
        )}

        {/* Email */}
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          required
          className='
            mb-1 w-full rounded-md
            border border-gray-300
            px-4 py-2 text-sm
            focus:border-[#420300]
            focus:outline-none
            focus:ring-2 focus:ring-[#420300]/30
          '
        />
        {errors.email && (
          <p className='mb-3 text-xs text-red-600'>{errors.email}</p>
        )}

        {/* Password */}
        <input
          type='password'
          name='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          className='
            mb-1 w-full rounded-md
            border border-gray-300
            px-4 py-2 text-sm
            focus:border-[#420300]
            focus:outline-none
            focus:ring-2 focus:ring-[#420300]/30
          '
        />
        {errors.password && (
          <p className='mb-4 text-xs text-red-600'>{errors.password}</p>
        )}

        {/* Submit Button */}
        <button
          type='submit'
          className='
            w-full rounded-md
            bg-linear-to-r from-[#1E1E1E] to-[#420300]
            py-2 text-sm font-semibold text-white
            transition-all duration-300
            hover:scale-[1.02]
            hover:from-[#2A2A2A] hover:to-[#5A0A05]
          '
        >
          Register
        </button>

        {/* Login Link */}
        <p className='mt-5 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-semibold text-[#0A84FF] hover:underline'
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegistrationForm
