import HeroLeft from '../templates/HeroLeft'
import HeroCenter from '../templates/HeroCenter'
import CampaignCard from '../templates/CampaignCard'
import CategoryTile from '../templates/CategoryTile'
import OfferStrip from './OfferStrip'

const TEMPLATE_MAP = {
  hero_left: HeroLeft,
  hero_center: HeroCenter,
  campaign_card: CampaignCard,
  category_tile: CategoryTile,
  strip: OfferStrip,
}

function BannerRenderer({ banner }) {
  const Component = TEMPLATE_MAP[banner.template_type]

  if (!Component) return null

  return <Component banner={banner} />
}

export default BannerRenderer
