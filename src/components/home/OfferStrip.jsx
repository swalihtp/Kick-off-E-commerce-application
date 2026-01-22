function OfferStrip({ banner }) {
  return (
    <div className="bg-black text-white text-center py-2 text-sm tracking-wide">
      <span className="font-semibold">{banner.title}</span>
      <span className="opacity-80"> — {banner.subtitle}</span>
    </div>
  )
}


export default OfferStrip
