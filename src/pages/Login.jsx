import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'
import GoogleLoginButton from '../components/GoogleLoginButton'

function Login () {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')

  function handleChange (e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit (e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post(
        'accounts/login/',
        form
      )

      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)

      login({
        email: form.email,
        isAuthenticated: true,
        role: res.data.role
      })

      navigate('/', { replace: true })
    } catch (err) {
      console.error(err)
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md rounded-xl bg-white p-8 shadow-xl'
      >
        <h1 className='mb-6 text-center text-3xl font-bold'>Login</h1>

        {error && <p className='mb-3 text-red-600'>{error}</p>}

        <input
          type='email'
          name='email'
          placeholder='Enter your email'
          value={form.email}
          onChange={handleChange}
          autoComplete='username'
          required
          className='mb-4 w-full border px-4 py-2'
        />

        <input
          type='password'
          name='password'
          placeholder='Enter your password'
          value={form.password}
          onChange={handleChange}
          autoComplete='current-password'
          required
          className='mb-6 w-full border px-4 py-2'
        />

        <button
          disabled={loading}
          className='mb-6 w-full bg-black text-white py-2 flex items-center justify-center gap-2 disabled:opacity-70'
        >
          {loading && (
            <span className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
          )}
          Login
        </button>

        <GoogleLoginButton className='w-full bg-black text-white py-2' />

        {!error ? (
          <p className='mt-5 text-center text-sm'>
            Don’t have an account?{' '}
            <Link to='/register' className='text-blue-600'>
              Register
            </Link>
          </p>
        ) : (
          <p className='mt-5 text-center text-sm'>
            Forget Password?{' '}
            <Link to='/forgot-password' className='text-blue-600'>
              click
            </Link>
          </p>
        )}
      </form>
    </div>
  )
}

export default Login
