"use client";
import {useState} from 'react';
import { Camera } from 'lucide-react';

const InterviewerLogin = ({ onLogin, onViewChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accessCode: ''
  });
  const [errors, setErrors] = useState({});
  const [roomGenerated, setRoomGenerated] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.accessCode.trim()) newErrors.accessCode = 'Access code is required';
    if (!roomGenerated) newErrors.room = 'Please generate a room ID first';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const interviewerDataWithRoom = {
        ...formData,
        roomId: generatedRoomId
      };
      onLogin(interviewerDataWithRoom);
      onViewChange('interviewer-room');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <Camera className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Interviewer Access</h2>
            <p className="text-gray-600 mt-2">Enter credentials to access the interview room</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interviewer Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code *
              </label>
              <input
                type="password"
                name="accessCode"
                value={formData.accessCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Enter interviewer access code"
              />
              {errors.accessCode && <p className="text-red-500 text-sm mt-1">{errors.accessCode}</p>}
            </div>

            {/* Room Generation Section */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Room
              </label>
              {!roomGenerated ? (
                <div>
                  <button
                    onClick={handleGenerateRoom}
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-2"
                  >
                    Generate New Room ID
                  </button>
                  <p className="text-xs text-gray-500 text-center">Click to create a new interview room</p>
                  {errors.room && <p className="text-red-500 text-sm mt-1">{errors.room}</p>}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Room ID Generated:</p>
                      <p className="text-2xl font-bold text-green-900 font-mono">{generatedRoomId}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedRoomId)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    Share this Room ID with the candidate to join the interview
                  </p>
                  <button
                    onClick={() => {
                      setRoomGenerated(false);
                      setGeneratedRoomId('');
                    }}
                    className="text-green-700 hover:text-green-800 text-xs mt-2 underline"
                  >
                    Generate Different Room ID
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Access Interview Room
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onViewChange('home')}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default InterviewerLogin;