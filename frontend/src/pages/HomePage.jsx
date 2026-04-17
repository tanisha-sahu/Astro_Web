import ProductCategories from '../components/ProductCategories/ProductCategories.jsx'
import BestSellersAstro from '../components/BestSellersAstro/BestSellersAstro.jsx'
import Testimonials from '../components/Testimonials/Testimonials.jsx'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel.jsx'
import CustomerStories from '../components/CustomerStories/CustomerStories.jsx'
import VideoSection from '../components/VideoSection/VideoSection.jsx'
import WhatsAppButton from '../components/WhatsAppButton/WhatsAppButton.jsx'

export default function HomePage() {
  return (
    <>
      <section id="home" className="pageSection pageSection--hero">
        <ImageCarousel
          slides={[
            {
              src: '/home-banner-images/haanuman-aabhushan.png',
              title: 'Hanuman Mangal Aabhushan',
              subtitle: 'Carry the Power of Bajrang Bali Always',
              features: [
                'Symbol of Protection & Positivity',
                'Represents Strength, Courage & Devotion',
                'Premium Finish with Spiritual Essence'
              ],
              cta: { text: 'Shop Now', link: '/products/hanuman-aabhushan' }
            },
            {
              src: '/home-banner-images/kavach.png',
              title: 'Sacred Spiritual Kavach',
              subtitle: 'Ancient Shield of Divine Protection',
              features: [
                'Energized with Vedic Mantras',
                'Represents Spiritual Awakening',
                'Exquisite Craftsmanship'
              ],
              cta: { text: 'Explore Now', link: '/products/spiritual-kavach' }
            },
            {
              src: '/home-banner-images/savitri-bandh.png',
              title: 'The Divine Savitri Bandh',
              subtitle: 'The Sacred Bond of Inner Peace',
              features: [
                'Handcrafted Traditional Design',
                'Promotes Harmony and Well-being',
                'Timeless Spiritual Accessory'
              ],
              cta: { text: 'Order Now', link: '/products/savitri-bandh' }
            },
          ]}
        />
      </section>
      <ProductCategories />
      <div className="page">
        <BestSellersAstro />
        <CustomerStories />
        <Testimonials />
        <VideoSection />
      </div>

      {/* Floating Action Buttons */}
      <WhatsAppButton />
    </>
  )
}

