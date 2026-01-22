function CategoryTile({ banner }) {
  return (
    <div className="group relative h-105 overflow-hidden rounded-2xl cursor-pointer">
      {/* Image */}
      <img
        src={banner.image_desktop}
        alt={banner.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Strong gradient for readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-3xl font-extrabold text-white tracking-wide uppercase">
          {banner.title}
        </h3>

        <span className="mt-3 inline-block text-sm font-semibold text-white border-b-2 border-white/60 group-hover:border-white transition">
          Shop Now
        </span>
      </div>
    </div>
  )
}

export default CategoryTile
