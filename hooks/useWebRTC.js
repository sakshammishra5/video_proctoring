import { useState, useEffect, useRef, useCallback } from 'react';
import WebRTCManager from '../lib/webrtc/WebRTCManger';

export const useWebRTC = (roomId, userType) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState('new');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const webrtcManager = useRef(null);

  const initializeWebRTC = useCallback(async () => {
    if (!roomId || !userType || isInitializing) return;
    
    setIsInitializing(true);
    setError(null);
    
    try {
      webrtcManager.current = new WebRTCManager();
      
      // Set up callbacks
      webrtcManager.current.onLocalStream = setLocalStream;
      webrtcManager.current.onRemoteStream = setRemoteStream;
      webrtcManager.current.onConnectionStateChange = setConnectionState;
      webrtcManager.current.onError = setError;
      
      // Initialize
      await webrtcManager.current.initialize(roomId, userType);
      
    } catch (error) {
      console.error('WebRTC initialization failed:', error);
      setError(error.message);
    } finally {
      setIsInitializing(false);
    }
  }, [roomId, userType, isInitializing]);

  useEffect(() => {
    initializeWebRTC();

    return () => {
      cleanup();
    };
  }, [initializeWebRTC]);

  const toggleVideo = useCallback(() => {
    if (webrtcManager.current) {
      const enabled = webrtcManager.current.toggleVideo();
      setIsVideoEnabled(enabled);
      return enabled;
    }
    return false;
  }, []);

  const toggleAudio = useCallback(() => {
    if (webrtcManager.current) {
      const enabled = webrtcManager.current.toggleAudio();
      setIsAudioEnabled(enabled);
      return enabled;
    }
    return false;
  }, []);

  const getVideoFrame = useCallback(async () => {
    if (webrtcManager.current) {
      return await webrtcManager.current.getVideoFrame();
    }
    return null;
  }, []);

  const disconnect = useCallback(() => {
    if (webrtcManager.current) {
      webrtcManager.current.disconnect();
    }
  }, []);

  const cleanup = useCallback(() => {
    disconnect();
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('new');
    setError(null);
  }, [disconnect]);

  const retry = useCallback(() => {
    cleanup();
    setTimeout(() => {
      initializeWebRTC();
    }, 1000);
  }, [cleanup, initializeWebRTC]);

  return {
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
  };
};
