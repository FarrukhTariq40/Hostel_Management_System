import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const MessManagement = () => {
  const [menu, setMenu] = useState([]);
  const [timings, setTimings] = useState({
    breakfast: { start: '08:00', end: '10:00' },
    lunch: { start: '12:00', end: '14:00' },
    dinner: { start: '19:00', end: '21:00' },
  });
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [dayMenu, setDayMenu] = useState({
    breakfast: { items: [] },
    lunch: { items: [] },
    dinner: { items: [] },
  });

  useEffect(() => {
    fetchMenu();
    fetchTimings();
  }, []);

  useEffect(() => {
    const currentDayMenu = menu.find((m) => m.day === selectedDay);
    if (currentDayMenu) {
      setDayMenu({
        breakfast: { items: currentDayMenu.breakfast?.items || [] },
        lunch: { items: currentDayMenu.lunch?.items || [] },
        dinner: { items: currentDayMenu.dinner?.items || [] },
      });
    }
  }, [selectedDay, menu]);

  const fetchMenu = async () => {
    try {
      const response = await api.get('/mess/menu');
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchTimings = async () => {
    try {
      const response = await api.get('/mess/timings');
      if (response.data) {
        setTimings(response.data);
      }
    } catch (error) {
      console.error('Error fetching timings:', error);
    }
  };

  const handleUpdateMenu = async () => {
    try {
      await api.put('/mess/menu', {
        day: selectedDay,
        breakfast: { items: dayMenu.breakfast.items, timing: timings.breakfast },
        lunch: { items: dayMenu.lunch.items, timing: timings.lunch },
        dinner: { items: dayMenu.dinner.items, timing: timings.dinner },
      });
      alert('Menu updated successfully!');
      fetchMenu();
    } catch (error) {
      alert('Error updating menu');
    }
  };

  const handleUpdateTimings = async () => {
    try {
      await api.put('/mess/timings', {
        breakfast: timings.breakfast,
        lunch: timings.lunch,
        dinner: timings.dinner,
      });
      alert('Timings updated successfully!');
    } catch (error) {
      alert('Error updating timings');
    }
  };

  const addItem = (meal, item) => {
    if (item.trim()) {
      setDayMenu({
        ...dayMenu,
        [meal]: { items: [...dayMenu[meal].items, item.trim()] },
      });
    }
  };

  const removeItem = (meal, index) => {
    setDayMenu({
      ...dayMenu,
      [meal]: { items: dayMenu[meal].items.filter((_, i) => i !== index) },
    });
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mess Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Update Mess Timings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breakfast</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={timings.breakfast.start}
                  onChange={(e) => setTimings({ ...timings, breakfast: { ...timings.breakfast, start: e.target.value } })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="self-center">to</span>
                <input
                  type="time"
                  value={timings.breakfast.end}
                  onChange={(e) => setTimings({ ...timings, breakfast: { ...timings.breakfast, end: e.target.value } })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lunch</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={timings.lunch.start}
                  onChange={(e) => setTimings({ ...timings, lunch: { ...timings.lunch, start: e.target.value } })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="self-center">to</span>
                <input
                  type="time"
                  value={timings.lunch.end}
                  onChange={(e) => setTimings({ ...timings, lunch: { ...timings.lunch, end: e.target.value } })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dinner</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={timings.dinner.start}
                  onChange={(e) => setTimings({ ...timings, dinner: { ...timings.dinner, start: e.target.value } })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="self-center">to</span>
                <input
                  type="time"
                  value={timings.dinner.end}
                  onChange={(e) => setTimings({ ...timings, dinner: { ...timings.dinner, end: e.target.value } })}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handleUpdateTimings}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Timings
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Update Mess Menu</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <div key={meal} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{meal}</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Add ${meal} item`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addItem(meal, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <ul className="list-disc list-inside">
                {dayMenu[meal]?.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{item}</span>
                    <button
                      onClick={() => removeItem(meal, idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={handleUpdateMenu}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessManagement;


