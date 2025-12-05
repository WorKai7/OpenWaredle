import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

router.get('/random', (req: Request, res: Response) => {
  const software = db.prepare(`
    SELECT * FROM logiciels
    WHERE open_source = 0
    ORDER BY RANDOM()
    LIMIT 1
  `).get();

  if (!software) {
    res.status(404).json({ error: 'No software found' });
    return;
  }

  res.json(software);
});

export default router;
