import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from './admin/DashboardHeader'
import DashboardSidebar from './admin/DashboardSidebar'
import api from '../api/axios'

function Products () {
  const [products, setProducts] = useState([])
  const [selectCategory, setSelectCategory] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchingProducts()
  }, [])

  const fetchingProducts = async () => {
    try {
      const res = await api.get('products/products/')      
      setProducts(res.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  const fetchProductsByCategory = async category_name => {
    try {
      const res = await api.get(
        'admin/listbycategory/',
        {
          params: { category__name: category_name }
        }
      )
      setProducts(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteProduct = async productId => {
    console.log('working')

    try {
      await api.delete(`products/products/${productId}/`)
      alert('product is deleted')
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      {/* Header */}
      <DashboardHeader />

      <div className='flex flex-1'>
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className='flex-1 p-6'>
          {/* Page Title */}
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-xl font-semibold text-gray-800'>Products</h1>

            <button
              onClick={() => navigate('/admin/addproduct')}
              className='px-5 py-2 rounded-lg bg-black text-white
                         hover:bg-gray-800 transition'
            >
              + Add Product
            </button>
          </div>

          {/* Filter */}
          <div className='mb-6'>
            <select
              value={selectCategory}
              onChange={e => {
                setSelectCategory(e.target.value)
                fetchProductsByCategory(e.target.value)
              }}
              className='px-4 py-2 rounded-lg border bg-white
                         focus:outline-none focus:ring-2 focus:ring-black'
            >
              <option value=''>View by Category</option>
              <option value='football'>Football</option>
              <option value='cricket'>Cricket</option>
              <option value='volleyball'>Volleyball</option>
              <option value='gym'>Gym</option>
            </select>
          </div>

          {/* Products List */}
          <div className='space-y-4'>
            {products.length > 0 ? (
              products.map(product => (
                <div
                  key={product.id}
                  className='bg-white rounded-xl shadow-sm p-4
                             flex flex-col md:flex-row
                             md:items-center md:justify-between
                             gap-4 hover:shadow-md transition'
                >
                  {/* Product Info */}
                  <div className='flex items-center gap-4'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='w-16 h-16 rounded-lg object-cover border'
                    />

                    <div>
                      <h3 className='font-semibold text-gray-800'>
                        {product.name}
                      </h3>
                      <p className='text-sm text-gray-500 line-clamp-2'>
                        {product.description || 'No description available'}
                      </p>
                      <span
                        className='inline-block mt-1 text-xs
                                       bg-gray-100 text-gray-700
                                       px-2 py-1 rounded-full'
                      >
                        {product.category_name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-3'>
                    <button
                      onClick={() =>
                        navigate(`/admin/updateproduct/${product.id}`)
                      }
                      className='px-4 py-1.5 rounded-lg text-sm
                                 border border-gray-300
                                 hover:bg-gray-100 transition'
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className='px-4 py-1.5 rounded-lg text-sm
                                 text-red-600 border border-red-200
                                 hover:bg-red-50 transition'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center mt-12'>
                No products found
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Products
