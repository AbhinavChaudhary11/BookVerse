import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { requireAuth } from '../middleware/auth.js';

dotenv.config(); // ✅ Ensures your .env variables load

const router = express.Router();
const GOOGLE_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

router.get('/search', requireAuth, async (req, res) => {
  try {
    const q = encodeURIComponent((req.query.q || '').toString());
    if (!q) return res.json({ items: [], totalItems: 0, nextStartIndex: 0 });

    const startIndex = Number(req.query.startIndex || 0);
    const maxResults = Math.min(Number(req.query.maxResults || 20), 40);

    // ✅ Include API key from environment variable
    const key = process.env.GOOGLE_BOOKS_API_KEY ? `&key=${process.env.GOOGLE_BOOKS_API_KEY}` : '';

    const url = `${GOOGLE_API_BASE}?q=${q}&startIndex=${startIndex}&maxResults=${maxResults}${key}`;
    const r = await fetch(url);
    const data = await r.json();

    const items = (data.items || []).map((it) => ({
      googleId: it.id,
      title: it.volumeInfo?.title,
      authors: it.volumeInfo?.authors || [],
      thumbnail: it.volumeInfo?.imageLinks?.thumbnail,
      rating: it.volumeInfo?.averageRating,
      description: it.volumeInfo?.description,
      previewLink: it.volumeInfo?.previewLink,
      genres: it.volumeInfo?.categories || []
    }));

    const totalItems = Number(data.totalItems || 0);
    const nextStartIndex = startIndex + items.length;
    return res.json({ items, totalItems, nextStartIndex });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Failed to fetch books from Google API' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;

    // ✅ Include API key here as well
    const key = process.env.GOOGLE_BOOKS_API_KEY ? `?key=${process.env.GOOGLE_BOOKS_API_KEY}` : '';

    const r = await fetch(`${GOOGLE_API_BASE}/${id}${key}`);
    const it = await r.json();

    if (!it || it.error) return res.status(404).json({ message: 'Not found' });

    const book = {
      googleId: it.id,
      title: it.volumeInfo?.title,
      authors: it.volumeInfo?.authors || [],
      thumbnail: it.volumeInfo?.imageLinks?.thumbnail,
      rating: it.volumeInfo?.averageRating,
      description: it.volumeInfo?.description,
      previewLink: it.volumeInfo?.previewLink,
      genres: it.volumeInfo?.categories || []
    };

    return res.json(book);
  } catch (err) {
    console.error('Error fetching book details:', err);
    res.status(500).json({ message: 'Failed to fetch book details' });
  }
});

export default router;
