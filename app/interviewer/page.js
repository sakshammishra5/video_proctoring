'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Copy, CheckCircle } from 'lucide-react';

export default function InterviewerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [roomGenerated, setRoomGenerated] = useState(false);
  const [roomId, setRoomId] = useState('');

  const generateRoomId = () => {
    // Simple room ID generation
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'INTERVIEW_';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleCreateRoom = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setRoomGenerated(true);
  };

  const handleJoinRoom = () => {
    router.push(`/interviewer/${roomId}?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  if (roomGenerated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Room Created!</h2>
              <p className="text-gray-600 mt-2">Share this Room ID with the candidate</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-800 mb-2">Jitsi Room ID:</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-2xl font-bold font-mono text-blue-900 bg-white px-4 py-2 rounded border break-all">
                    {roomId}
                  </span>
                  <button
                    onClick={copyRoomId}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    title="Copy Room ID"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-blue-600">
                  Both you and the candidate will join the same Jitsi room
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleJoinRoom}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Join Jitsi Room
              </button>
              
              <button
                onClick={() => {
                  setRoomGenerated(false);
                  setRoomId('');
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
              >
                Create Different Room
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Powered by Jitsi Meet - Free & Secure
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Create Interview Room</h2>
            <p className="text-gray-600 mt-2">Set up a Jitsi Meet proctoring session</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interviewer Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">✨ Why Jitsi?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Free & open source</li>
                <li>• No signaling server needed</li>
                <li>• Works immediately</li>
                <li>• Built-in recording & screen sharing</li>
              </ul>
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Create Jitsi Room
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}