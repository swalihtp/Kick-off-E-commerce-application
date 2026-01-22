import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DashboardHeader from './admin/DashboardHeader'
import DashboardSidebar from './admin/DashboardSidebar'
import { useEffect } from 'react'

function AddProduct () {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: null,
    stock: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('admin/categories/')
        setCategories(res.data)
      } catch (error) {
        console.error('Error fetching categories', error)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const data = new FormData()
    data.append('name', formData.name)
    data.append('price', formData.price)
    data.append('category', formData.category)
    data.append('description', formData.description)
    data.append('image', formData.image)

    try {
      await api.post('products/products/', data)
      toast.success('Product added successfully')
      navigate('/admin/products')
    } catch (err) {
      console.error(err.response?.data)
      toast.error('Something went wrong')
    }
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
          <div className='max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8'>
            <h1 className='text-xl font-semibold text-gray-800 mb-6'>
              Add New Product
            </h1>

            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Product Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Product Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full rounded-lg border border-gray-300
                             px-4 py-2 text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-black'
                />
              </div>

              {/* Price */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Price
                </label>
                <input
                  type='number'
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className='w-full rounded-lg border border-gray-300
                             px-4 py-2 text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-black'
                />
              </div>

              {/* Category */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Category
                </label>

                <select
                  name='category'
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className='w-full rounded-lg border border-gray-300 px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none'
                >
                  <option value=''>Select Category</option>

                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  className='w-full rounded-lg border border-gray-300
                             px-4 py-2 text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-black'
                />
              </div>

              {/* Image */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Product Image
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={e =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0]
                    })
                  }
                  className='w-full text-sm text-gray-600
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0
                             file:bg-black file:text-white
                             hover:file:bg-gray-800'
                />
              </div>

              {/* Submit */}
              <button
                type='submit'
                className='w-full bg-black text-white py-2.5
                           rounded-lg font-medium
                           hover:bg-gray-800 transition'
              >
                Add Product
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddProduct
