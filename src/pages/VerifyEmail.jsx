import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'

function VerifyEmail() {
  const { uid, token } = useParams()
  const [status, setStatus] = useState('loading')
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get(`accounts/verify-email/${uid}/${token}/`)
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/login'), 2000)
      })
      .catch(() => {
        setStatus('error')
      })
  }, [uid, token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        {status === 'loading' && (
          <p className="text-gray-600">Verifying your email...</p>
        )}

        {status === 'success' && (
          <p className="text-green-600 font-semibold">
            ✅ Email verified successfully! Redirecting to login...
          </p>
        )}

        {status === 'error' && (
          <p className="text-red-600 font-semibold">
            ❌ Verification link is invalid or expired.
          </p>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
