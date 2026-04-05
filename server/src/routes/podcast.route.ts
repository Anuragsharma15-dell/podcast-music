import { Router } from 'express';

import {
  generatePodcast,
  getMusicStatus,
  getAllMusic,
  deleteMusic,
  checkWubbleHealth
} from '../controllers/podcast.controller';

const router = Router();

router.post('/generate', generatePodcast);
router.get('/status/:id', getMusicStatus);
router.get('/all', getAllMusic);
router.delete('/:id', deleteMusic);
router.get('/health',  checkWubbleHealth)
export default router;
