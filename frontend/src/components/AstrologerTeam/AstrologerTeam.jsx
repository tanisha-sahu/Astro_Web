import './AstrologerTeam.css'

const TEAM = [
  {
    id: 1,
    name: 'Acharya V. Shastri',
    specialty: 'Vedic Astrology',
    experience: '15+ Years',
    rating: 4.9,
    reviews: 1240,
    status: 'online',
    img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 2,
    name: 'Dr. Pallavi Sharma',
    specialty: 'Numerology & Vastu',
    experience: '12+ Years',
    rating: 4.8,
    reviews: 890,
    status: 'online',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 3,
    name: 'Guru Ma Amrita',
    specialty: 'Tarot & Palmistry',
    experience: '20+ Years',
    rating: 5.0,
    reviews: 2150,
    status: 'busy',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 4,
    name: 'Pt. Rameshwar Lal',
    specialty: 'KP Astrology',
    experience: '18+ Years',
    rating: 4.9,
    reviews: 1120,
    status: 'online',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
  },
]

export default function AstrologerTeam() {
  return (
    <section className="teamSection">
      {/* Celestial Background Ornaments */}
      <div className="celestial-ornament ornament--top-right">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M50 2L55 45L98 50L55 55L50 98L45 55L2 50L45 45L50 2Z" fill="currentColor" fillOpacity="0.05" />
        </svg>
      </div>
      <div className="celestial-ornament ornament--bottom-left">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="teamContainer">
        <div className="teamHeader">
          <div className="teamEyebrowWrap">
            <span className="teamLine-short" />
            <span className="teamEyebrow">Our Panel of Experts</span>
            <span className="teamLine-short" />
          </div>
          <h2 className="teamTitle">Consult World-Class Astrologers</h2>
          <p className="teamSubtitle">Direct access to India's most profound celestial wisdom</p>
        </div>

        <div className="teamGrid">
          {TEAM.map((astro) => (
            <article key={astro.id} className="teamCard">
              <div className="teamImageWrap">
                <div className="teamImageInner">
                  <img src={astro.img} alt={astro.name} className="teamImage" loading="lazy" decoding="async" />
                </div>

                <div className="teamVerifiedBadge">
                  <span className="verifiedIcon">✦</span>
                </div>
              </div>

              <div className="teamInfo">
                <div className="teamRating">
                  <span className="ratingStars">{"✦".repeat(5)}</span>
                  <span className="ratingCount">({astro.reviews})</span>
                </div>
                <h3 className="teamName">{astro.name}</h3>
                <p className="teamSpecialty">{astro.specialty}</p>
                <div className="teamStats">
                  <span className="teamExp">{astro.experience} Exp.</span>
                </div>
                <button type="button" className="teamBtn">
                  <span>Consult Now</span>
                  <span className="btnSparkle">✦</span>
                </button>
              </div>
              <div className="teamCard-aura" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}