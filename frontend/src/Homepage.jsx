import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateStatus from './CreateStatus';

export default function HomePage({ user }) {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get('/api/status/all');
      setStatuses(response.data);
    } catch (error) {
      console.error('Failed to fetch statuses:', error);
    }
  };

  const handleStatusCreated = (newStatus) => {
    setStatuses([newStatus, ...statuses]);
  };

  return (
      <div>
        {user && <CreateStatus onStatusCreated={handleStatusCreated} />}
        <div className="space-y-4 mt-8">
          {statuses.map((status) => (
              <div key={status._id} className="bg-white p-4 rounded shadow">
                <Link to={`/user/${status.username}`} className="font-bold text-blue-500">
                  {status.username}
                </Link>
                <p className="mt-2">{status.content}</p>
                <span className="text-gray-500 text-sm">
              {new Date(status.createdAt).toLocaleString()}
            </span>
              </div>
          ))}
        </div>
      </div>
  );
}