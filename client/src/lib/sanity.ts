import { createClient } from '@sanity/client';

// Handle environment variables safely
const projectId = typeof import.meta.env !== 'undefined' ? 
  import.meta.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'development' : 
  'development';

const dataset = typeof import.meta.env !== 'undefined' ? 
  import.meta.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production' : 
  'production';

const token = typeof import.meta.env !== 'undefined' ? 
  import.meta.env.VITE_SANITY_TOKEN || process.env.SANITY_TOKEN || '' : 
  '';

// Configure Sanity client with environment variables
export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2023-05-03',
  token
});

// Queries
export const getLettersQuery = `*[_type == "loveLetter"] | order(createdAt desc) {
  _id,
  title,
  content,
  theme,
  effects,
  createdAt,
  "author": author->name,
  "coverImage": theme.primaryColor
}`;

export const getAlbumsQuery = `*[_type == "album" && !isPrivate || sharedWith[0] == $identity] | order(_createdAt desc) {
  _id,
  title,
  description,
  "coverImage": coverImage.asset->url,
  "itemsCount": count(items),
  isPrivate
}`;

export const getGalleryItemsQuery = `*[_type == "galleryItem" && !isPrivate || sharedWith[0] == $identity] | order(date desc) {
  _id,
  title,
  description,
  date,
  mediaType,
  "mediaUrl": media.asset->url,
  "thumbnailUrl": thumbnail.asset->url,
  isFavorite,
  reactions,
  views,
  category
}`;

export const getLandingPageQuery = `*[_type == "landing"][0] {
  title,
  message
}`;

export const getAudioMessagesQuery = `*[_type == "audioMessage"] | order(_createdAt desc) {
  _id,
  title,
  "audioUrl": audioFile.asset->url,
  caption,
  description,
  duration,
  _createdAt
}`;

export const getFeaturedItemsQuery = `*[_type == "galleryItem" && isFavorite == true] | order(views desc) [0...4] {
  _id,
  title,
  "mediaUrl": media.asset->url,
  "thumbnailUrl": thumbnail.asset->url,
  reactions
}`;

// Additional queries for enhanced features

// Get a single love letter by ID
export const getLoveLetterByIdQuery = `*[_type == "loveLetter" && _id == $id][0] {
  _id,
  title,
  content,
  theme,
  effects,
  createdAt,
  "author": author->name,
  "coverImage": theme.primaryColor,
  privacy,
  scheduling,
  animations,
  letters
}`;

// Get album with all its items
export const getAlbumWithItemsQuery = `*[_type == "album" && _id == $id][0] {
  ...,
  "coverImage": coverImage.asset->url,
  "items": *[_type == "galleryItem" && references($id)] {
    _id,
    title,
    description,
    date,
    mediaType,
    "mediaUrl": media.asset->url,
    "thumbnailUrl": thumbnail.asset->url,
    isFavorite,
    reactions,
    views,
    category,
    tags
  }
}`;

// Get gallery items by tag
export const getGalleryItemsByTagQuery = `*[_type == "galleryItem" && $tag in tags] | order(date desc) {
  _id,
  title,
  description,
  date,
  mediaType,
  "mediaUrl": media.asset->url,
  "thumbnailUrl": thumbnail.asset->url,
  isFavorite,
  reactions,
  views,
  category,
  tags
}`;

// Get a single audio message
export const getAudioMessageByIdQuery = `*[_type == "audioMessage" && _id == $id][0] {
  _id,
  title,
  "audioUrl": audioFile.asset->url,
  caption,
  description,
  duration,
  _createdAt,
  mood,
  visualizer,
  transcript,
  background
}`;

// Get birthday cards
export const getBirthdayCardsQuery = `*[_type == "birthdayCard"] | order(_createdAt desc) {
  _id,
  title,
  messages,
  "images": images[] {
    "url": asset->url,
    alt,
    caption
  },
  background,
  createdAt
}`;

// Search across content types
export const searchContentQuery = `*[
  _type in ["loveLetter", "album", "galleryItem", "audioMessage"] &&
  (title match $query || description match $query)
] | order(_createdAt desc) {
  _id,
  _type,
  title,
  description,
  ... _type == "galleryItem" => {
    "mediaUrl": media.asset->url,
    date,
    category
  },
  ... _type == "album" => {
    "coverImage": coverImage.asset->url,
    "itemsCount": count(items)
  },
  ... _type == "loveLetter" => {
    createdAt,
    "coverColor": theme.primaryColor
  },
  ... _type == "audioMessage" => {
    "audioUrl": audioFile.asset->url,
    duration,
    _createdAt
  }
}`;

// Recent content across all types
export const getRecentContentQuery = `{
  "loveLetters": *[_type == "loveLetter"] | order(_createdAt desc)[0...5] {
    _id,
    title,
    content,
    theme,
    createdAt
  },
  "albums": *[_type == "album"] | order(_createdAt desc)[0...5] {
    _id,
    title,
    description,
    "coverImage": coverImage.asset->url,
    "itemsCount": count(items)
  },
  "galleryItems": *[_type == "galleryItem"] | order(date desc)[0...5] {
    _id,
    title,
    "mediaUrl": media.asset->url,
    date,
    category
  },
  "audioMessages": *[_type == "audioMessage"] | order(_createdAt desc)[0...5] {
    _id,
    title,
    "audioUrl": audioFile.asset->url,
    duration,
    _createdAt
  }
}`;
