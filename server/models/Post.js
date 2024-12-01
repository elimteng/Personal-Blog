import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  weather: {
    type: Object,
    required: false
  },
  tags: [{
    type: String
  }],
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }]
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;