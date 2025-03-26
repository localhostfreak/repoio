import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getLetters, 
  getAlbums, 
  getGalleryItems, 
  getLandingData,
  getAudioMessages,
  getFeaturedItems,
  getLoveLetter,
  getAudioMessage,
  getAlbumWithItems,
  getGalleryItemsByTag,
  searchContent,
  getRecentContent
} from "./lib/sanity";

// Import create/update/delete functions
import {
  createLoveLetter,
  updateLoveLetter,
  deleteLoveLetter,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  createAudioMessage,
  updateAudioMessage,
  deleteAudioMessage,
  createAlbum,
  updateAlbum,
  deleteAlbum
} from "./lib/sanity-mutations";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sanity CMS data endpoints
  
  // Get landing page data
  app.get("/api/landing", async (req, res) => {
    try {
      const landingData = await getLandingData();
      res.json(landingData);
    } catch (error) {
      console.error("Error fetching landing data:", error);
      res.status(500).json({ message: "Error fetching landing data" });
    }
  });
  
  // -------------- LOVE LETTERS API --------------
  
  // Get all love letters
  app.get("/api/love-letters", async (req, res) => {
    try {
      const letters = await getLetters();
      res.json(letters);
    } catch (error) {
      console.error("Error fetching love letters:", error);
      res.status(500).json({ message: "Error fetching love letters" });
    }
  });
  
  // Get love letter by ID
  app.get("/api/love-letters/:id", async (req, res) => {
    try {
      const letter = await getLoveLetter(req.params.id);
      if (!letter) {
        return res.status(404).json({ message: "Love letter not found" });
      }
      res.json(letter);
    } catch (error) {
      console.error(`Error fetching love letter with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error fetching love letter" });
    }
  });
  
  // Create a new love letter
  app.post("/api/love-letters", async (req, res) => {
    try {
      const newLetter = await createLoveLetter(req.body);
      res.status(201).json(newLetter);
    } catch (error) {
      console.error("Error creating love letter:", error);
      res.status(500).json({ message: "Error creating love letter" });
    }
  });
  
  // Update a love letter
  app.patch("/api/love-letters/:id", async (req, res) => {
    try {
      const updatedLetter = await updateLoveLetter(req.params.id, req.body);
      res.json(updatedLetter);
    } catch (error) {
      console.error(`Error updating love letter with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error updating love letter" });
    }
  });
  
  // Delete a love letter
  app.delete("/api/love-letters/:id", async (req, res) => {
    try {
      await deleteLoveLetter(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting love letter with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error deleting love letter" });
    }
  });
  
  // Add letter exchange to a love letter conversation
  app.post("/api/love-letters/:id/exchange", async (req, res) => {
    try {
      const updatedLetter = await addLetterExchange(req.params.id, req.body);
      res.json(updatedLetter);
    } catch (error) {
      console.error(`Error adding exchange to love letter with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error adding letter exchange" });
    }
  });

  // -------------- ALBUMS API --------------
  
  // Get all albums
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await getAlbums();
      res.json(albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).json({ message: "Error fetching albums" });
    }
  });
  
  // Get album by ID with all its items
  app.get("/api/albums/:id", async (req, res) => {
    try {
      const album = await getAlbumWithItems(req.params.id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      res.json(album);
    } catch (error) {
      console.error(`Error fetching album with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error fetching album" });
    }
  });
  
  // Create a new album
  app.post("/api/albums", async (req, res) => {
    try {
      const newAlbum = await createAlbum(req.body);
      res.status(201).json(newAlbum);
    } catch (error) {
      console.error("Error creating album:", error);
      res.status(500).json({ message: "Error creating album" });
    }
  });
  
  // Update an album
  app.patch("/api/albums/:id", async (req, res) => {
    try {
      const updatedAlbum = await updateAlbum(req.params.id, req.body);
      res.json(updatedAlbum);
    } catch (error) {
      console.error(`Error updating album with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error updating album" });
    }
  });
  
  // Delete an album
  app.delete("/api/albums/:id", async (req, res) => {
    try {
      await deleteAlbum(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting album with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error deleting album" });
    }
  });

  // -------------- GALLERY ITEMS API --------------
  
  // Get all gallery items
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ message: "Error fetching gallery items" });
    }
  });
  
  // Get gallery items by tag
  app.get("/api/gallery/tag/:tag", async (req, res) => {
    try {
      const items = await getGalleryItemsByTag(req.params.tag);
      res.json(items);
    } catch (error) {
      console.error(`Error fetching gallery items with tag ${req.params.tag}:`, error);
      res.status(500).json({ message: "Error fetching gallery items by tag" });
    }
  });
  
  // Get featured gallery items
  app.get("/api/gallery/featured", async (req, res) => {
    try {
      const featuredItems = await getFeaturedItems();
      res.json(featuredItems);
    } catch (error) {
      console.error("Error fetching featured items:", error);
      res.status(500).json({ message: "Error fetching featured items" });
    }
  });
  
  // Create a new gallery item
  app.post("/api/gallery", async (req, res) => {
    try {
      const newItem = await createGalleryItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating gallery item:", error);
      res.status(500).json({ message: "Error creating gallery item" });
    }
  });
  
  // Update a gallery item
  app.patch("/api/gallery/:id", async (req, res) => {
    try {
      const updatedItem = await updateGalleryItem(req.params.id, req.body);
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error updating gallery item with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error updating gallery item" });
    }
  });
  
  // Delete a gallery item
  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      await deleteGalleryItem(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting gallery item with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error deleting gallery item" });
    }
  });
  
  // Add reaction to a gallery item
  app.post("/api/gallery/:id/reaction", async (req, res) => {
    try {
      const { emoji } = req.body;
      if (!emoji) {
        return res.status(400).json({ message: "Emoji is required" });
      }
      const updatedItem = await addReactionToGalleryItem(req.params.id, emoji);
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error adding reaction to gallery item with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error adding reaction" });
    }
  });
  
  // Toggle favorite status for a gallery item
  app.post("/api/gallery/:id/toggle-favorite", async (req, res) => {
    try {
      const updatedItem = await toggleGalleryItemFavorite(req.params.id);
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error toggling favorite status for gallery item with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error toggling favorite status" });
    }
  });
  
  // Increment view count for a gallery item
  app.post("/api/gallery/:id/view", async (req, res) => {
    try {
      const updatedItem = await incrementGalleryItemViews(req.params.id);
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error incrementing views for gallery item with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error incrementing views" });
    }
  });

  // -------------- AUDIO MESSAGES API --------------
  
  // Get all audio messages
  app.get("/api/audio-messages", async (req, res) => {
    try {
      const audioMessages = await getAudioMessages();
      res.json(audioMessages);
    } catch (error) {
      console.error("Error fetching audio messages:", error);
      res.status(500).json({ message: "Error fetching audio messages" });
    }
  });
  
  // Get audio message by ID
  app.get("/api/audio-messages/:id", async (req, res) => {
    try {
      const message = await getAudioMessage(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Audio message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error(`Error fetching audio message with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error fetching audio message" });
    }
  });
  
  // Create a new audio message
  app.post("/api/audio-messages", async (req, res) => {
    try {
      const newMessage = await createAudioMessage(req.body);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating audio message:", error);
      res.status(500).json({ message: "Error creating audio message" });
    }
  });
  
  // Update an audio message
  app.patch("/api/audio-messages/:id", async (req, res) => {
    try {
      const updatedMessage = await updateAudioMessage(req.params.id, req.body);
      res.json(updatedMessage);
    } catch (error) {
      console.error(`Error updating audio message with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error updating audio message" });
    }
  });
  
  // Delete an audio message
  app.delete("/api/audio-messages/:id", async (req, res) => {
    try {
      await deleteAudioMessage(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting audio message with ID ${req.params.id}:`, error);
      res.status(500).json({ message: "Error deleting audio message" });
    }
  });
  
  // -------------- SEARCH API --------------
  
  // Search across all content types
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const results = await searchContent(query);
      res.json(results);
    } catch (error) {
      console.error(`Error searching content with query "${req.query.q}":`, error);
      res.status(500).json({ message: "Error searching content" });
    }
  });
  
  // -------------- SNAPS API --------------

app.post("/api/snaps", async (req, res) => {
  try {
    const newSnap = await createSnap(req.body);
    res.status(201).json(newSnap);
  } catch (error) {
    console.error("Error creating snap:", error);
    res.status(500).json({ message: "Error creating snap" });
  }
});

app.get("/api/snaps/:userId", async (req, res) => {
  try {
    const snaps = await getSnapsByUser(req.params.userId);
    res.json(snaps);
  } catch (error) {
    console.error("Error fetching snaps:", error);
    res.status(500).json({ message: "Error fetching snaps" });
  }
});

app.post("/api/snaps/:id/view", async (req, res) => {
  try {
    await markSnapAsViewed(req.params.id);
    res.status(200).end();
  } catch (error) {
    console.error("Error marking snap as viewed:", error);
    res.status(500).json({ message: "Error marking snap as viewed" });
  }
});

// -------------- RECENT CONTENT API --------------
  
  // Get recent content across all types
  app.get("/api/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentContent = await getRecentContent(limit);
      res.json(recentContent);
    } catch (error) {
      console.error("Error fetching recent content:", error);
      res.status(500).json({ message: "Error fetching recent content" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
// Snap routes
app.post('/api/snaps', async (req, res) => {
  const { media, duration, sender } = req.body;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24hr expiry
  
  const snap = await sanityClient.create({
    _type: 'snap',
    media,
    duration,
    sender,
    expiresAt,
    viewed: false
  });
  
  res.json(snap);
});

app.get('/api/snaps', async (req, res) => {
  const snaps = await sanityClient.fetch(
    `*[_type == "snap" && !viewed && dateTime(expiresAt) > dateTime(now())]`
  );
  res.json(snaps);
});

app.put('/api/snaps/:id/view', async (req, res) => {
  await sanityClient
    .patch(req.params.id)
    .set({viewed: true})
    .commit();
  res.sendStatus(200);
});
