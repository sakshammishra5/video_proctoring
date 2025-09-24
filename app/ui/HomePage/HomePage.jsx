import { Camera, Users, Shield, Phone, FileText, Eye } from 'lucide-react';

const HomePage = ({ onViewChange }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-indigo-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-800">SecureView</h1>
          </div>
          <p className="text-xl text-gray-600">AI-Powered Video Proctoring System</p>
          <p className="text-gray-500 mt-2">Ensuring interview integrity with real-time monitoring</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Eye className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Focus Detection</h3>
            <p className="text-gray-600">Real-time monitoring of candidate attention and presence</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <Phone className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Object Detection</h3>
            <p className="text-gray-600">Automatic detection of unauthorized items and devices</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <FileText className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Detailed Reports</h3>
            <p className="text-gray-600">Comprehensive integrity reports with scoring</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onViewChange('candidate-login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Join as Candidate
          </button>
          <button
            onClick={() => onViewChange('interviewer-login')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Camera className="w-5 h-5 mr-2" />
            Join as Interviewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;