'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { NewsArticle } from './api/news/route';

// Loading skeleton component
function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// News card component
function NewsCard({ article }: { article: NewsArticle }) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <a href={article.articleUrl} target="_blank" rel="noopener noreferrer">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x400?text=Kun.uz+News';
            }}
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 hover:text-primary-600 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {article.summary}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{formatDate(article.publishDate)}</span>
            <span className="text-primary-600 text-sm font-semibold hover:text-primary-700">
              Read more →
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}

// Main page component
export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/news');
      const data = await response.json();

      if (data.success) {
        setArticles(data.data);
      } else {
        setError(data.error || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Failed to connect to the server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-700">Kun.uz News</h1>
              <p className="text-gray-600 text-sm mt-1">Latest news from Uzbekistan</p>
            </div>
            <button
              onClick={fetchNews}
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchNews}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No news articles found</p>
            <button
              onClick={fetchNews}
              className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
            >
              Refresh to try again
            </button>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>News scraper for kun.uz - Built with Next.js 14</p>
            <p className="mt-2">
              Visit{' '}
              <a
                href="https://kun.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                kun.uz
              </a>{' '}
              for the original content
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
