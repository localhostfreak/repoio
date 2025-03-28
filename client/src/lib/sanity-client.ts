
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id', 
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: import.meta.env.VITE_SANITY_TOKEN,
  useCdn: false, // Set to `true` for production
});

// Helper function to create an album in Sanity
export async function createAlbum(album: {
  title: string;
  description?: string;
  coverImage?: string;
  isPrivate: boolean;
}) {
  try {
    const result = await sanityClient.create({
      _type: 'album',
      title: album.title,
      description: album.description,
      coverImage: album.coverImage ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: album.coverImage // Should be an image reference ID from Sanity
        }
      } : undefined,
      isPrivate: album.isPrivate,
      items: [], // Start with empty items array
    });
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating album in Sanity:', error);
    return { success: false, error };
  }
}

// Helper function to get all albums
export async function getAlbums() {
  try {
    const albums = await sanityClient.fetch(`
      *[_type == "album"] {
        _id,
        title,
        description,
        "coverImageUrl": coverImage.asset->url,
        isPrivate,
        "itemsCount": count(items)
      }
    `);
    return { success: true, data: albums };
  } catch (error) {
    console.error('Error fetching albums from Sanity:', error);
    return { success: false, error };
  }
}
