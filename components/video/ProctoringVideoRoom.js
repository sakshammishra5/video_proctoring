// ===============================================
// File: components/video/ProctoringVideoRoom.js
// ===============================================
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebRTC } from '../../hooks/useWebRTC';
import VideoControls from './VideoControls';
import MonitoringSidebar from './MonitoringSidebar';
import { AlertCircle, Wifi, WifiOff, Users, Loader2 } from 'lucide-react';

const ProctoringVideoRoom = ({ roomId, userType, userData }) => {
  const router = useRouter();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);

  // WebRTC Hook
  const {
    localStream,
    remoteStream,
    connectionState,
    isVideoEnabled,
    isAudioEnabled,
    error,
    isInitializing,
    toggleVideo,
    toggleAudio,
    getVideoFrame,
    disconnect,
    retry
  } = useWebRTC(roomId, userType);

  // Proctoring State
  const [violations, setViolations] = useState([]);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sessionDuration, setSessionDuration] = useState('00:00:00');
  const [startTime] = useState(Date.now());
  const [isRecording, setIsRecording] = useState(false);

  // Set up video streams
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      console.log('✅ Local video stream set');
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log('✅ Remote video stream set');
    }
  }, [remoteStream]);

  // Start proctoring monitoring for candidates
  useEffect(() => {
    if (userType === 'candidate' && localStream && connectionState === 'connected') {
      startProctoringMonitoring();
      setIsMonitoring(true);
    }

    return () => {
      setIsMonitoring(false);
    };
  }, [userType, localStream, connectionState]);

  // Session duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setSessionDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const startProctoringMonitoring = () => {
    console.log('🔍 Starting proctoring monitoring...');
    
    const monitoringInterval = setInterval(async () => {
      if (localVideoRef.current && canvasRef.current && isMonitoring) {
        await captureAndAnalyzeFrame();
      }
    }, 3000); // Analyze every 3 seconds

    return () => {
      clearInterval(monitoringInterval);
    };
  };

  const captureAndAnalyzeFrame = async () => {
    try {
      const video = localVideoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Capture current frame
      ctx.drawImage(video, 0, 0);
      
      // Convert to base64 for analysis
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Send to AI analysis endpoint (we'll create this next)
      const analysisResponse = await fetch('/api/monitoring/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: userData.sessionId,
          imageData,
          timestamp: Date.now(),
          roomId
        })
      });
      
      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json();
        
        if (analysis.violations && analysis.violations.length > 0) {
          handleViolationsDetected(analysis.violations);
        }
      }
      
    } catch (error) {
      console.error('Frame analysis failed:', error);
    }
  };

  const handleViolationsDetected = (newViolations) => {
    console.log('⚠️ Violations detected:', newViolations);
    
    setViolations(prev => [...prev, ...newViolations]);
    
    // Calculate score deduction
    const deduction = newViolations.reduce((acc, violation) => {
      switch (violation.severity) {
        case 'high': return acc + 15;
        case 'medium': return acc + 8;
        case 'low': return acc + 3;
        default: return acc + 5;
      }
    }, 0);
    
    setIntegrityScore(prev => Math.max(0, prev - deduction));
  };

  const handleDisconnect = () => {
    console.log('📞 Disconnecting from room...');
    disconnect();
    router.push('/');
  };

  const getConnectionStatusIcon = () => {
    switch (connectionState) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case 'connecting':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'disconnected':
      case 'failed':
        return <WifiOff className="w-4 h-4 text-red-400" />;
      default:
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'failed': return 'Connection Failed';
      default: return 'Initializing...';
    }
  };

  // Error Screen
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Connection Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={retry}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-lg transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (isInitializing || !localStream) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Setting up your video call...</h2>
          <p className="text-gray-400">Please allow camera and microphone access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getConnectionStatusIcon()}
                <span className="text-sm">{getConnectionStatusText()}</span>
              </div>
              <div className="text-sm text-gray-300">
                Room: <span className="font-mono font-bold">{roomId}</span>
              </div>
              <div className="text-sm text-gray-300">
                {userType === 'candidate' ? '👤 Candidate' : '👔 Interviewer'}: {userData.name}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isRecording && (
                <div className="flex items-center text-red-400">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">Recording</span>
                </div>
              )}
              <div className="text-sm text-gray-300">
                {sessionDuration}
              </div>
            </div>
          </div>
        </div>

        {/* Remote Video (Main View) */}
        <div className="w-full h-full bg-black relative">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Waiting for {userType === 'candidate' ? 'interviewer' : 'candidate'}
                </h3>
                <p className="text-gray-500">
                  {connectionState === 'connected' 
                    ? 'They will appear here when they join' 
                    : 'Establishing connection...'}
                </p>
              </div>
            </div>
          )}

          {/* Local Video Overlay */}
          <div className="absolute bottom-20 right-6 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              You ({userType})
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm">Camera Off</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Controls */}
        <VideoControls
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
          onDisconnect={handleDisconnect}
          userType={userType}
        />

        {/* Interviewer Recording Control */}
        {userType === 'interviewer' && (
          <div className="absolute top-20 left-4">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isRecording ? '⏹️ Stop Recording' : '⏺️ Start Recording'}
            </button>
          </div>
        )}
      </div>

      {/* Proctoring Sidebar - Only for candidates */}
      {userType === 'candidate' && (
        <MonitoringSidebar
          integrityScore={integrityScore}
          violations={violations}
          isMonitoring={isMonitoring}
          sessionDuration={sessionDuration}
        />
      )}

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ProctoringVideoRoom;

// ===============================================
// INSTALLATION STEPS - Follow these exactly:
// ===============================================

/*
STEP-BY-STEP SETUP GUIDE:

1. INSTALL DEPENDENCIES:
   npm install socket.io-client lucide-react

2. CREATE FOLDER STRUCTURE:
   mkdir -p lib/webrtc
   mkdir -p hooks
   mkdir -p components/video
   mkdir -p utils

3. CREATE FILES (copy the code above to each file):

   📁 lib/webrtc/
   ├── socketClient.js
   └── WebRTCManager.js

   📁 hooks/
   └── useWebRTC.js

   📁 components/video/
   ├── ProctoringVideoRoom.js
   ├── VideoControls.js
   └── MonitoringSidebar.js

   📁 utils/
   └── roomGenerator.js

4. UPDATE ENVIRONMENT VARIABLES (.env.local):
   NEXT_PUBLIC_SOCKET_URL=ws://localhost:3001
   MONGODB_URI=mongodb://localhost:27017/proctoring_system

5. CREATE SIGNALING SERVER:
   Create a separate Node.js project for the signaling server
   (I'll show you this next)

WHAT EACH FILE DOES:

🔌 socketClient.js: Manages WebSocket connection to signaling server
🎥 WebRTCManager.js: Handles all WebRTC peer connection logic
🪝 useWebRTC.js: React hook that wraps WebRTC functionality
📺 ProctoringVideoRoom.js: Main video call component with proctoring UI
🎛️ VideoControls.js: Video/audio controls (mic, camera, hang up)
📊 MonitoringSidebar.js: Shows integrity score and violations
🎲 roomGenerator.js: Utility functions for generating IDs

NEXT STEPS:
1. Create all these files with the provided code
2. Set up the signaling server (I'll help you next)
3. Test the video calling functionality
4. Add AI monitoring endpoints
*/