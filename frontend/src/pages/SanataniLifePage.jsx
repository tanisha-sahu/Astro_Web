import PujaServiceBanner from '../components/PujaServiceBanner/PujaServiceBanner.jsx'
import SanataniLifeCategories from '../components/SanataniLifeCategories/SanataniLifeCategories.jsx'
import DivineProductSection from '../components/DivineProductSection/DivineProductSection.jsx'
import ProductGallery from '../components/ProductGallery/ProductGallery.jsx'

export default function SanataniLifePage() {
  return (
    <>
      <section id="sanatani-life" className="pageSection pageSection--hero">
        <PujaServiceBanner />
      </section>

      <SanataniLifeCategories />
      <DivineProductSection />
      <ProductGallery />
    </>
  )
}
