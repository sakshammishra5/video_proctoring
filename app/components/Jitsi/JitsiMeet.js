// app/components/Jitsi/JitsiMeet.js

'use client'; // This is essential to make it a Client Component

import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiMeet = ({ roomName, displayName }) => {
  if (typeof window === 'undefined') {
    // Don't render on the server
    return null;
  }

  return (
    <JitsiMeeting
      roomName={roomName}
      userInfo={{
        displayName: displayName,
      }}
      configOverwrite={{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableEmailInStats: false,
        prejoinPageEnabled: false, // Disables the pre-join page
      }}
      interfaceConfigOverwrite={{
        // Hides certain buttons and features for a cleaner interface
        DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
        TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'hangup', 'chat', 'settings', 'tileview'
        ],
      }}
      getIFrameRef={(iframeRef) => {
        // You can use the iframe reference for more advanced functionalities if needed
        iframeRef.style.height = '100vh';
        iframeRef.style.width = '100%';
      }}
    />
  );
};

export default JitsiMeet;