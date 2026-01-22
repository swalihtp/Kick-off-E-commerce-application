function HeroCarousel({ banners }) {
  return (
    <section className="relative w-full overflow-hidden">
      {banners.map((banner) => (
        <div key={banner.id} className="relative h-[70vh] w-full my-1.5">
          <img
            src={banner.image_desktop}
            alt={banner.title}
            className="h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl px-6 text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase">
                {banner.title}
              </h1>
              <p className="mt-4 text-lg md:text-xl opacity-90">
                {banner.subtitle}
              </p>

              <button className="mt-6 inline-block bg-white text-black px-8 py-3 font-semibold tracking-wide hover:bg-gray-200 transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
export default HeroCarousel