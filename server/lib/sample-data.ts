// Sample data to use when Sanity connection is not available
// This is for development purposes only

import { 
  Album, 
  GalleryItem, 
  AudioMessage, 
  LandingPage, 
  LoveLetter 
} from '../../shared/sanity-types';

// Sample love letters
export const sampleLetters: LoveLetter[] = [
  {
    _id: "letter1",
    title: "To My Beloved",
    content: "The distance between us seems vast, yet in my heart you are always near. Every morning I wake up thinking of your smile, and each night I fall asleep wrapped in memories of your embrace.",
    description: "A heartfelt message about long-distance love",
    createdAt: "2025-03-01T12:00:00Z",
    theme: {
      primaryColor: "#FF6B6B",
      fontFamily: "Dancing Script",
      animation: "fade"
    },
    effects: ["hearts"],
    animations: {
      openingEffect: "fold",
      backgroundEffect: "particles"
    },
    isPrivate: false
  },
  {
    _id: "letter2",
    title: "My Dearest",
    content: "Do you remember our first date? The way the stars seemed to shine just for us that night? I was so nervous, yet the moment I saw you, all my worries melted away.",
    description: "Reflecting on our beautiful first date",
    createdAt: "2025-02-14T12:00:00Z",
    theme: {
      primaryColor: "#FF85A2",
      fontFamily: "Playfair Display",
      animation: "float"
    },
    effects: ["sparkles"],
    animations: {
      openingEffect: "butterfly",
      backgroundEffect: "petals" 
    },
    isPrivate: false
  },
  {
    _id: "letter3",
    title: "Forever and Always",
    content: "As the seasons change, my love for you only grows deeper. Each passing day reveals new reasons to cherish what we have. I am so grateful to have you in my life, to build our story together.",
    description: "A promise of endless love through all seasons",
    createdAt: "2025-01-20T15:30:00Z",
    theme: {
      primaryColor: "#C5A3FF",
      fontFamily: "Lora",
      animation: "pulse"
    },
    effects: ["glow"],
    animations: {
      openingEffect: "fade",
      backgroundEffect: "stars"
    },
    isPrivate: false
  }
];

// Sample albums
export const sampleAlbums: Album[] = [
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
  },
  {
    _id: "album4",
    title: "Summer Adventures",
    description: "Hiking through lush forests, swimming in crystal-clear lakes, and camping under starry skies.",
    coverImage: "https://images.unsplash.com/photo-1533086723868-6060511e4168?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    itemsCount: 32,
    _createdAt: "2023-08-24T14:20:00Z",
    isPrivate: false
  }
];

// Sample gallery items
export const sampleGalleryItems: GalleryItem[] = [
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
    isPrivate: false,
    category: "travel"
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
    isPrivate: false,
    category: "everyday"
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
    isPrivate: false,
    category: "everyday"
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
    isPrivate: false,
    category: "milestone"
  },
  {
    _id: "item5",
    title: "First Anniversary",
    mediaUrl: "https://images.unsplash.com/photo-1522673607200-164d1b3ce551?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1522673607200-164d1b3ce551?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    date: "2023-04-15T18:00:00Z",
    mediaType: "image",
    isFavorite: true,
    reactions: [{ emoji: "🎂", count: 18 }],
    views: 67,
    isPrivate: false,
    category: "milestone"
  },
  {
    _id: "item6",
    title: "Hiking Adventure",
    mediaUrl: "https://images.unsplash.com/photo-1533086723868-6060511e4168?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1533086723868-6060511e4168?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    date: "2023-07-18T09:00:00Z",
    mediaType: "image",
    isFavorite: false,
    reactions: [{ emoji: "🏔️", count: 7 }],
    views: 29,
    isPrivate: false,
    category: "travel",
    tags: ["nature", "adventure", "mountains"]
  }
];

// Sample audio messages
export const sampleAudioMessages: AudioMessage[] = [
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
  },
  {
    _id: "audio3",
    title: "Happy Birthday Beautiful",
    description: "A special message for your special day. Wishing I could be there in person, but sending all my love through this recording.",
    audioUrl: "",
    duration: 165,
    _createdAt: "2025-02-28T10:15:00Z"
  }
];

// Sample landing page data
export const sampleLandingPage: LandingPage = {
  title: "Every Moment With You",
  message: "A digital space where our love story unfolds, capturing our most cherished moments and heartfelt expressions."
};

// Sample birthday cards
export const sampleBirthdayCards = [
  {
    _id: "birthday1",
    title: "Happy Birthday My Love",
    messages: [
      {
        text: "On your special day, I wish you all the happiness in the world.",
        style: {
          font: "Dancing Script",
          color: "#FF6B6B",
          size: 24
        }
      },
      {
        text: "May all your dreams come true, just as you've made mine come true by being in my life.",
        style: {
          font: "Montserrat",
          color: "#9370DB",
          size: 18
        }
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        alt: "Birthday cake with candles",
        caption: "Wishing we could celebrate together"
      }
    ],
    background: "#FFD700",
    createdAt: "2025-02-28T00:00:00Z"
  }
];

// Function to generate search results
export function generateSearchResults(query: string) {
  // Simple implementation - in real app would do proper searching
  const allContent = [
    ...sampleLetters.map(l => ({ ...l, _type: "loveLetter" })),
    ...sampleAlbums.map(a => ({ ...a, _type: "album" })),
    ...sampleGalleryItems.map(g => ({ ...g, _type: "galleryItem" })),
    ...sampleAudioMessages.map(a => ({ ...a, _type: "audioMessage" }))
  ];
  
  return allContent.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
  );
}

// Generate recent content
export function generateRecentContent(limit = 5) {
  return {
    loveLetters: sampleLetters.slice(0, limit),
    albums: sampleAlbums.slice(0, limit),
    galleryItems: sampleGalleryItems.slice(0, limit),
    audioMessages: sampleAudioMessages.slice(0, limit)
  };
}

// Get featured gallery items
export function getFeaturedGalleryItems() {
  return sampleGalleryItems.filter(item => item.isFavorite).slice(0, 4);
}

// Get item by ID
export function getItemById(type: string, id: string) {
  switch (type) {
    case 'loveLetter':
      return sampleLetters.find(item => item._id === id);
    case 'album':
      return sampleAlbums.find(item => item._id === id);
    case 'galleryItem':
      return sampleGalleryItems.find(item => item._id === id);
    case 'audioMessage':
      return sampleAudioMessages.find(item => item._id === id);
    default:
      return null;
  }
}

// Get album with items
export function getAlbumWithContents(id: string) {
  const album = sampleAlbums.find(a => a._id === id);
  if (!album) return null;
  
  // Create a relationship between albums and gallery items based on ID patterns
  // In a real database, there would be proper references
  const items = sampleGalleryItems.filter(item => 
    item._id.startsWith(id.replace('album', 'item')) ||
    Math.random() > 0.5 // Randomly include some items for demo purposes
  );
  
  return {
    ...album,
    items
  };
}

// Get gallery items by tag
export function getGalleryItemsByTag(tag: string) {
  return sampleGalleryItems.filter(item => 
    item.tags && item.tags.includes(tag)
  );
}