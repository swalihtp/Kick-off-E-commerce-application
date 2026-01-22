import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardHeader from './admin/DashboardHeader'
import DashboardSidebar from './admin/DashboardSidebar'
import api from '../api/axios'

function UpdateProduct () {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [preview, setPreview] = useState(null)

  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: null
  })

  /* Fetch product */
  useEffect(() => {
    api
      .get(`products/products/${id}/`)
      .then(res => {
        setProduct({
          name: res.data.name,
          price: res.data.price,
          category: res.data.category, // ID
          image: null
        })
        setPreview(res.data.image) // existing image
      })
      .catch(console.error)
  }, [id])

  /* Fetch categories */
  useEffect(() => {
    api
      .get('admin/categories/')
      .then(res => setCategories(res.data))
      .catch(console.error)
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: name === 'category' ? Number(value) : value
    }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setProduct({ ...product, image: file })
    setPreview(URL.createObjectURL(file))
  }

  const handleUpdate = async e => {
    e.preventDefault()

    const data = new FormData()
    data.append('name', product.name)
    data.append('price', product.price)
    data.append('category', product.category)

    if (product.image) {
      data.append('image', product.image)
    }

    try {
      await api.patch(`products/products/${id}/`, data)
      alert('Product updated successfully!')
      navigate('/admin/products')
    } catch (err) {
      console.error(err.response?.data)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader />

      <div className='flex'>
        <DashboardSidebar />

        <main className='flex-1 p-6'>
          <div className='max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8'>
            <h2 className='text-xl font-semibold mb-6'>Update Product</h2>

            <form onSubmit={handleUpdate} className='space-y-5'>
              {/* Name */}
              <input
                type='text'
                name='name'
                value={product.name}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2'
                placeholder='Product Name'
              />

              {/* Price */}
              <input
                type='number'
                name='price'
                value={product.price}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2'
                placeholder='Price'
              />

              {/* Category */}
              <select
                name='category'
                value={product.category}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2'
                required
              >
                <option value=''>Select Category</option>

                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Image Preview */}
              {preview && (
                <img
                  src={preview}
                  alt='preview'
                  className='h-32 rounded-lg object-cover'
                />
              )}

              {/* Image Upload */}
              <div className='w-full border rounded-lg px-4 py-2'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='w-full'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800'
              >
                Update Product
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default UpdateProduct
