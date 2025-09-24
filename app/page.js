"use client";
import { useRouter } from 'next/navigation';
import { Camera, Users, Shield } from 'lucide-react';


export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-indigo-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-800">SecureView</h1>
            </div>
            <p className="text-xl text-gray-600">AI-Powered Video Proctoring System</p>
            <p className="text-gray-500 mt-2">WebRTC-based real-time monitoring</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/candidate')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Join as Candidate
            </button>
            <button
              onClick={() => router.push('/interviewer')}
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Join as Interviewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}