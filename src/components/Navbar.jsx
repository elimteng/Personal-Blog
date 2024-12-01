import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Weather from './Weather';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif',
    'https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/512.gif',
    'https://fonts.gstatic.com/s/e/notoemoji/latest/1f423/512.gif'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              Personal Journal
            </Link>
            <div className="flex items-center space-x-4">
              <Weather />
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              {user ? (
                  <>
                    <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                      Profile
                    </Link>
                    <span
                        className="font-semibold px-2 py-1 rounded flex items-center"
                        style={{
                          backgroundImage: 'url(https://ooo.0x0.ooo/2024/12/01/OLk3YN.jpg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          // backgroundColor: 'rgb(255,255,255)',
                          color: 'white',
                          textShadow: '3px 2px 4px rgba(0, 0, 0, 0.9)',
                        }}
                    >
                  Welcome, <span style={{ color: '#ffffff' }}> {user.username}</span>
                  <img
                      src={images[currentImageIndex]}
                      alt="Welcome Emoji"
                      className="w-8 h-8 ml-2"
                  />
                </span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                    >
                      Logout
                    </button>
                  </>
              ) : (
                  <>
                    <Link to="/login" className="text-gray-600 hover:text-gray-900">
                      Login
                    </Link>
                    <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                      Register
                    </Link>
                  </>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;