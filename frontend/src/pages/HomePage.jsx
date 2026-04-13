import ProductCategories from '../components/ProductCategories.jsx'
import BestSellersAstro from '../components/BestSellersAstro.jsx'
import Testimonials from '../components/Testimonials.jsx'
import ImageCarousel from '../components/ImageCarousel.jsx'
import CustomerStories from '../components/CustomerStories.jsx'
import VideoSection from '../components/VideoSection.jsx'

export default function HomePage() {
  return (
    <>
      <section id="home" className="pageSection pageSection--hero">
        <ImageCarousel
          slides={[
            {
              src: '/images/zodiac_banner.jpg',
              title: 'Unlock Your Celestial Destiny',
              subtitle: 'Expert astrological guidance and premium spiritual products.',
            },
            {
              src: '/images/zodiac_banner.jpg',
              title: 'Sacred Sanatani Rituals',
              subtitle: 'Authentic vedic products for your spiritual journey.',
            },
            {
              src: '/images/zodiac_banner.jpg',
              title: 'Ancient Wisdom, Modern Living',
              subtitle: 'Bringing the timeless truths of astrology to your doorstep.',
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
    </>
  )
}

