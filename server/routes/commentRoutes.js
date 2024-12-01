
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getComments,
  createComment,
  deleteComment,
  deleteCommentByPostOwner
} from '../controllers/commentController.js';

const router = express.Router();

router.route('/post/:postId')
    .get(getComments)
    .post(createComment); // This route is not protected

router.use(protect); // Apply protection to the routes below

router.route('/:id')
    .delete(deleteComment);

router.route('/post/:postId/comment/:commentId')
    .delete(deleteCommentByPostOwner);

export default router;