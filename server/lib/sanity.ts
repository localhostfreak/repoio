import { createClient } from '@sanity/client';
import {
  getLettersQuery,
  getAlbumsQuery,
  getGalleryItemsQuery,
  getLandingPageQuery,
  getAudioMessagesQuery,
  getFeaturedItemsQuery
} from '../../client/src/lib/sanity';
import { schemas } from './schema';
import {
  sampleLetters,
  sampleAlbums,
  sampleGalleryItems,
  sampleAudioMessages,
  sampleLandingPage,
  sampleBirthdayCards,
  generateSearchResults,
  generateRecentContent,
  getFeaturedGalleryItems,
  getItemById,
  getAlbumWithContents,
  getGalleryItemsByTag as getItemsByTag
} from './sample-data';

// Create a Sanity client for development/testing
const client = createClient({
  projectId: 'development',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

// Flag to control whether to use sample data or try Sanity connections
const USE_SAMPLE_DATA = true;

// Enhanced functions with better error handling and features

// Fetch love letters with additional capabilities
export async function getLetters() {
  if (USE_SAMPLE_DATA) {
    return sampleLetters;
  }
  
  try {
    return await client.fetch(getLettersQuery);
  } catch (error: any) {
    console.error('Error fetching love letters:', error);
    // Fallback to sample data on error
    return sampleLetters;
  }
}

// Get a single love letter by ID
export async function getLoveLetter(id: string) {
  if (USE_SAMPLE_DATA) {
    const letter = getItemById('loveLetter', id);
    return letter || null;
  }
  
  try {
    return await client.fetch(
      `*[_type == "loveLetter" && _id == $id][0]`,
      { id }
    );
  } catch (error: any) {
    console.error(`Error fetching love letter with ID ${id}:`, error);
    // Fallback to sample data on error
    return getItemById('loveLetter', id);
  }
}

// Fetch albums with filter capabilities
export async function getAlbums(options = {}) {
  if (USE_SAMPLE_DATA) {
    return sampleAlbums;
  }
  
  try {
    const identity = process.env.SANITY_USER_ID || '';
    const params = { identity, ...options };
    return await client.fetch(getAlbumsQuery, params);
  } catch (error: any) {
    console.error('Error fetching albums:', error);
    // Fallback to sample data on error
    return sampleAlbums;
  }
}

// Get a single album by ID with all its items
export async function getAlbumWithItems(id: string) {
  if (USE_SAMPLE_DATA) {
    return getAlbumWithContents(id);
  }
  
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
    // Fallback to sample data on error
    return getAlbumWithContents(id);
  }
}

// Fetch gallery items with filtering options
export async function getGalleryItems(options = {}) {
  if (USE_SAMPLE_DATA) {
    return sampleGalleryItems;
  }
  
  try {
    const identity = process.env.SANITY_USER_ID || '';
    const params = { identity, ...options };
    return await client.fetch(getGalleryItemsQuery, params);
  } catch (error: any) {
    console.error('Error fetching gallery items:', error);
    // Fallback to sample data on error
    return sampleGalleryItems;
  }
}

// Fetch gallery items by tag
export async function getGalleryItemsByTag(tag: string) {
  if (USE_SAMPLE_DATA) {
    return getItemsByTag(tag);
  }
  
  try {
    return await client.fetch(
      `*[_type == "galleryItem" && $tag in tags] | order(date desc)`,
      { tag }
    );
  } catch (error: any) {
    console.error(`Error fetching gallery items with tag ${tag}:`, error);
    // Fallback to sample data on error
    return getItemsByTag(tag);
  }
}

// Fetch featured gallery items
export async function getFeaturedItems() {
  if (USE_SAMPLE_DATA) {
    return getFeaturedGalleryItems();
  }
  
  try {
    return await client.fetch(getFeaturedItemsQuery);
  } catch (error: any) {
    console.error('Error fetching featured items:', error);
    // Fallback to sample data on error
    return getFeaturedGalleryItems();
  }
}

// Fetch landing page data
export async function getLandingData() {
  if (USE_SAMPLE_DATA) {
    return sampleLandingPage;
  }
  
  try {
    return await client.fetch(getLandingPageQuery);
  } catch (error: any) {
    console.error('Error fetching landing data:', error);
    // Fallback to sample data on error
    return sampleLandingPage;
  }
}

// Fetch audio messages with filtering capabilities
export async function getAudioMessages(options = {}) {
  if (USE_SAMPLE_DATA) {
    return sampleAudioMessages;
  }
  
  try {
    const params = { ...options };
    return await client.fetch(getAudioMessagesQuery, params);
  } catch (error: any) {
    console.error('Error fetching audio messages:', error);
    // Fallback to sample data on error
    return sampleAudioMessages;
  }
}

// Get a single audio message by ID
export async function getAudioMessage(id: string) {
  if (USE_SAMPLE_DATA) {
    const message = getItemById('audioMessage', id);
    return message || null;
  }
  
  try {
    return await client.fetch(
      `*[_type == "audioMessage" && _id == $id][0]`,
      { id }
    );
  } catch (error: any) {
    console.error(`Error fetching audio message with ID ${id}:`, error);
    // Fallback to sample data on error
    return getItemById('audioMessage', id);
  }
}

// Search across all content types
export async function searchContent(query: string) {
  if (USE_SAMPLE_DATA) {
    return generateSearchResults(query);
  }
  
  try {
    const searchQuery = `*[
      _type in ["loveLetter", "album", "galleryItem", "audioMessage"] &&
      (title match $query || description match $query)
    ] | order(_createdAt desc)`;
    
    return await client.fetch(searchQuery, { query: `*${query}*` });
  } catch (error: any) {
    console.error(`Error searching content with query "${query}":`, error);
    // Fallback to sample data on error
    return generateSearchResults(query);
  }
}

// Get recent content across all types
export async function getRecentContent(limit = 10) {
  if (USE_SAMPLE_DATA) {
    return generateRecentContent(limit);
  }
  
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
    // Fallback to sample data on error
    return generateRecentContent(limit);
  }
}

// Get birthday cards
export async function getBirthdayCards() {
  if (USE_SAMPLE_DATA) {
    return sampleBirthdayCards;
  }
  
  try {
    return await client.fetch(`*[_type == "birthdayCard"] | order(_createdAt desc)`);
  } catch (error: any) {
    console.error('Error fetching birthday cards:', error);
    // Fallback to sample data on error
    return sampleBirthdayCards;
  }
}
