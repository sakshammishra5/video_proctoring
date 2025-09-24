import React from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

const VideoControls = ({ 
  isVideoEnabled, 
  isAudioEnabled, 
  onToggleVideo, 
  onToggleAudio, 
  onDisconnect,
  userType 
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black bg-opacity-50 px-6 py-3 rounded-full">
      {/* Audio Toggle */}
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-full transition-colors ${
          isAudioEnabled 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full transition-colors ${
          isVideoEnabled 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* Disconnect */}
      <button
        onClick={onDisconnect}
        className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
        title="End call"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
};

export default VideoControls;
