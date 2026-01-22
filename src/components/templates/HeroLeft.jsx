function HeroLeft({ banner }) {
  return (
    <div className="relative h-[75vh] my-1 mx-1 border rounded">
      <img src={banner.image_desktop} className="h-full w-full object-cover" />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute left-12 top-1/2 -translate-y-1/2 text-white max-w-xl">
        <h1 className="text-6xl font-extrabold uppercase">{banner.title}</h1>
        <p className="mt-4 text-lg">{banner.subtitle}</p>
      </div>
    </div>
  )
}
export default HeroLeft