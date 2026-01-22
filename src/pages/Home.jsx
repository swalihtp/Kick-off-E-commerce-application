import { useState, useEffect } from 'react'
import HeroSection from '../components/home/HeroSection'
import CampaignSection from '../components/home/CampaignSection'
import CategorySection from '../components/home/CategorySection'
import OfferStrip from '../components/templates/OfferStrip'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import LatestProductsBanner from '../Banners/LatestProductsBanner'
import Footer from '../components/Footer'

function Home () {
  const [banners, setBanners] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/homepage-banners/')
      .then(res => setBanners(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  console.log(banners)

  return (
    <>
      <Navbar />
      {banners.home_strip && <OfferStrip banner={banners.home_strip[0]} />}
      {banners.home_hero && <HeroSection banners={banners.home_hero} />}
      <LatestProductsBanner />

      {/* {banners.home_campaign && (
        <CampaignSection banners={banners.home_campaign} />
      )}

      {banners.home_category && (
        <CategorySection banners={banners.home_category} />
      )} */}

      <Footer />
    </>
  )
}
export default Home
