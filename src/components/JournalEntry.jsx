// JournalEntry.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function JournalEntry() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [weather, setWeather] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchEntry = async () => {
        try {
          const response = await axios.get(`/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTitle(response.data.title);
          setContent(response.data.content);
          setWeather(response.data.weather);
        } catch (error) {
          console.error('Error fetching entry:', error);
          navigate('/');
        }
      };
      fetchEntry();
    }
  }, [id, token, navigate]);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json`, {
          params: {
            key: 'ac5841e33d03421fbcf74725240112', // Replace with your WeatherAPI key
            q: `${latitude},${longitude}`
          }
        });
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              fetchWeather(latitude, longitude);
            },
            (error) => {
              console.error('Error getting location:', error);
            }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
      }
    };

    getLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { title, content, weather };
      if (id) {
        await axios.put(
            `${process.env.VERCEL_URL}/api/posts/${id}`,
            postData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
            `${process.env.VERCEL_URL}/api/posts`,
            postData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-white">
          {id ? 'Edit Journal' : 'New Journal'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-white">Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
          </div>
          <div>
            <label className="block mb-1 text-white">Content</label>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded h-64"
                required
            />
          </div>
          <div className="flex space-x-4">
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Save
            </button>
            <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
  );
}

export default JournalEntry;