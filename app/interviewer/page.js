'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';

export default function InterviewerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleGenerateRoom = async () => {
    setGenerating(true);
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewerName: formData.name,
          interviewerEmail: formData.email,
          videoService: 'webrtc'
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to interviewer room
        router.push(`/interviewer/${result.data.roomId}?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`);
      } else {
        setErrors({ api: result.error || 'Failed to create room' });
      }
    } catch (error) {
      console.error('Room creation failed:', error);
      setErrors({ api: 'Network error. Please try again.' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <Camera className="w-12 h-12 text-gray-800 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Create Interview Room</h2>
            <p className="text-gray-600 mt-2">Generate a WebRTC room for the interview</p>
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

            {errors.api && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errors.api}</p>
              </div>
            )}

            <button
              onClick={handleGenerateRoom}
              disabled={generating}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {generating ? 'Creating Room...' : 'Create WebRTC Room'}
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

