import BannerRenderer from "./BannerRenderer"

function HeroSection({ banners }) {
  return (
    <section>
      {banners.map(banner => (
        <BannerRenderer key={banner.id} banner={banner} />
      ))}
    </section>
  )
}

export default HeroSection