import express from 'express';
import {getUser} from '../controllers/chatController.js';
const router = express.Router();

router.get('/get-all-users', getUser);

export default router;