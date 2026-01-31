import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from './admin/DashboardHeader'
import DashboardSidebar from './admin/DashboardSidebar'
import api from '../api/axios'

function Products () {
  const [products, setProducts] = useState([])
  const [selectCategory, setSelectCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchingProducts()
  }, [])

  const fetchingProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('products/products/')      
      setProducts(res.data)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProductsByCategory = async category_name => {
    try {
      setLoading(true)
      const res = await api.get(
        'admin/listbycategory/',
        {
          params: { category__name: category_name }
        }
      )
      setProducts(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async productId => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(productId)
      await api.delete(`products/products/${productId}/`)
      setProducts(prev => prev.filter(p => p.id !== productId))
      
      // Show success message
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slideIn'
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Product deleted successfully</span>
        </div>
      `
      document.body.appendChild(notification)
      setTimeout(() => {
        notification.remove()
      }, 3000)
    } catch (err) {
      console.error(err)
      alert('Failed to delete product. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // Helper function to safely format price
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0.00'
    }
    return parseFloat(price).toFixed(2)
  }

  // Helper function to get rating
  const getRating = (rating) => {
    if (rating === null || rating === undefined || isNaN(rating)) {
      return '0.0'
    }
    return parseFloat(rating).toFixed(1)
  }

  // Add custom CSS for animation
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slideIn {
        animation: slideIn 0.3s ease-out;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      {/* Header - Same as Dashboard */}
      <DashboardHeader />

      {/* Main Layout - Same as Dashboard */}
      <div className='flex flex-1'>
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <main className='flex-1 p-6'>
          {/* Page Header */}
          <div className='bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Products Management</h1>
                <p className='text-gray-500 text-sm mt-1'>View, edit, and manage all products in your store</p>
              </div>
              
              <div className='flex items-center space-x-4'>
                <div className='px-4 py-2 bg-gray-50 rounded-lg'>
                  <span className='text-gray-600 text-sm font-medium'>
                    {products.length} {products.length === 1 ? 'product' : 'products'}
                  </span>
                </div>
                
                <button
                  onClick={() => navigate('/admin/addproduct')}
                  className='px-6 py-3 rounded-xl bg-black text-white font-medium
                            hover:bg-gray-800 transition-all duration-200
                            flex items-center justify-center shadow-sm hover:shadow-md'
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className='bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Filter by Category
                </label>
                <div className='flex flex-wrap gap-2'>
                  <button
                    onClick={() => {
                      setSelectCategory('')
                      fetchingProducts()
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectCategory === '' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    All Products
                  </button>
                  {['Football', 'Cricket', 'Volleyball', 'Gym'].map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectCategory(category.toLowerCase())
                        fetchProductsByCategory(category.toLowerCase())
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectCategory === category.toLowerCase() 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className='w-full md:w-auto'>
                <select
                  value={selectCategory}
                  onChange={e => {
                    setSelectCategory(e.target.value)
                    if (e.target.value) {
                      fetchProductsByCategory(e.target.value)
                    } else {
                      fetchingProducts()
                    }
                  }}
                  className='w-full md:w-64 px-4 py-3 rounded-lg border border-gray-300 bg-white
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                           text-gray-700 shadow-sm'
                >
                  <option value=''>All Categories</option>
                  <option value='football'>Football</option>
                  <option value='cricket'>Cricket</option>
                  <option value='volleyball'>Volleyball</option>
                  <option value='gym'>Gym</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products List */}
          {loading ? (
            <div className='bg-white rounded-xl shadow-sm p-8 border border-gray-200'>
              <div className='flex flex-col items-center justify-center py-12'>
                <div className='w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4'></div>
                <p className='text-gray-600'>Loading products...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
              {products.map(product => {
                // Safely extract values with defaults
                const price = product.price || 0
                const oldPrice = product.old_price
                const rating = product.rating || 0
                const categoryName = product.category_name || 'Uncategorized'
                const description = product.description || 'No description available'
                const imageUrl = product.image || 'https://via.placeholder.com/400x300?text=No+Image'

                return (
                  <div
                    key={product.id}
                    className='bg-white rounded-xl shadow-sm border border-gray-200
                             hover:shadow-md transition-all duration-300
                             overflow-hidden group'
                  >
                    {/* Product Image */}
                    <div className='relative h-48 overflow-hidden bg-gray-100'>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                        }}
                      />
                      <div className='absolute top-3 right-3'>
                        <span className='px-3 py-1 bg-black/80 text-white text-xs font-medium rounded-full'>
                          {categoryName}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className='p-5'>
                      <h3 className='font-semibold text-gray-900 text-lg mb-2 line-clamp-1'>
                        {product.name || 'Unnamed Product'}
                      </h3>
                      <p className='text-gray-500 text-sm mb-4 line-clamp-2'>
                        {description}
                      </p>
                      
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <span className='text-lg font-bold text-gray-900'>
                            ${formatPrice(price)}
                          </span>
                          {oldPrice && !isNaN(oldPrice) && oldPrice > 0 && (
                            <span className='text-sm text-gray-400 line-through ml-2'>
                              ${formatPrice(oldPrice)}
                            </span>
                          )}
                        </div>
                        <div className='flex items-center'>
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className='text-sm text-gray-600 ml-1'>
                            {getRating(rating)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className='flex gap-3 pt-4 border-t border-gray-100'>
                        <button
                          onClick={() => navigate(`/admin/updateproduct/${product.id}`)}
                          className='flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg
                                   border border-gray-300 text-gray-700 font-medium
                                   hover:bg-gray-50 transition-all duration-200 group'
                        >
                          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deletingId === product.id}
                          className='flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg
                                   border border-red-200 text-red-600 font-medium
                                   hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-200'
                        >
                          {deletingId === product.id ? (
                            <>
                              <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2'></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='bg-white rounded-xl shadow-sm p-12 border border-gray-200'>
              <div className='text-center py-12'>
                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>No products found</h3>
                <p className='text-gray-500 mb-6'>
                  {selectCategory 
                    ? `No products found in the "${selectCategory}" category.` 
                    : 'Add your first product to get started.'}
                </p>
                <button
                  onClick={() => navigate('/admin/addproduct')}
                  className='px-6 py-3 rounded-xl bg-black text-white font-medium
                            hover:bg-gray-800 transition-all duration-200 inline-flex items-center'
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Product
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Products