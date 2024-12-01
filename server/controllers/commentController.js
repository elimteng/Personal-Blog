import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
        .populate('user', 'username')
        .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const commentData = {
      post: req.params.postId,
      content
    };

    if (req.user) {
      commentData.user = req.user._id;
    }

    const comment = await Comment.create(commentData);

    const populatedComment = await comment.populate('user', 'username');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteCommentByPostOwner = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete comments on this post' });
    }

    const comment = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      post: req.params.postId
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};