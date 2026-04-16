import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../utils/api.js'

export function NewsCarousel({ topic, title, subtitle }) {
  const { token } = useAuth()
  const [articles, setArticles] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadNews() {
      setLoading(true)
      setError('')
      setActiveIndex(0)

      try {
        const data = await apiRequest(`/news/${topic}`, { token })
        if (!cancelled) setArticles(data.articles || [])
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load news right now.')
          setArticles([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (token) loadNews()

    return () => {
      cancelled = true
    }
  }, [topic, token])

  useEffect(() => {
    if (articles.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % articles.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [articles.length])

  const activeArticle = articles[activeIndex]
  const formattedDate = useMemo(() => {
    if (!activeArticle?.publishedAt) return ''
    return new Date(activeArticle.publishedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [activeArticle?.publishedAt])

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? articles.length - 1 : current - 1,
    )
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % articles.length)
  }

  return (
    <section className="news-carousel card" aria-label={title}>
      <div className="news-carousel__header">
        <div>
          <p className="news-carousel__eyebrow">Top News</p>
          <h3 className="news-carousel__title">{title}</h3>
          {subtitle ? <p className="news-carousel__subtitle">{subtitle}</p> : null}
        </div>
      </div>

      {loading ? (
        <div className="news-carousel__empty">
          <p className="muted">Loading latest news...</p>
        </div>
      ) : error ? (
        <div className="news-carousel__empty">
          <p className="form__error">{error}</p>
        </div>
      ) : activeArticle ? (
        <>
          <article className="news-carousel__article">
            <img
              className="news-carousel__image"
              src={activeArticle.imageUrl}
              alt=""
              loading="lazy"
            />
            <div className="news-carousel__body">
              <div className="news-carousel__meta">
                <span>{activeArticle.source}</span>
                {formattedDate ? <span>{formattedDate}</span> : null}
              </div>
              <h4>{activeArticle.title}</h4>
              <p>{activeArticle.description}</p>
              {activeArticle.url ? (
                <a
                  href={activeArticle.url}
                  target="_blank"
                  rel="noreferrer"
                  className="news-carousel__link"
                >
                  Read full story
                </a>
              ) : null}
            </div>
          </article>

          {articles.length > 1 ? (
            <div className="news-carousel__controls">
              <button type="button" onClick={showPrevious}>
                Previous
              </button>
              <div className="news-carousel__dots" aria-label="News slides">
                {articles.map((article, index) => (
                  <button
                    key={`${article.title}-${index}`}
                    type="button"
                    className={
                      index === activeIndex
                        ? 'news-carousel__dot news-carousel__dot--active'
                        : 'news-carousel__dot'
                    }
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show news item ${index + 1}`}
                  />
                ))}
              </div>
              <button type="button" onClick={showNext}>
                Next
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="news-carousel__empty">
          <p className="muted">No news available right now.</p>
        </div>
      )}
    </section>
  )
}
