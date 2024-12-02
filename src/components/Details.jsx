import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Details() {
    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const response = await axios.get(`${process.env.APPLICATIONINSIGHTS_CONNECTION_STRING}/api/posts/public/${id}`);
                setEntry(response.data);
            } catch (error) {
                console.error('Error fetching entry:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${process.env.APPLICATIONINSIGHTS_CONNECTION_STRING}/api/comments/post/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchEntry();
        fetchComments();
    }, [id, token]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.VERCEL_URL}/api/comments/post/${id}`,
                { content: newComment },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(
                `${process.env.VERCEL_URL}/api/comments/post/${id}/comment/${commentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (!entry) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-left">{entry.title}</h2>
            <p className="text-gray-500 text-sm mb-4 text-left">
                {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Invalid date'}
            </p>
            <p className="text-gray-700 mb-4 text-left">{entry.content}</p>
            {entry.weather && (
                <div className="bg-white p-4 rounded shadow-md max-w-md text-left mb-6">
                    <h3 className="text-xl font-semibold mb-2">Weather of that moment</h3>
                    <div className="flex items-center space-x-4 text-sm">
                        <div>
                            <p className="font-bold">{entry.weather.location.name}</p>
                            <p>{entry.weather.current.temp_c}°C</p>
                            <p>{entry.weather.current.condition.text}</p>
                        </div>
                        <img src={entry.weather.current.condition.icon} alt={entry.weather.current.condition.text} className="w-20 h-20" />
                    </div>
                </div>
            )}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                <div className="chat-box bg-gray-100 p-4 rounded mb-4 max-h-96 overflow-y-auto">
                    {comments.map(comment => (
                        <div key={comment._id} className="chat-message bg-white p-2 rounded mb-2 flex items-start">
                            <img
                                src={comment.user ? '/path/to/user/profile/pic' : 'https://img.icons8.com/3d-fluency/94/male-user.png'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full mr-2"
                            />
                            <div>
                                <p className="text-gray-800">{comment.content}</p>
                                <p className="text-gray-500 text-sm">- {comment.user?.username || 'Anonymous'}</p>
                                {user && (entry.user === user._id || comment.user?._id === user._id) && (
                                    <button
                                        onClick={() => handleDeleteComment(comment._id)}
                                        className="bg-red-500 text-white text-sm px-1 py-0.5 rounded hover:bg-red-600 transition duration-300 mx-auto"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {!user && (
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Leave a comment"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 block text-center mt-6">
                Back to Journal List
            </Link>
        </div>
    );
}

export default Details;