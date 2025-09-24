'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';

export default function CandidatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roomId: ''
  });
  const [errors, setErrors] = useState({});
  const [joining, setJoining] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleJoinRoom = async () => {
    setJoining(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.roomId.trim()) newErrors.roomId = 'Room ID is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setJoining(false);
      return;
    }

    try {
      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: formData.roomId.toUpperCase(),
          candidateName: formData.name,
          candidateEmail: formData.email
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to candidate room
        router.push(`/candidate/${formData.roomId.toUpperCase()}?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&sessionId=${result.data.sessionId}`);
      } else {
        setErrors({ api: result.error || 'Failed to join room' });
      }
    } catch (error) {
      console.error('Room join failed:', error);
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Join Interview</h2>
            <p className="text-gray-600 mt-2">Enter room details to join the interview</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room ID *
              </label>
              <input
                type="text"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono uppercase"
                placeholder="Enter the room ID"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.roomId && <p className="text-red-500 text-sm mt-1">{errors.roomId}</p>}
            </div>

            {errors.api && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errors.api}</p>
              </div>
            )}

            <button
              onClick={handleJoinRoom}
              disabled={joining}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {joining ? 'Joining Room...' : 'Join Interview Room'}
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
