import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getPosts,
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost, getPostByIdPublic
} from '../controllers/postController.js';

const router = express.Router();

// New route to get all posts without authentication
router.route('/all').get(getAllPosts);

router.route('/public/:id').get(getPostByIdPublic);

router.use(protect);

router.route('/')
    .get(getPosts)
    .post(createPost);

router.route('/:id')
    .get(getPostById)
    .put(updatePost)
    .delete(deletePost);

export default router;