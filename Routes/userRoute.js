import express from 'express';
import {postTweet, getAllTweets, deleteTweet, postComment, toggleLike, getUser, upload} from '../Controllers/userController.js';
import { verifyToken } from '../Middlewares/auth.js';

const router = express.Router();


router.post('/tweet', verifyToken, upload.single('file'), postTweet);
router.get('/allTweets', getAllTweets);
router.delete('/tweet', verifyToken, deleteTweet);
router.post('/comments', verifyToken, postComment);
router.post('/likes', verifyToken, toggleLike);
router.get('/user', verifyToken, getUser);

export default router;