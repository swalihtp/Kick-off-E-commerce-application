function CategoryTile({ banner }) {
  return (
    <div className="relative h-95 overflow-hidden">
      <img
        src={banner.image_desktop}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
      <h3 className="absolute bottom-6 left-6 text-3xl text-white font-bold uppercase">
        {banner.title}
      </h3>
    </div>
  )
}
export default CategoryTile
