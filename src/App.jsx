import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import JournalList from './components/JournalList';
import JournalEntry from './components/JournalEntry';
import Profile from './components/Profile';
import Details from './components/Details';

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<JournalList />} />
                <Route path="/entry/:id?" element={<JournalEntry />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;