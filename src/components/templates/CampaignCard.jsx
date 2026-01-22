function CampaignCard({ banner }) {
  return (
    <div className="group relative h-90  overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition">
      {/* Image */}
      <img
        src={banner.image_desktop}
        alt={banner.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

      {/* Text */}
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h3 className="text-2xl md:text-3xl font-bold leading-tight">
          {banner.title}
        </h3>

        {banner.subtitle && (
          <p className="mt-2 text-sm md:text-base opacity-90">
            {banner.subtitle}
          </p>
        )}

        <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide border-b border-white/60 group-hover:border-white transition">
          Explore
          <span className="group-hover:translate-x-1 transition">→</span>
        </button>
      </div>
    </div>
  )
}

export default CampaignCard
