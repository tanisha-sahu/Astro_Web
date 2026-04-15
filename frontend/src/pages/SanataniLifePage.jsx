import PujaServiceBanner from '../components/PujaServiceBanner.jsx'
import SanataniLifeCategories from '../components/SanataniLifeCategories.jsx'
import ProductGallery from '../components/ProductGallery.jsx'

export default function SanataniLifePage() {
  return (
    <>
      <section id="sanatani-life" className="pageSection pageSection--hero">
        <PujaServiceBanner />
      </section>

      <div className="page">
        <SanataniLifeCategories />
        <ProductGallery />
      </div>
    </>
  )
}
