import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
    const { token, user, login } = useAuth();
    const [username, setUsername] = useState(user.username);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${process.env.APPLICATIONINSIGHTS_CONNECTION_STRING}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${process.env.APPLICATIONINSIGHTS_CONNECTION_STRING}/api/users/profile`, {
                username
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            login(token, response.data); // Update user state with the correct data
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Save
                </button>
            </form>
        </div>
    );
}

export default Profile;