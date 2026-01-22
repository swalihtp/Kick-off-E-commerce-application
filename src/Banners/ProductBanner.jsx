import { useEffect, useState } from 'react'
import api from '../api/axios'

function ProductBanner () {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    api
      .get('products/banner/')
      .then(res => setProduct(res.data))
      .catch(err => console.error(err))
  }, [])

  if (!product) return null

  return (
    <div
      className="
        m-3
        rounded-2xl
        bg-linear-to-r from-[#1E1E1E] to-[#420300]
        p-6 md:p-10
        text-white
        font-['Poppins']
        shadow-xl
        overflow-hidden
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">

        {/* LEFT CONTENT */}
        <div className="text-center md:text-left">
          <p className="text-sm uppercase tracking-widest opacity-80">
            Featured Product
          </p>

          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight">
            {product.name}
          </h2>

          <p className="mt-2 text-sm opacity-90">
            Category: {product.category_name}
          </p>

          <p className="mt-4 text-xl font-semibold">
            ₹{product.price}
          </p>
        </div>

        {/* CENTER IMAGE */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="
              h-56 md:h-72
              w-full max-w-sm
              rounded-xl
              object-cover
              shadow-2xl
              border border-white/10
            "
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="text-center md:text-right">
          <h3 className="text-2xl md:text-3xl font-bold">
            Limited Stock
          </h3>

          <p className="mt-1 text-lg font-semibold opacity-95">
            Only {product.stock} Left
          </p>

          <p className="mt-2 text-sm opacity-80">
            Grab it before it’s gone
          </p>

          {/* ACTION */}
          <div className="mt-6 flex justify-center md:justify-end">
            <button
              className="
                rounded-md
                bg-white
                px-6 py-2
                text-sm font-semibold
                text-black
                transition-all
                hover:scale-105
              "
            >
              Shop Now
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductBanner
