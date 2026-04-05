import axios from 'axios';
import * as cheerio from 'cheerio';


export const scrapeArticle = async (url: string): Promise<string> => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PodcastForge/1.0)',
      },
      timeout: 15000,
    });
    const $ = cheerio.load(data);

    // Remove scripts, styles, nav, footer, ads
    $('script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar').remove();

    // Extract title
    const title =
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      'Article';

    // Extract main content - try article first, then main, then body
    let content = '';
    const selectors = ['article', 'main', '.post-content', '.article-body', '.content', 'body'];
    for (const sel of selectors) {
      const text = $(sel).find('p').map((_, el) => $(el).text().trim()).get().join(' ');
      if (text.length > 200) {
        content = text;
        break;
      }
    }

    if (!content) {
      content = $('p').map((_, el) => $(el).text().trim()).get().join(' ');
    }

    // Limit to ~3000 chars for TTS
    const trimmed = content.slice(0, 3000).trim();
    return `${title}. ${trimmed}`;
  } catch (err: any) {
    throw new Error(`Failed to scrape URL: ${err.message}`);
  }
};

export const extractTitle = (text: string): string => {
  const firstSentence = text.split(/[.!?]/)[0];
  return firstSentence.slice(0, 60).trim() || 'My Podcast';
};
