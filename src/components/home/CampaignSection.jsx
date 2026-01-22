import BannerRenderer from "./BannerRenderer"

function CampaignSection({ banners }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {banners.map(banner => (
        <BannerRenderer key={banner.id} banner={banner} />
      ))}
    </section>
  )
}

export default CampaignSection
