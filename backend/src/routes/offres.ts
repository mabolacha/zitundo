import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '../data/offres.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const offres = JSON.parse(raw);
    res.json(offres);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de charger les offres.' });
  }
});

export default router;
