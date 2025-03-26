import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getLetters, 
  getAlbums, 
  getGalleryItems, 
  getLandingData,
  getAudioMessages,
  getFeaturedItems
} from "./lib/sanity";

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
  
  // Get love letters
  app.get("/api/love-letters", async (req, res) => {
    try {
      const letters = await getLetters();
      res.json(letters);
    } catch (error) {
      console.error("Error fetching love letters:", error);
      res.status(500).json({ message: "Error fetching love letters" });
    }
  });

  // Get albums
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await getAlbums();
      res.json(albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      res.status(500).json({ message: "Error fetching albums" });
    }
  });

  // Get gallery items
  app.get("/api/gallery", async (req, res) => {
    try {
      const galleryItems = await getGalleryItems();
      res.json(galleryItems);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ message: "Error fetching gallery items" });
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

  // Get audio messages
  app.get("/api/audio-messages", async (req, res) => {
    try {
      const audioMessages = await getAudioMessages();
      res.json(audioMessages);
    } catch (error) {
      console.error("Error fetching audio messages:", error);
      res.status(500).json({ message: "Error fetching audio messages" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
