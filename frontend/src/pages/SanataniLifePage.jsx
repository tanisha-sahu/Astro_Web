import ImageCarousel from '../components/ImageCarousel.jsx'
import SanataniLifeCategories from '../components/SanataniLifeCategories.jsx'
import ProductGallery from '../components/ProductGallery.jsx'

export default function SanataniLifePage() {
  return (
    <>
      <section id="sanatani-life" className="pageSection pageSection--hero">
        <ImageCarousel />
      </section>

      <div className="page">
        <SanataniLifeCategories />
        <ProductGallery />
      </div>
    </>
  )
}
