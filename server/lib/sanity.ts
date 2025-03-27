import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.SANITY_PROJECT_ID) {
  throw new Error('SANITY_PROJECT_ID environment variable is not set');
}

if (!process.env.SANITY_DATASET) {
  throw new Error('SANITY_DATASET environment variable is not set');
}

const config = {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-03-15'
};

// Create a single instance of the client
export const client = createClient(config);

// Only deduplicate concurrent requests, don't cache
const inFlightRequests = new Map();

const originalFetch = client.fetch.bind(client);
client.fetch = async (...args) => {
  const key = JSON.stringify(args);
  
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }
  
  const promise = originalFetch(...args).finally(() => {
    // Clean up immediately after request completes
    inFlightRequests.delete(key);
  });
  
  inFlightRequests.set(key, promise);
  return promise;
};

// Export a single queries object
export const queries = {
  getLetters: '*[_type == "loveLetter"]',
  getAlbums: '*[_type == "album"]',
  getGalleryItems: '*[_type == "galleryItem"]',
  getLandingPage: '*[_type == "landingPage"][0]',
  getAudioMessages: '*[_type == "audioMessage"]',
  getFeaturedItems: '*[_type == "galleryItem" && featured == true]',
};

// Remove duplicate function declarations and simplify exports
export const sanityAPI = {
  // Fetch love letters
  getLetters: async () => {
    try {
      return await client.fetch(queries.getLetters);
    } catch (error: any) {
      console.error('Error fetching love letters:', error);
      throw error;
    }
  },

  // Get single love letter by ID
  getLoveLetter: async (id: string) => {
    try {
      return await client.fetch(
        `*[_type == "loveLetter" && _id == $id][0]`,
        { id }
      );
    } catch (error: any) {
      console.error(`Error fetching love letter with ID ${id}:`, error);
      throw error;
    }
  },

  // Fetch albums
  getAlbums: async (options = {}) => {
    try {
      const identity = process.env.SANITY_USER_ID || '';
      const params = { identity, ...options };
      return await client.fetch(queries.getAlbums, params);
    } catch (error: any) {
      console.error('Error fetching albums:', error);
      throw error;
    }
  },

  // Get a single album by ID with all its items
  getAlbumWithItems: async (id: string) => {
    try {
      const album = await client.fetch(
        `*[_type == "album" && _id == $id][0] {
          ...,
          "items": *[_type == "galleryItem" && references($id)]
        }`,
        { id }
      );
      return album;
    } catch (error: any) {
      console.error(`Error fetching album with ID ${id}:`, error);
      throw error;
    }
  },

  // Fetch gallery items with filtering options
  getGalleryItems: async (options = {}) => {
    try {
      const identity = process.env.SANITY_USER_ID || '';
      const params = { identity, ...options };
      return await client.fetch(queries.getGalleryItems, params);
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      throw error;
    }
  },

  // Fetch gallery items by tag
  getGalleryItemsByTag: async (tag: string) => {
    try {
      return await client.fetch(
        `*[_type == "galleryItem" && $tag in tags] | order(date desc)`,
        { tag: tag }
      );
    } catch (error: any) {
      console.error(`Error fetching gallery items with tag ${tag}:`, error);
      throw error;
    }
  },

  // Fetch featured gallery items
  getFeaturedItems: async () => {
    try {
      return await client.fetch(queries.getFeaturedItems);
    } catch (error: any) {
      console.error('Error fetching featured items:', error);
      throw error;
    }
  },

  // Fetch landing page data
  getLandingData: async () => {
    try {
      return await client.fetch(queries.getLandingPage);
    } catch (error: any) {
      console.error('Error fetching landing data:', error);
      throw error;
    }
  },

  // Fetch audio messages with filtering capabilities
  getAudioMessages: async (options = {}) => {
    try {
      const params = { ...options };
      return await client.fetch(queries.getAudioMessages, params);
    } catch (error: any) {
      console.error('Error fetching audio messages:', error);
      throw error;
    }
  },

  // Get a single audio message by ID
  getAudioMessage: async (id: string) => {
    try {
      return await client.fetch(
        `*[_type == "audioMessage" && _id == $id][0]`,
        { id }
      );
    } catch (error: any) {
      console.error(`Error fetching audio message with ID ${id}:`, error);
      throw error;
    }
  },

  // Search across all content types
  searchContent: async (query: string) => {
    try {
      const searchQuery = `*[
        _type in ["loveLetter", "album", "galleryItem", "audioMessage"] &&
        (title match $searchQuery || description match $searchQuery)
      ] | order(_createdAt desc)`;
      
      return await client.fetch(searchQuery, { searchQuery: `*${query}*` });
    } catch (error: any) {
      console.error(`Error searching content with query "${query}":`, error);
      throw error;
    }
  },

  // Get recent content across all types
  getRecentContent: async (limit = 10) => {
    try {
      const query = `{
        "loveLetters": *[_type == "loveLetter"] | order(_createdAt desc)[0...${limit}],
        "albums": *[_type == "album"] | order(_createdAt desc)[0...${limit}],
        "galleryItems": *[_type == "galleryItem"] | order(date desc)[0...${limit}],
        "audioMessages": *[_type == "audioMessage"] | order(_createdAt desc)[0...${limit}]
      }`;
      
      return await client.fetch(query);
    } catch (error: any) {
      console.error('Error fetching recent content:', error);
      throw error;
    }
  },

  // Get birthday cards
  getBirthdayCards: async () => {
    try {
      return await client.fetch(`*[_type == "birthdayCard"] | order(_createdAt desc)`);
    } catch (error: any) {
      console.error('Error fetching birthday cards:', error);
      throw error;
    }
  }
};
