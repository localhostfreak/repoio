import { createClient } from '@sanity/client';

// Configure Sanity client with fallback values for development
export const client = createClient({
  projectId: 'demo-project',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  // We won't actually connect to Sanity - our backend will return mock data
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
