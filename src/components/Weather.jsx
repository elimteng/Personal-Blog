import { useState, useEffect } from 'react';
import axios from 'axios';

function Weather() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError('Error fetching weather data');
            } finally {
                setLoading(false);
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
                        setError('Error getting location');
                        setLoading(false);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser');
                setLoading(false);
            }
        };

        getLocation();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex items-center space-x-2 text-sm">
            <p>{weather.location.name}</p>
            <p>{weather.current.temp_c}°C</p>
            <p>{weather.current.condition.text}</p>
            <img src={weather.current.condition.icon} alt={weather.current.condition.text} className="w-12 h-12" />
        </div>
    );
}

export default Weather;