import { useEffect, useState } from 'react'
import api from '../api/axios'

function LatestProductsBanner () {
  const [data, setData] = useState(null)

  useEffect(() => {
    api
      .get('/products/latest-banner/')
      .then(res => setData(res.data))
      .catch(console.error)
  }, [])

  if (!data) return null

  return (
    <div className="bg-[#f9f9f9] px-8 py-10 text-center">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#420300]">
          {data.headline}
        </h1>

        <h4 className="mt-2 text-base text-gray-700">
          {data.tagline}
        </h4>
      </div>

      {/* Products */}
      <div className="flex flex-wrap justify-center gap-6">
        {data.products.length > 0 ? (
          data.products.map(product => (
            <div
              key={product.id}
              className="
                flex h-80 w-55 flex-col items-center
                rounded-[10px] border border-gray-200 bg-white p-4
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                md:w-55
                sm:w-[45%]
                xs:w-[90%]
              "
            >
              <img
                src={product.image}
                alt={product.name}
                className="
                  mb-4 h-50 w-full rounded-lg object-cover
                  md:h-50
                  sm:h-45
                  xs:h-[160px]
                "
              />

              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  {product.name}
                </h3>

                <h5 className="mt-1 text-sm text-gray-500">
                  {product.category_name}
                </h5>

                <p className="mt-2 text-sm font-semibold text-[#420300]">
                  ₹{product.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  )
}

export default LatestProductsBanner
