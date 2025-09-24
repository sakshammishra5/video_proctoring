'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProctoringVideoRoom from '../../../components/video/ProctoringVideoRoom';

function InterviewerRoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const roomId = params.roomId;
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  const userData = {
    name: name || 'Interviewer',
    email: email || '',
    userType: 'interviewer'
  };

  return (
    <div className="h-screen">
      <ProctoringVideoRoom
        roomId={roomId}
        userType="interviewer"
        userData={userData}
      />
    </div>
  );
}

export default function InterviewerRoom() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading interview room...</p>
        </div>
      </div>
    }>
      <InterviewerRoomContent />
    </Suspense>
  );
}