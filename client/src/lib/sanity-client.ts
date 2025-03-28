
import { createClient } from '@sanity/client';

// Initialize the Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'powk3va5',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN,
  useCdn: false, // Set to true for production
});

export const createAlbum = async (albumData: any) => {
  try {
    // Create a slug from the title
    const slug = albumData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Format the data to match the schema in shared/schemas/gallery.ts
    const formattedData = {
      _type: 'album',
      title: albumData.title,
      description: albumData.description,
      slug: {
        _type: 'slug',
        current: slug
      },
      coverImage: albumData.coverImage ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: albumData.coverImage
        }
      } : undefined,
      items: [] // Empty array initially, items will be added later
    };

    console.log('Creating album with data:', formattedData);
    
    // Send to Sanity
    const response = await sanityClient.create(formattedData);
    console.log('Album created successfully:', response);
    
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error creating album in Sanity:', error);
    throw new Error('Failed to create album in Sanity');
  }
};

export const fetchAlbums = async () => {
  try {
    const query = `*[_type == "album"] {
      _id,
      title,
      description,
      "slug": slug.current,
      "coverImage": coverImage.asset->url,
      "itemCount": count(items)
    }`;
    
    const result = await sanityClient.fetch(query);
    return result;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};
