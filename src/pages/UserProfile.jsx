import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

function UserProfile () {
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    fetchUser()
  }, [])

  /* cleanup preview url */
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage)
    }
  }, [previewImage])

  const fetchUser = async () => {
    try {
      const res = await api.get('/accounts/profile/')
      setUser(res.data)
      setFormData(res.data)
    } catch (err) {
      console.error('Failed to fetch user', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return

    setSelectedImage(file)
    setPreviewImage(URL.createObjectURL(file))
  }

  const handleCancel = () => {
    setEditMode(false)
    setFormData(user)
    setSelectedImage(null)
    setPreviewImage(null)
  }

  const handleSave = async () => {
    try {
      const data = new FormData()
      data.append('first_name', formData.first_name || '')
      data.append('last_name', formData.last_name || '')
      data.append('phone_number', formData.phone_number || '')

      if (selectedImage) {
        data.append('profile_image', selectedImage)
      }

      const res = await api.patch('/accounts/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setUser(res.data)
      setFormData(res.data)
      setEditMode(false)
      setSelectedImage(null)
      setPreviewImage(null)

      alert('Profile updated')
    } catch (err) {
      console.error(err.response?.data)
      alert('Update failed')
    }
  }

  if (loading) {
    return <p className='text-center mt-10'>Loading profile...</p>
  }

  return (
    <>
      <Navbar />

      <div className='max-w-3xl mx-auto mt-12 bg-white rounded-2xl shadow-xl border border-black/10 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center gap-6 px-6 py-6 border-b bg-linear-to-r from-[#1E1E1E] to-[#420300]'>
          <div className='relative'>
            <img
              src={previewImage || user.profile_image || '/default-user.png'}
              alt='profile'
              className='w-20 h-20 rounded-full object-cover border-2 border-white shadow-md'
            />

            {editMode && (
              <label className='absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-white text-black px-2 py-0.5 rounded-full cursor-pointer shadow'>
                Change
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
              </label>
            )}
          </div>

          <div className='flex-1 text-white'>
            <h2 className='text-xl font-semibold'>
              {user.first_name} {user.last_name}
            </h2>
            <p className='text-sm text-white/80'>{user.email}</p>
          </div>

          <button
            onClick={() => setEditMode(prev => !prev)}
            className='px-4 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:scale-105 transition'
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Body */}
        <div className='p-6 space-y-5 bg-gray-50'>
          <ProfileField
            label='First Name'
            name='first_name'
            value={formData.first_name}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            label='Last Name'
            name='last_name'
            value={formData.last_name}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            label='Phone Number'
            name='phone_number'
            value={formData.phone_number}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField label='Email' value={user.email} disabled />
        </div>

        {/* Footer */}
        {editMode && (
          <div className='flex justify-end gap-3 px-6 py-4 border-t bg-gray-100'>
            <button
              onClick={handleCancel}
              className='px-5 py-2 rounded-lg text-sm font-semibold bg-gray-300 hover:bg-gray-400'
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className='px-5 py-2 rounded-lg text-sm font-semibold text-white
              bg-linear-to-r from-[#1E1E1E] to-[#420300]
              hover:from-[#2A2A2A] hover:to-[#5A0A05]
              transition hover:scale-105'
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Bottom cards */}
      <div className='mt-8 px-6 pb-6'>
        <div className='flex gap-4'>
          {['Orders', 'Cart'].map(item => (
            <div
              key={item}
              className='flex-1 rounded-xl border border-black/10 bg-white px-6 py-5 text-center shadow-sm transition hover:shadow-md hover:scale-[1.02] cursor-pointer'
            >
              <p className='text-sm text-gray-500 mb-1'>Your</p>
              <h3 className='text-lg font-semibold'>{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---------- Reusable Field ---------- */
function ProfileField ({ label, name, value, editMode, onChange, disabled }) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm text-gray-500'>{label}</label>

      {editMode && !disabled ? (
        <input
          name={name}
          value={value || ''}
          onChange={onChange}
          className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />
      ) : (
        <p className='px-4 py-2 bg-gray-50 border rounded-lg'>{value || '—'}</p>
      )}
    </div>
  )
}

export default UserProfile
