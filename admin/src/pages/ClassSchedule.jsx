import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit } from 'lucide-react';

const ClassSchedule = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: 'Morning Yoga', instructor: 'Sarah Lee', day: 'Monday', time: '6:00 AM', duration: '1 hour' },
    { id: 2, name: 'HIIT Training', instructor: 'Mike Johnson', day: 'Wednesday', time: '7:00 PM', duration: '45 mins' },
    { id: 3, name: 'Strength Training', instructor: 'Alex Wong', day: 'Friday', time: '6:30 PM', duration: '1 hour' }
  ]);

  const [newClass, setNewClass] = useState({
    name: '',
    instructor: '',
    day: '',
    time: '',
    duration: ''
  });

  const handleAddClass = () => {
    const classToAdd = { ...newClass, id: classes.length + 1 };
    setClasses([...classes, classToAdd]);
    setNewClass({ name: '', instructor: '', day: '', time: '', duration: '' });
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(cls => cls.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Schedule</h1>

      {/* Class List */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Classes</h2>
            <button 
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleAddClass}
            >
              <Plus className="mr-2" /> Add Class
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Class Name</th>
                <th className="p-3 text-left">Instructor</th>
                <th className="p-3 text-left">Day</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-b">
                  <td className="p-3">{cls.name}</td>
                  <td className="p-3">{cls.instructor}</td>
                  <td className="p-3">{cls.day}</td>
                  <td className="p-3">{cls.time}</td>
                  <td className="p-3">{cls.duration}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit size={20} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClass(cls.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Class Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Class Name"
            className="border p-2 rounded"
            value={newClass.name}
            onChange={(e) => setNewClass({...newClass, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Instructor"
            className="border p-2 rounded"
            value={newClass.instructor}
            onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
          />
          <select 
            className="border p-2 rounded"
            value={newClass.day}
            onChange={(e) => setNewClass({...newClass, day: e.target.value})}
          >
            <option value="">Select Day</option>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <input 
            type="time" 
            className="border p-2 rounded"
            value={newClass.time}
            onChange={(e) => setNewClass({...newClass, time: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Duration"
            className="border p-2 rounded"
            value={newClass.duration}
            onChange={(e) => setNewClass({...newClass, duration: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;