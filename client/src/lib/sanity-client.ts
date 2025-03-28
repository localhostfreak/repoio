import { createClient } from '@sanity/client';

// Initialize the Sanity client
const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'powk3va5',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: import.meta.env.VITE_SANITY_TOKEN,
  useCdn: false, // Set to true for production
});

// Assumed to exist and handle image uploads to Sanity.  Implementation details omitted for brevity.
const uploadImage = async (imageUrl: string): Promise<string> => {
  //Implementation to upload image and return its reference id.
  throw new Error("Implementation for uploadImage is missing");
};


export const createAlbum = async (album: {
  title: string;
  description: string;
  coverImage: string | null;
  isPrivate: boolean;
  sharedWith: string[];
  categories?: string[];
  dateRange?: { from: string | null; to: string | null } | null;
  location?: { lat: number; lng: number; address: string } | null;
  tags?: string[];
  theme?: { color: string; font: string | null; layout: string | null } | null;
  effects?: string[] | null;
}) => {
  try {
    const formattedData = {
      _type: 'album',
      title: album.title,
      description: album.description,
      isPrivate: album.isPrivate,
      sharedWith: album.isPrivate ? album.sharedWith : [],

      // Handle cover image if provided
      ...(album.coverImage && {
        coverImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: await uploadImage(album.coverImage)
          }
        }
      }),

      // Handle categories if provided
      ...(album.categories && album.categories.length > 0 && {
        categories: album.categories
      }),

      // Handle date range if provided
      ...(album.dateRange && {
        dateRange: {
          _type: 'object',
          from: album.dateRange.from ? new Date(album.dateRange.from).toISOString() : null,
          to: album.dateRange.to ? new Date(album.dateRange.to).toISOString() : null
        }
      }),

      // Handle location if provided
      ...(album.location && album.location.address && {
        location: {
          _type: 'geopoint',
          lat: album.location.lat,
          lng: album.location.lng,
          // Store address in a custom field since geopoint doesn't include it
          _address: album.location.address
        }
      }),

      // Handle tags if provided
      ...(album.tags && album.tags.length > 0 && {
        tags: album.tags
      }),

      // Handle theme if provided
      ...(album.theme && album.theme.color && {
        theme: {
          _type: 'object',
          color: album.theme.color,
          font: album.theme.font,
          layout: album.theme.layout
        }
      }),

      // Handle effects if provided
      ...(album.effects && album.effects.length > 0 && {
        effects: album.effects
      })
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
    return {
      success: false,
      error
    };
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