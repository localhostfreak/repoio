import { createClient } from '@sanity/client';
import {
  getLettersQuery,
  getAlbumsQuery,
  getGalleryItemsQuery,
  getLandingPageQuery,
  getAudioMessagesQuery,
  getFeaturedItemsQuery
} from '../../client/src/lib/sanity';

// Create a Sanity client with demo values
const client = createClient({
  projectId: 'demo-project',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

// Mock data for development
const mockData = {
  letters: [
    {
      _id: "letter1",
      title: "To My Beloved",
      content: "The distance between us seems vast, yet in my heart you are always near. Every morning I wake up thinking of your smile, and each night I fall asleep wrapped in memories of your embrace.",
      createdAt: "2025-03-01T12:00:00Z"
    },
    {
      _id: "letter2",
      title: "My Dearest",
      content: "Do you remember our first date? The way the stars seemed to shine just for us that night? I was so nervous, yet the moment I saw you, all my worries melted away.",
      createdAt: "2025-02-14T12:00:00Z"
    }
  ],
  albums: [
    {
      _id: "album1",
      title: "First Date",
      description: "That magical evening when we first met. The cafe, the unexpected rain, and the beginning of our journey together.",
      coverImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      itemsCount: 12,
      _createdAt: "2022-04-15T12:00:00Z",
      isPrivate: false
    },
    {
      _id: "album2",
      title: "Our Vacation",
      description: "Two weeks of pure bliss exploring the coastline, watching sunsets, and falling even deeper in love.",
      coverImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      itemsCount: 24,
      _createdAt: "2022-07-12T12:00:00Z",
      isPrivate: false
    },
    {
      _id: "album3",
      title: "Anniversary",
      description: "Celebrating one year of us with a surprise dinner, dancing under the stars, and promises for the future.",
      coverImage: "https://images.unsplash.com/photo-1522673607200-164d1b3ce551?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      itemsCount: 18,
      _createdAt: "2023-04-15T12:00:00Z",
      isPrivate: false
    }
  ],
  galleryItems: [
    {
      _id: "item1",
      title: "Sunset Beach Walk",
      mediaUrl: "https://images.unsplash.com/photo-1530653333484-8e3c89cd2f45?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1530653333484-8e3c89cd2f45?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      date: "2023-06-15T19:00:00Z",
      mediaType: "image",
      isFavorite: true,
      reactions: [{ emoji: "❤️", count: 12 }],
      views: 45,
      isPrivate: false
    },
    {
      _id: "item2",
      title: "Coffee Shop Date",
      mediaUrl: "https://images.unsplash.com/photo-1518911710364-17ec553bde5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1518911710364-17ec553bde5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      date: "2023-01-20T10:00:00Z",
      mediaType: "image",
      isFavorite: true,
      reactions: [{ emoji: "☕", count: 8 }],
      views: 32,
      isPrivate: false
    },
    {
      _id: "item3",
      title: "Picnic in the Park",
      mediaUrl: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      date: "2022-05-10T12:30:00Z",
      mediaType: "image",
      isFavorite: true,
      reactions: [{ emoji: "🌳", count: 15 }],
      views: 38,
      isPrivate: false
    },
    {
      _id: "item4",
      title: "Stargazing Night",
      mediaUrl: "https://images.unsplash.com/photo-1593239782798-5027b7623c59?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1593239782798-5027b7623c59?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      date: "2023-08-05T22:00:00Z",
      mediaType: "image",
      isFavorite: true,
      reactions: [{ emoji: "✨", count: 21 }],
      views: 54,
      isPrivate: false
    }
  ],
  audioMessages: [
    {
      _id: "audio1",
      title: "Good Morning Sunshine",
      description: "Starting your day with a little reminder of how much you mean to me. Listen to this whenever you miss the sound of my voice.",
      audioUrl: "",
      duration: 102,
      _createdAt: "2025-03-10T08:00:00Z"
    },
    {
      _id: "audio2",
      title: "Missing You Tonight",
      description: "The stars are out, and I'm thinking of you. Just wanted to share how my day went and hear about yours soon.",
      audioUrl: "",
      duration: 138,
      _createdAt: "2025-03-05T22:30:00Z"
    }
  ],
  landing: {
    title: "Every Moment With You",
    message: "A digital space where our love story unfolds, capturing our most cherished moments and heartfelt expressions."
  }
};

// Fetch love letters
export async function getLetters() {
  try {
    // For development, return mock data instead of fetching from Sanity
    return mockData.letters;
    // In production, would use the line below:
    // return await client.fetch(getLettersQuery);
  } catch (error) {
    console.error('Error fetching love letters:', error);
    return [];
  }
}

// Fetch albums
export async function getAlbums() {
  try {
    // For development, return mock data instead of fetching from Sanity
    return mockData.albums;
    // In production, would use the lines below:
    // const identity = process.env.SANITY_USER_ID || '';
    // return await client.fetch(getAlbumsQuery, { identity });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

// Fetch gallery items
export async function getGalleryItems() {
  try {
    // For development, return mock data instead of fetching from Sanity
    return mockData.galleryItems;
    // In production, would use the lines below:
    // const identity = process.env.SANITY_USER_ID || '';
    // return await client.fetch(getGalleryItemsQuery, { identity });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }
}

// Fetch featured gallery items
export async function getFeaturedItems() {
  try {
    // For development, return mock data instead of fetching from Sanity
    return mockData.galleryItems.filter(item => item.isFavorite);
    // In production, would use the line below:
    // return await client.fetch(getFeaturedItemsQuery);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    return [];
  }
}

// Fetch landing page data
export async function getLandingData() {
  try {
    // For development, return mock data instead of fetching from Sanity
    return mockData.landing;
    // In production, would use the line below:
    // return await client.fetch(getLandingPageQuery);
  } catch (error) {
    console.error('Error fetching landing data:', error);
    return { title: '', message: '' };
  }
}

// Fetch audio messages
export async function getAudioMessages() {
  try {
    // For development, return mock data instead of fetching from Sanity
    return mockData.audioMessages;
    // In production, would use the line below:
    // return await client.fetch(getAudioMessagesQuery);
  } catch (error) {
    console.error('Error fetching audio messages:', error);
    return [];
  }
}
