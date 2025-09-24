import socketClient from './socketClient';

class WebRTCManager {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.roomId = null;
    this.userType = null;
    this.isInitialized = false;

    // Callbacks
    this.onLocalStream = null;
    this.onRemoteStream = null;
    this.onConnectionStateChange = null;
    this.onError = null;

    // State tracking
    this.connectionState = 'new';
    this.iceCandidates = [];
  }

  async initialize(roomId, userType) {
    try {
      console.log(`🚀 Initializing WebRTC for ${userType} in room ${roomId}`);
      
      this.roomId = roomId;
      this.userType = userType;

      // Connect to signaling server
      socketClient.connect();
      
      // Wait for socket connection
      await this.waitForSocketConnection();
      
      // Create peer connection
      this.createPeerConnection();
      
      // Set up signaling listeners
      this.setupSignalingListeners();
      
      // Get user media
      await this.getUserMedia();
      
      // Join room
      this.joinRoom();
      
      this.isInitialized = true;
      console.log('✅ WebRTC Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ WebRTC initialization failed:', error);
      this.onError?.('Failed to initialize video call: ' + error.message);
      throw error;
    }
  }

  waitForSocketConnection(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (socketClient.isConnected) {
        resolve();
        return;
      }

      const timer = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, timeout);

      socketClient.on('connect', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  createPeerConnection() {
    const config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.relay.metered.ca:80' }
      ],
      iceCandidatePoolSize: 10
    };

    this.peerConnection = new RTCPeerConnection(config);

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('📺 Remote stream received');
      this.remoteStream = event.streams[0];
      this.onRemoteStream?.(this.remoteStream);
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate');
        socketClient.emit('ice-candidate', {
          roomId: this.roomId,
          candidate: event.candidate
        });
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      console.log('🔗 Connection state changed:', state);
      this.connectionState = state;
      this.onConnectionStateChange?.(state);

      if (state === 'failed') {
        this.onError?.('Connection failed. Please refresh and try again.');
      }
    };

    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      const iceState = this.peerConnection.iceConnectionState;
      console.log('🧊 ICE connection state:', iceState);
      
      if (iceState === 'failed') {
        console.log('🔄 ICE connection failed, attempting restart');
        this.peerConnection.restartIce();
      }
    };
  }

  async getUserMedia() {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280, max: 1920, min: 640 },
          height: { ideal: 720, max: 1080, min: 480 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      };

      console.log('🎥 Requesting user media...');
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        console.log('➕ Adding track:', track.kind);
        this.peerConnection.addTrack(track, this.localStream);
      });

      console.log('✅ Local stream obtained');
      this.onLocalStream?.(this.localStream);

      return this.localStream;
      
    } catch (error) {
      console.error('❌ Failed to get user media:', error);
      
      let errorMessage = 'Camera/microphone access denied. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera and microphone access and refresh the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera or microphone found on this device.';
      } else {
        errorMessage += 'Please check your camera and microphone settings.';
      }
      
      this.onError?.(errorMessage);
      throw new Error(errorMessage);
    }
  }

  joinRoom() {
    console.log(`👥 Joining room ${this.roomId} as ${this.userType}`);
    socketClient.emit('join-room', {
      roomId: this.roomId,
      userType: this.userType
    });
  }

  setupSignalingListeners() {
    // Room joined confirmation
    socketClient.on('room-joined', (data) => {
      console.log('✅ Successfully joined room:', data);
    });

    // Another user joined (interviewer will get this when candidate joins)
    socketClient.on('user-joined', async (data) => {
      console.log('👤 User joined:', data);
      
      if (this.userType === 'interviewer' && data.userType === 'candidate') {
        console.log('📞 Interviewer initiating call to candidate');
        await this.createOffer();
      }
    });

    // Handle offer (candidate receives this from interviewer)
    socketClient.on('offer', async (data) => {
      console.log('📨 Received offer');
      try {
        await this.peerConnection.setRemoteDescription(data.offer);
        
        // Process any queued ICE candidates
        for (const candidate of this.iceCandidates) {
          await this.peerConnection.addIceCandidate(candidate);
        }
        this.iceCandidates = [];
        
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        
        console.log('📤 Sending answer');
        socketClient.emit('answer', {
          roomId: this.roomId,
          answer: answer
        });
      } catch (error) {
        console.error('❌ Error handling offer:', error);
        this.onError?.('Failed to establish connection');
      }
    });

    // Handle answer (interviewer receives this from candidate)
    socketClient.on('answer', async (data) => {
      console.log('📨 Received answer');
      try {
        await this.peerConnection.setRemoteDescription(data.answer);
        
        // Process any queued ICE candidates
        for (const candidate of this.iceCandidates) {
          await this.peerConnection.addIceCandidate(candidate);
        }
        this.iceCandidates = [];
      } catch (error) {
        console.error('❌ Error handling answer:', error);
        this.onError?.('Failed to establish connection');
      }
    });

    // Handle ICE candidates
    socketClient.on('ice-candidate', async (data) => {
      console.log('🧊 Received ICE candidate');
      try {
        if (this.peerConnection.remoteDescription) {
          await this.peerConnection.addIceCandidate(data.candidate);
        } else {
          // Queue ICE candidates if remote description not set yet
          this.iceCandidates.push(data.candidate);
        }
      } catch (error) {
        console.error('❌ Error adding ICE candidate:', error);
      }
    });

    // Handle user left
    socketClient.on('user-left', (data) => {
      console.log('👋 User left:', data);
      this.onConnectionStateChange?.('disconnected');
    });

    // Handle errors
    socketClient.on('error', (error) => {
      console.error('❌ Signaling error:', error);
      this.onError?.(error.message || 'Connection error');
    });
  }

  async createOffer() {
    try {
      console.log('📞 Creating offer');
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      
      console.log('📤 Sending offer');
      socketClient.emit('offer', {
        roomId: this.roomId,
        offer: offer
      });
    } catch (error) {
      console.error('❌ Error creating offer:', error);
      this.onError?.('Failed to initiate call');
    }
  }

  // Control methods
  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        console.log('📹 Video toggled:', videoTrack.enabled ? 'ON' : 'OFF');
        return videoTrack.enabled;
      }
    }
    return false;
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        console.log('🎤 Audio toggled:', audioTrack.enabled ? 'ON' : 'OFF');
        return audioTrack.enabled;
      }
    }
    return false;
  }

  getVideoFrame() {
    // For AI monitoring - capture current video frame
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        const canvas = document.createElement('canvas');
        const video = document.createElement('video');
        video.srcObject = this.localStream;
        
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
        });
      }
    }
    return null;
  }

  disconnect() {
    console.log('🔌 Disconnecting WebRTC');
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log('⏹️ Stopped track:', track.kind);
      });
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Disconnect socket
    socketClient.disconnect();

    this.isInitialized = false;
    this.connectionState = 'closed';
    
    console.log('✅ WebRTC disconnected');
  }
}

export default WebRTCManager;