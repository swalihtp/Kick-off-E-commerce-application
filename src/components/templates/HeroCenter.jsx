function HeroCenter({ banner }) {
  return (
    <div className="relative h-[75vh] flex items-center justify-center text-center my-1 mx-1 border rounded">
      <img src={banner.image_desktop} className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative text-white">
        <h1 className="text-5xl font-bold uppercase">{banner.title}</h1>
        <button className="mt-6 px-10 py-3 bg-white text-black font-semibold">
          Shop Now
        </button>
      </div>
    </div>
  )
}

export default HeroCenter