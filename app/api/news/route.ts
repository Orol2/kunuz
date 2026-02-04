import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Types for news articles
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  articleUrl: string;
  publishDate: string;
}

// Cache for news articles (simple in-memory cache)
let cachedNews: NewsArticle[] | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Scrapes news articles from kun.uz
 */
async function scrapeKunuzNews(): Promise<NewsArticle[]> {
  try {
    // Respect rate limiting - check cache first
    if (cachedNews && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      return cachedNews;
    }

    // Fetch the main page
    const response = await axios.get('https://kun.uz/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const articles: NewsArticle[] = [];

    // Scrape news articles from the main page
    // Looking for article containers - kun.uz typically uses specific classes
    $('.daily-list__item, .news-item, article').each((index, element) => {
      if (articles.length >= 12) return false; // Limit to 12 articles

      const $element = $(element);
      
      // Extract title
      const titleElement = $element.find('h3, h2, .title, .news-title, a[class*="title"]').first();
      const title = titleElement.text().trim();
      
      // Extract link
      let articleUrl = $element.find('a').first().attr('href') || '';
      if (articleUrl && !articleUrl.startsWith('http')) {
        articleUrl = `https://kun.uz${articleUrl}`;
      }
      
      // Extract image
      let imageUrl = $element.find('img').first().attr('src') || 
                     $element.find('img').first().attr('data-src') || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://kun.uz${imageUrl}`;
      }
      
      // Extract summary/description
      const summary = $element.find('p, .description, .excerpt, .news-desc').first().text().trim() ||
                     $element.find('.text').first().text().trim() ||
                     title.substring(0, 150) + '...';
      
      // Extract or generate date
      let publishDate = $element.find('time, .date, .published, [class*="date"]').first().text().trim();
      if (!publishDate) {
        publishDate = new Date().toISOString();
      }

      // Only add if we have at least a title and URL
      if (title && articleUrl) {
        articles.push({
          id: `${Date.now()}-${index}`,
          title,
          summary: summary || 'No description available',
          imageUrl: imageUrl || 'https://placehold.co/600x400?text=Kun.uz+News',
          articleUrl,
          publishDate,
        });
      }
    });

    // If we didn't find articles with the above selectors, try a more generic approach
    if (articles.length === 0) {
      $('a[href*="/news/"], a[href*="/article/"]').each((index, element) => {
        if (articles.length >= 12) return false;

        const $link = $(element);
        const title = $link.find('h3, h2, h4').text().trim() || $link.text().trim();
        let articleUrl = $link.attr('href') || '';
        
        if (articleUrl && !articleUrl.startsWith('http')) {
          articleUrl = `https://kun.uz${articleUrl}`;
        }

        if (title && articleUrl && title.length > 10) {
          const $parent = $link.parent().parent();
          let imageUrl = $parent.find('img').first().attr('src') || 
                        $parent.find('img').first().attr('data-src') || '';
          
          if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = `https://kun.uz${imageUrl}`;
          }

          articles.push({
            id: `${Date.now()}-${index}`,
            title,
            summary: 'Click to read more...',
            imageUrl: imageUrl || 'https://placehold.co/600x400?text=Kun.uz+News',
            articleUrl,
            publishDate: new Date().toISOString(),
          });
        }
      });
    }

    // Cache the results
    cachedNews = articles;
    cacheTime = Date.now();

    return articles;
  } catch (error) {
    console.error('Error scraping kun.uz:', error);
    throw new Error('Failed to fetch news from kun.uz');
  }
}

/**
 * GET /api/news - Fetch latest news articles
 */
export async function GET(request: NextRequest) {
  try {
    const articles = await scrapeKunuzNews();
    
    return NextResponse.json({
      success: true,
      data: articles,
      count: articles.length,
      cachedAt: cacheTime ? new Date(cacheTime).toISOString() : null,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news articles',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
