import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const MessMenu = () => {
  const [menu, setMenu] = useState([]);
  const [timings, setTimings] = useState(null);

  useEffect(() => {
    // Initial fetch
    fetchMenu();
    fetchTimings();

    // Poll periodically to ensure students see latest updates without manual refresh
    const intervalId = setInterval(() => {
      fetchMenu();
      fetchTimings();
    }, 60000); // every 60 seconds

    return () => clearInterval(intervalId);
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await api.get('/api/mess/menu');
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchTimings = async () => {
    try {
      const response = await api.get('/api/mess/timings');
      setTimings(response.data);
    } catch (error) {
      console.error('Error fetching timings:', error);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mess Menu & Timings</h1>
        <button
          onClick={() => {
            fetchMenu();
            fetchTimings();
          }}
          className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      {timings && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Mess Timings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Breakfast</h3>
              <p className="text-gray-600">
                {timings.breakfast?.start} - {timings.breakfast?.end}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Lunch</h3>
              <p className="text-gray-600">
                {timings.lunch?.start} - {timings.lunch?.end}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Dinner</h3>
              <p className="text-gray-600">
                {timings.dinner?.start} - {timings.dinner?.end}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((dayMenu) => (
          <div key={dayMenu._id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{dayMenu.day}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Breakfast</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {(dayMenu.breakfast?.items || []).length > 0 ? (
                    dayMenu.breakfast.items.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li className="italic text-gray-400">No items set</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Lunch</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {(dayMenu.lunch?.items || []).length > 0 ? (
                    dayMenu.lunch.items.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li className="italic text-gray-400">No items set</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Dinner</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {(dayMenu.dinner?.items || []).length > 0 ? (
                    dayMenu.dinner.items.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li className="italic text-gray-400">No items set</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default MessMenu;


