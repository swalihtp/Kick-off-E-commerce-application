function OfferStrip({ banner }) {
  return (
    <div className="bg-black text-white text-center py-2">
      {banner.title} — {banner.subtitle}
    </div>
  )
}
export default OfferStrip