import BannerRenderer from "./BannerRenderer"

function CategorySection({ banners }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {banners.map(banner => (
          <BannerRenderer key={banner.id} banner={banner} />
        ))}
      </div>
    </section>
  )
}

export default CategorySection
