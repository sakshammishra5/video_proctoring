'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProctoringVideoRoom from '../../../components/video/ProctoringVideoRoom';

function CandidateRoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const roomId = params.roomId;
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const sessionId = searchParams.get('sessionId');

  const userData = {
    name: name || 'Candidate',
    email: email || '',
    sessionId: sessionId || '',
    userType: 'candidate'
  };

  return (
    <div className="h-screen">
      <ProctoringVideoRoom
        roomId={roomId}
        userType="candidate"
        userData={userData}
      />
    </div>
  );
}

export default function CandidateRoom() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Joining interview room...</p>
        </div>
      </div>
    }>
      <CandidateRoomContent />
    </Suspense>
  );
}
