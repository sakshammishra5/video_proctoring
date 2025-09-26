'use client';
import { useParams, useSearchParams } from 'next/navigation';
import JitsiMeet from '@/app/components/Jitsi/JitsiMeet';
import ProctoringLayer from '@/app/components/Proctoring/ProctoringLayer';
import { useEffect, useState } from 'react';

export default function CandidateRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const [displayName, setDisplayName] = useState('Candidate');

  useEffect(() => {
    const n = searchParams.get('name');
    if (n) setDisplayName(decodeURIComponent(n));
  }, [searchParams]);


  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {roomId && <JitsiMeet roomName={roomId} displayName={displayName} />}
      <ProctoringLayer roomId={roomId} candidateName={displayName} />
    </div>
  );
}
