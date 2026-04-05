import { Router } from 'express';

import {
  generatePodcast,
  getMusicStatus,
  getAllMusic,
  deleteMusic,
  checkWubbleHealth
} from '../controllers/podcast.controller.ts';

const router = Router();
router.post('/generate', generatePodcast);
router.get('/health', checkWubbleHealth);   // moved up
router.get('/status/:id', getMusicStatus);  // now safe
router.get('/all', getAllMusic);
router.delete('/:id', deleteMusic);
export default router;
