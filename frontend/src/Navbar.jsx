import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold">
              Social App
            </Link>
            <div>
              {user ? (
                  <div className="flex items-center space-x-4">
                    <Link to={`/user/${user.username}`} className="text-blue-500">
                      {user.username}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Logout
                    </button>
                  </div>
              ) : (
                  <div className="space-x-4">
                    <Link
                        to="/login"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Register
                    </Link>
                  </div>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}