import React, { useEffect } from 'react';
import './BlogsPage.css';
import SectionHeader from '../components/SectionHeader';

const BLOG_DATA = [
  {
    id: 1,
    title: "Chiranjeevi: The Sacred Art of Immortality",
    excerpt: "Explore the ancient Vedic teachings on the eight immortals and the spiritual practices that transcend the cycle of time.",
    category: "Vedas",
    date: "Aswina 2, 2026",
    readingTime: "8 min read",
    image: "/blogs/chiranjeevi.png",
    author: "Acharya Sanatani"
  },
  {
    id: 2,
    title: "Jyotish: Predict the Unseen Destiny",
    excerpt: "The celestial dance of planets holds the blueprint of your future. Discover how Jyotish acts as a bridge between the stars and your soul.",
    category: "Jyotish",
    date: "Phalguna 23, 2026",
    readingTime: "12 min read",
    image: "/blogs/jyotish.png",
    author: "Shri Ashok Ji"
  },
  {
    id: 3,
    title: "Mahadev's Procession: Shiv Baraat Part II",
    excerpt: "A deep dive into the mystical symbolism of Lord Shiva's divine marriage and its profound meaning for spiritual seekers today.",
    category: "Mythology",
    date: "Magha 20, 2026",
    readingTime: "15 min read",
    image: "/blogs/shiv_baraat.png",
    author: "Acharya Sanatani"
  },
  {
    id: 4,
    title: "Why Does the Divine Call You?",
    excerpt: "In the silence of the soul, a calling resonates. Learn to recognize the subtle signs of spiritual awakening and the invitation of the absolute.",
    category: "Spirituality",
    date: "Magha 11, 2026",
    readingTime: "6 min read",
    image: "https://images.unsplash.com/photo-1545670723-196ed0954986?q=80&w=1500&auto=format&fit=crop",
    author: "Guru Dev"
  },
  {
    id: 5,
    title: "Ram Mandir: The King's Sacred Return",
    excerpt: "A historic chronicle of Prabhu Shri Ram's return to Ayodhya and the architectural and spiritual revival of a civilization.",
    category: "Chronicles",
    date: "Pausha 22, 2026",
    readingTime: "10 min read",
    image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=1500&auto=format&fit=crop",
    author: "Acharya Sanatani"
  }
];

const BlogsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blogs-page">
      {/* Cinematic Hero Section */}
      <section className="blogs-hero">
        <div className="blogs-hero__overlay"></div>
        <div className="blogs-hero__content">
          <SectionHeader 
            title="Divine Chronicles" 
            subtitle="The Sacred Wisdom Blog"
            light={true}
          />
          <p className="blogs-hero__text">
            Explore the depths of ancient Vedic wisdom, celestial insights, 
            and the timeless teachings of Sanatana Dharma.
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="blogs-container">
        <div className="blogs-grid">
          {BLOG_DATA.map((blog, index) => (
            <article 
              key={blog.id} 
              className="blog-card"
              style={{ '--i': index }}
            >
              <div className="blog-card__media">
                <img src={blog.image} alt={blog.title} className="blog-card__img" />
                <span className="blog-card__category">{blog.category}</span>
              </div>
              
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span className="blog-card__date">{blog.date}</span>
                  <span className="blog-card__dot">•</span>
                  <span className="blog-card__time">{blog.readingTime}</span>
                </div>
                
                <h2 className="blog-card__title">{blog.title}</h2>
                <p className="blog-card__excerpt">{blog.excerpt}</p>
                
                <div className="blog-card__footer">
                  <div className="blog-card__author">
                    <div className="blog-card__avatar">
                      {blog.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="blog-card__author-name">{blog.author}</span>
                  </div>
                  <a href={`#blog-${blog.id}`} className="blog-card__read">
                    Read Story <span>→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogsPage;
