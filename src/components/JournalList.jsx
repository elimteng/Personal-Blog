import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';

function JournalList() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const url = user ? `${process.env.VERCEL_URL}/api/posts` : `${process.env.VERCEL_URL}/api/posts/all`;
        const response = await axios.get(url, {
          headers: user ? { Authorization: `Bearer ${token}` } : {},
          params: { search }
        });
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [token, user, search]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.VERCEL_URL}/api/posts/${entryToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(entries.filter(entry => entry._id !== entryToDelete));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const openModal = (id) => {
    setEntryToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEntryToDelete(null);
  };

  const truncateContent = (content, letterLimit) => {
    if (content.length > letterLimit) {
      return content.slice(0, letterLimit) + '...';
    }
    return content;
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{user ? 'My Journals' : 'All Journals'}</h2>
          {user && (
              <Link
                  to="/entry"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                New Journal
              </Link>
          )}
        </div>
        <div className="mb-4">
          <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-4">
          {entries.map(entry => (
              <div key={entry._id} className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      <Link to={`/details/${entry._id}`} className="hover:text-gray-900">
                        {entry.title}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {entry.createdAt ? format(new Date(entry.createdAt), 'PPP') : 'Invalid date'}
                    </p>
                  </div>
                  {user && (
                      <div className="flex space-x-2">
                        <Link
                            to={`/entry/${entry._id}`}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300 text-sm flex-1 text-center"
                        >
                          Edit
                        </Link>
                        <button
                            onClick={() => openModal(entry._id)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300 text-sm flex-1 text-center"
                        >
                          Delete
                        </button>
                      </div>
                  )}
                </div>
                <p className="mt-2 text-gray-700">
                  {truncateContent(entry.content, 80)}
                </p>
              </div>
          ))}
          {entries.length === 0 && (
              <p className="text-center text-gray-500">No journals yet.</p>
          )}
        </div>
        <ConfirmModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={handleDelete}
        />
      </div>
  );
}

export default JournalList;