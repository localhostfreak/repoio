import { createClient } from '@sanity/client';
import type { 
  LoveLetter, 
  GalleryItem, 
  AudioMessage, 
  Album 
} from '../../shared/sanity-types';

// Create a Sanity client with write permissions
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false, // We need fresh data and want to be able to write
  apiVersion: '2023-05-03',
  token: process.env.SANITY_TOKEN,
});

/**
 * Create, update, and delete functions for Love Letters
 */
export async function createLoveLetter(data: Omit<LoveLetter, '_id'>) {
  try {
    return await client.create({
      _type: 'loveLetter',
      ...data,
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error creating love letter:', error);
    throw new Error(`Failed to create love letter: ${error.message}`);
  }
}

export async function updateLoveLetter(id: string, data: Partial<LoveLetter>) {
  try {
    return await client
      .patch(id)
      .set(data)
      .commit();
  } catch (error: any) {
    console.error(`Error updating love letter with ID ${id}:`, error);
    throw new Error(`Failed to update love letter: ${error.message}`);
  }
}

export async function deleteLoveLetter(id: string) {
  try {
    return await client.delete(id);
  } catch (error: any) {
    console.error(`Error deleting love letter with ID ${id}:`, error);
    throw new Error(`Failed to delete love letter: ${error.message}`);
  }
}

/**
 * Create, update, and delete functions for Gallery Items
 */
export async function createGalleryItem(data: Omit<GalleryItem, '_id'>) {
  try {
    return await client.create({
      _type: 'galleryItem',
      ...data,
      views: 0,
      isFavorite: false
    });
  } catch (error: any) {
    console.error('Error creating gallery item:', error);
    throw new Error(`Failed to create gallery item: ${error.message}`);
  }
}

export async function updateGalleryItem(id: string, data: Partial<GalleryItem>) {
  try {
    return await client
      .patch(id)
      .set(data)
      .commit();
  } catch (error: any) {
    console.error(`Error updating gallery item with ID ${id}:`, error);
    throw new Error(`Failed to update gallery item: ${error.message}`);
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    return await client.delete(id);
  } catch (error: any) {
    console.error(`Error deleting gallery item with ID ${id}:`, error);
    throw new Error(`Failed to delete gallery item: ${error.message}`);
  }
}

/**
 * Create, update, and delete functions for Audio Messages
 */
export async function createAudioMessage(data: Omit<AudioMessage, '_id' | '_createdAt'>) {
  try {
    return await client.create({
      _type: 'audioMessage',
      ...data
    });
  } catch (error: any) {
    console.error('Error creating audio message:', error);
    throw new Error(`Failed to create audio message: ${error.message}`);
  }
}

export async function updateAudioMessage(id: string, data: Partial<AudioMessage>) {
  try {
    return await client
      .patch(id)
      .set(data)
      .commit();
  } catch (error: any) {
    console.error(`Error updating audio message with ID ${id}:`, error);
    throw new Error(`Failed to update audio message: ${error.message}`);
  }
}

export async function deleteAudioMessage(id: string) {
  try {
    return await client.delete(id);
  } catch (error: any) {
    console.error(`Error deleting audio message with ID ${id}:`, error);
    throw new Error(`Failed to delete audio message: ${error.message}`);
  }
}

/**
 * Create, update, and delete functions for Albums
 */
export async function createAlbum(data: Omit<Album, '_id' | '_createdAt'>) {
  try {
    return await client.create({
      _type: 'album',
      ...data,
      isPrivate: false
    });
  } catch (error: any) {
    console.error('Error creating album:', error);
    throw new Error(`Failed to create album: ${error.message}`);
  }
}

export async function updateAlbum(id: string, data: Partial<Album>) {
  try {
    return await client
      .patch(id)
      .set(data)
      .commit();
  } catch (error: any) {
    console.error(`Error updating album with ID ${id}:`, error);
    throw new Error(`Failed to update album: ${error.message}`);
  }
}

export async function deleteAlbum(id: string) {
  try {
    return await client.delete(id);
  } catch (error: any) {
    console.error(`Error deleting album with ID ${id}:`, error);
    throw new Error(`Failed to delete album: ${error.message}`);
  }
}

/**
 * Upload an asset (image or audio file) to Sanity
 */
export async function uploadAsset(file: any, options = {}) {
  try {
    return await client.assets.upload('file', file, options);
  } catch (error: any) {
    console.error('Error uploading asset:', error);
    throw new Error(`Failed to upload asset: ${error.message}`);
  }
}

/**
 * Add a reaction to a gallery item
 */
export async function addReactionToGalleryItem(id: string, emoji: string) {
  try {
    // First get the current reactions
    const item = await client.getDocument(id);
    
    if (!item) {
      throw new Error(`Gallery item with ID ${id} not found`);
    }
    
    const reactions = item.reactions || [];
    const existingReaction = reactions.find((r: any) => r.emoji === emoji);
    
    if (existingReaction) {
      // Update existing reaction count
      return await client
        .patch(id)
        .set({
          reactions: reactions.map((r: any) => 
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          )
        })
        .commit();
    } else {
      // Add new reaction
      return await client
        .patch(id)
        .set({
          reactions: [...reactions, { emoji, count: 1 }]
        })
        .commit();
    }
  } catch (error: any) {
    console.error(`Error adding reaction to gallery item with ID ${id}:`, error);
    throw new Error(`Failed to add reaction: ${error.message}`);
  }
}

/**
 * Increment view count for a gallery item
 */
export async function incrementGalleryItemViews(id: string) {
  try {
    return await client
      .patch(id)
      .inc({ views: 1 })
      .commit();
  } catch (error: any) {
    console.error(`Error incrementing views for gallery item with ID ${id}:`, error);
    throw new Error(`Failed to increment views: ${error.message}`);
  }
}

/**
 * Toggle favorite status for a gallery item
 */
export async function toggleGalleryItemFavorite(id: string) {
  try {
    const item = await client.getDocument(id);
    
    if (!item) {
      throw new Error(`Gallery item with ID ${id} not found`);
    }
    
    return await client
      .patch(id)
      .set({ isFavorite: !item.isFavorite })
      .commit();
  } catch (error: any) {
    console.error(`Error toggling favorite status for gallery item with ID ${id}:`, error);
    throw new Error(`Failed to toggle favorite status: ${error.message}`);
  }
}

/**
 * Add a letter exchange to a love letter conversation
 */
export async function addLetterExchange(id: string, exchange: any) {
  try {
    const letter = await client.getDocument(id);
    
    if (!letter) {
      throw new Error(`Love letter with ID ${id} not found`);
    }
    
    const exchanges = letter.letters || [];
    
    return await client
      .patch(id)
      .set({
        letters: [...exchanges, {
          ...exchange,
          createdAt: new Date().toISOString()
        }]
      })
      .commit();
  } catch (error: any) {
    console.error(`Error adding letter exchange to love letter with ID ${id}:`, error);
    throw new Error(`Failed to add letter exchange: ${error.message}`);
  }
}