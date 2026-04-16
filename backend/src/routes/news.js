const express = require('express');

const { getConfig } = require('../config/env');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

const fallbackImages = {
  budget:
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  tax:
    'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=900&q=80',
}

const fallbackNews = {
  budget: [
    {
      title: 'Budget planning checklist for better monthly control',
      description:
        'Review income, fixed costs, flexible spending, emergency savings, and category limits before setting next month’s budget.',
      imageUrl: fallbackImages.budget,
      source: 'Financial Advisor',
      publishedAt: new Date().toISOString(),
      url: '/budget',
    },
    {
      title: 'How to spot overspending before it affects savings',
      description:
        'Track category-wise expenses weekly and compare them with monthly limits to catch budget leaks early.',
      imageUrl:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
      source: 'Financial Advisor',
      publishedAt: new Date().toISOString(),
      url: '/reports',
    },
    {
      title: 'Simple finance habits that support long-term goals',
      description:
        'Automated savings, regular expense reviews, and realistic category caps can make budgeting easier to sustain.',
      imageUrl:
        'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80',
      source: 'Financial Advisor',
      publishedAt: new Date().toISOString(),
      url: '/dashboard',
    },
  ],
  tax: [
    {
      title: 'ITR filing preparation checklist for individuals',
      description:
        'Keep Form 16, AIS, Form 26AS, bank interest details, rent proof, and deduction documents ready before filing.',
      imageUrl: fallbackImages.tax,
      source: 'Financial Advisor',
      publishedAt: new Date().toISOString(),
      url: '/itr',
    },
    {
      title: 'Common ITR form selection basics',
      description:
        'Salary-only taxpayers often review ITR-1, while capital gains, multiple properties, or business income may need other forms.',
      imageUrl:
        'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=900&q=80',
      source: 'Financial Advisor',
      publishedAt: new Date().toISOString(),
      url: '/itr',
    },
    {
      title: 'Tax deduction records worth organizing early',
      description:
        'Organize 80C, 80D, home loan, education loan, and donation documents before the filing deadline.',
      imageUrl:
        'https://images.unsplash.com/photo-1554224154-173a9c6e76a2?auto=format&fit=crop&w=900&q=80',
      source: 'Financial Advisor',
      publishedAt: new Date().toISOString(),
      url: '/itr',
    },
  ],
}

const topicConfig = {
  budget: {
    endpoint: 'everything',
    params: {
      q: '(finance OR budget OR economy OR "personal finance" OR savings OR RBI) AND India',
      language: 'en',
      sortBy: 'publishedAt',
    },
  },
  tax: {
    endpoint: 'everything',
    params: {
      q: '(tax OR taxation OR ITR OR "income tax return" OR deductions) AND India',
      language: 'en',
      sortBy: 'publishedAt',
    },
  },
}

function normalizeArticle(article, topic) {
  return {
    title: article.title || 'Finance update',
    description: article.description || article.content || 'Read the latest update.',
    imageUrl: article.urlToImage || fallbackImages[topic],
    source: article.source?.name || 'News',
    publishedAt: article.publishedAt || new Date().toISOString(),
    url: article.url,
  }
}

async function fetchLiveNews(topic) {
  const config = getConfig()
  if (!config.newsApiKey) return null

  const topicSettings = topicConfig[topic]
  const params = new URLSearchParams({
    ...topicSettings.params,
    pageSize: '8',
    apiKey: config.newsApiKey,
  })

  const response = await fetch(
    `https://newsapi.org/v2/${topicSettings.endpoint}?${params}`,
  )
  if (!response.ok) {
    throw new Error(`NewsAPI request failed with status ${response.status}`)
  }

  const data = await response.json()
  const articles = Array.isArray(data.articles) ? data.articles : []

  return articles
    .filter((article) => article.title && article.url)
    .slice(0, 6)
    .map((article) => normalizeArticle(article, topic))
}

router.get('/:topic', async (req, res) => {
  const topic = String(req.params.topic || '').toLowerCase()
  if (!topicConfig[topic]) {
    return res.status(400).json({ error: 'Unknown news topic' })
  }

  try {
    const liveNews = await fetchLiveNews(topic)
    const articles = liveNews?.length ? liveNews : fallbackNews[topic]

    return res.json({
      topic,
      source: liveNews?.length ? 'newsapi' : 'fallback',
      articles,
    })
  } catch (error) {
    console.error('News route failed, returning fallback news.', error)
    return res.json({
      topic,
      source: 'fallback',
      articles: fallbackNews[topic],
    })
  }
})

module.exports = router
