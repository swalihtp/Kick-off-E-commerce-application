function CampaignGrid({ banners }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="group relative overflow-hidden rounded-lg cursor-pointer"
          >
            <img
              src={banner.image_desktop}
              alt={banner.title}
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold uppercase">
                {banner.title}
              </h3>
              <p className="mt-1 text-sm opacity-90">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


export default CampaignGrid
