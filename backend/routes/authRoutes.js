import express from 'express';
import {register,login,me,logout,refreshToken} from '../controllers/authController.js';
const router = express.Router();
import AuthMiddleware from '../middleware/authMiddleware.js';

router.post('/register',register);
router.post('/login',login);

router.post('/me',AuthMiddleware,me);
router.post('/refresh',refreshToken);
router.post('/logout',logout);

export default router;