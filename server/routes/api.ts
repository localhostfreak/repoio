import express from 'express';
import { sanityAPI } from '../lib/sanity';

const router = express.Router();

router.get('/letters', async (req, res) => {
  try {
    const letters = await sanityAPI.getLetters();
    res.json(letters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

// ... other routes following the same pattern

export default router;
