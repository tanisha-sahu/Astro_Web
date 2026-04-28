import { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader/SectionHeader'
import { blogService } from '../services'
import { Link } from 'react-router-dom'
import { Calendar, Tag, BookOpen, ArrowRight } from 'lucide-react'
import BlogSkeleton from '../components/BlogSkeleton/BlogSkeleton'
import './BlogsPage.css'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setLoading(true)
        setBlogs([]) // Reset blogs

        // Artificial delay for visual consistency
        await new Promise(resolve => setTimeout(resolve, 600));

        const data = await blogService.fetchBlogs();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load spiritual chronicles. Please try again later.');
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  if (loading) return <BlogSkeleton />;

  return (
    <div className="blogs-page">
      <div className="divine-container">
        <SectionHeader 
          title="Vedic Wisdom" 
          subtitle="Explore the profound teachings of ancient scriptures"
        />

        {error ? (
          <div className="blogs-error">
            <p>{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="blogs-empty">
            <BookOpen size={48} />
            <p>No chronicles have been shared yet. Check back soon for divine wisdom.</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog, index) => (
              <article 
                key={blog._id} 
                id={`blog-${blog.slug}`}
                className="blog-card"
                style={{ '--i': index }}
              >
                <div className="blog-card__media">
                  <img src={blog.image} alt={blog.title} className="blog-card__img" />
                  <span className="blog-card__category">
                    <Tag size={12} style={{ marginRight: '4px' }} />
                    {blog.category}
                  </span>
                </div>
                
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span className="blog-card__date">
                      <Calendar size={14} style={{ marginRight: '6px' }} />
                      {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <h2 className="blog-card__title">{blog.title}</h2>
                  <p className="blog-card__excerpt">{blog.excerpt}</p>
                  
                  <Link to={`/blog/${blog.slug}`} className="blog-card__link">
                    Read Chronicle <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
