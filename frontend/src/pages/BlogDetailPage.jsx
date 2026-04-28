import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { blogService } from '../services'
import { Calendar, Tag, User, Link2, ArrowRight } from 'lucide-react'
import BlogDetailSkeleton from '../components/BlogDetailSkeleton/BlogDetailSkeleton'
import './BlogDetailPage.css'

export default function BlogDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let isMounted = true
    async function loadBlogData() {
      try {
        setLoading(true)
        window.scrollTo(0, 0)

        // Fetch current blog
        const data = await blogService.fetchBlogByIdOrSlug(id)
        if (!isMounted) return
        setBlog(data)

        // Fetch recent blogs for the sidebar/bottom
        const allBlogs = await blogService.fetchBlogs()
        if (!isMounted) return
        setRecentBlogs(allBlogs.filter(b => b.id !== data.id).slice(0, 3))
        
        // Update SEO Tags
        document.title = `${data.title} | Astro Sanatani Vedic Wisdom`
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) {
          metaDesc.setAttribute('content', data.excerpt || data.title)
        } else {
          const meta = document.createElement('meta')
          meta.name = 'description'
          meta.content = data.excerpt || data.title
          document.head.appendChild(meta)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading blog:', err)
        if (isMounted) {
          setError('The sacred chronicle you seek could not be found.')
          setLoading(false)
        }
      }
    }
    loadBlogData()
    return () => { isMounted = false }
  }, [id])



  if (loading) {
    return <BlogDetailSkeleton />
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-error">
        <div className="divine-container">
          <div className="error-content">
            <h1>Chronicle Not Found</h1>
            <p>{error || 'This spiritual teaching is currently unavailable.'}</p>
            <Link to="/blogs" className="btn-back-blogs">
              Return to Library
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-detail-page">
      {/* Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${scrolled ? '100%' : '0%'}` }}></div>

      <div className="blog-content-layout">
        <div className="divine-container">
          {/* Split Hero Section */}
          <section className="blog-hero-split">
            <div className="blog-split-image">
              <img src={blog.image} alt={blog.title} />
            </div>
            
            <div className="blog-split-info">
              <div className="blog-meta-top">
                <span className="blog-cat-badge">{blog.category}</span>
              </div>
              <h1 className="blog-title-main-split">{blog.title}</h1>
              
              <div className="blog-author-strip-split">
                <div className="author-avatar-split">
                  {blog.author?.avatar ? (
                    <img src={blog.author.avatar} alt={blog.authorName} />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div className="author-info-split">
                  <span className="author-name-split">By {blog.authorName}</span>
                  <span className="blog-publish-date-split">
                    <Calendar size={12} />
                    {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="blog-brief-summary">
                {blog.excerpt && <p>{blog.excerpt}</p>}
              </div>
            </div>
          </section>

          <div className="blog-main-grid">


            {/* Main Content Area */}
            <article className="blog-article-body">
              <div 
                className="blog-rich-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="blog-tags-footer">
                  <span className="tags-label"><Tag size={14} /> TAGS:</span>
                  <div className="tags-list">
                    {blog.tags.map(tag => (
                      <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                </div>
              )}


            </article>

            {/* Sidebar Right: Related/Recent */}
            <aside className="blog-sidebar-right">

              <div className="sidebar-widget promo-widget">
                <div className="promo-card">
                  <h3>Seek Celestial Guidance</h3>
                  <p>Book a personal consultation with our expert astrologers.</p>
                  <Link to="/astro-consultation" className="btn-promo">
                    Explore Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Recommended Section (Full Width Bottom) */}
      <section className="blog-recommended-full">
        <div className="divine-container">
          <div className="section-header-compact">
            <h2>Continue Your Journey</h2>
            <Link to="/blogs">View All Wisdom <ArrowRight size={16} /></Link>
          </div>
          <div className="recommended-grid">
            {recentBlogs.slice(0, 3).map((rb, i) => (
              <Link key={rb.id} to={`/blog/${rb.id}`} className="rec-card" style={{ '--i': i }}>
                <div className="rec-img">
                  <img src={rb.image} alt={rb.title} />
                </div>
                <div className="rec-body">
                  <span className="rec-cat">{rb.category}</span>
                  <h3>{rb.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
