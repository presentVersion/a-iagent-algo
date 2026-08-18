import { Reel } from '../../types';
import { DEMO_REELS } from '../../data/demoReels';
import { FeedContentMode } from '../recommendationConfig';

export interface ContentProvider {
  id: string;
  name: string;
  getFeed(mode?: FeedContentMode): Promise<Reel[]>;
  search(query: string): Promise<Reel[]>;
  getById(id: string): Promise<Reel | null>;
}

/**
 * DemoProvider serves local database records of 28+ simulated reels.
 * Handles the Mode separation: Live, Curated, and Trap Simulation.
 */
export class DemoProvider implements ContentProvider {
  id = 'demo';
  name = 'ScrollIQ Content Framework';
  private library: Reel[];

  constructor(customReels?: Reel[]) {
    this.library = customReels || DEMO_REELS;
  }

  async getFeed(mode?: FeedContentMode): Promise<Reel[]> {
    if (!mode) return [...this.library];

    if (mode === 'live') {
      // Live content feeds: Coding memes, gaming, and lifestyle vlogs
      return this.library.filter(r => 
        r.category === 'Coding Meme' || 
        r.category === 'SWE Lifestyle' || 
        r.category === 'Hardware' || 
        r.category === 'Gaming'
      );
    }

    if (mode === 'curated') {
      // Curated tech tutorials: DSA, AI/ML, Cloud systems, Cybersecurity
      return this.library.filter(r => 
        r.category === 'DSA' || 
        r.category === 'AI / ML' || 
        r.category === 'Cloud' || 
        r.category === 'Cybersecurity' || 
        r.category === 'Career'
      );
    }

    if (mode === 'demo') {
      // Explicit 4 reels sequence for the Software Engineering latent interest trap test
      const trapIds = ['reel-1', 'reel-6', 'reel-2', 'reel-18'];
      return trapIds.map(id => this.library.find(r => r.id === id)).filter(Boolean) as Reel[];
    }

    return [...this.library];
  }

  async search(query: string): Promise<Reel[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [...this.library];
    
    return this.library.filter(reel => {
      return (
        reel.title.toLowerCase().includes(q) ||
        reel.description.toLowerCase().includes(q) ||
        reel.category.toLowerCase().includes(q) ||
        reel.topic.toLowerCase().includes(q) ||
        reel.subtopics.some(s => s.toLowerCase().includes(q))
      );
    });
  }

  async getById(id: string): Promise<Reel | null> {
    return this.library.find(r => r.id === id) || null;
  }

  setLibrary(newLibrary: Reel[]) {
    this.library = newLibrary;
  }
}

/**
 * YouTubeProvider integrates with Google YouTube API.
 * Currently disabled unless API key is set up.
 */
export class YouTubeProvider implements ContentProvider {
  id = 'youtube';
  name = 'YouTube Shorts API';

  async getFeed(_mode?: FeedContentMode): Promise<Reel[]> {
    // Disabled by default for demo compliance
    return [];
  }

  async search(_query: string): Promise<Reel[]> {
    return [];
  }

  async getById(_id: string): Promise<Reel | null> {
    return null;
  }
}

/**
 * InstagramProvider integrates with Meta Graph API.
 */
export class InstagramProvider implements ContentProvider {
  id = 'instagram';
  name = 'Instagram Graph API';

  async getFeed(_mode?: FeedContentMode): Promise<Reel[]> {
    return [];
  }

  async search(_query: string): Promise<Reel[]> {
    return [];
  }

  async getById(_id: string): Promise<Reel | null> {
    return null;
  }
}

/**
 * TikTokProvider integrates with TikTok Content API.
 */
export class TikTokProvider implements ContentProvider {
  id = 'tiktok';
  name = 'TikTok Display API';

  async getFeed(_mode?: FeedContentMode): Promise<Reel[]> {
    return [];
  }

  async search(_query: string): Promise<Reel[]> {
    return [];
  }

  async getById(_id: string): Promise<Reel | null> {
    return null;
  }
}
