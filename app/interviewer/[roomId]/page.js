'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation'; 
import JitsiMeet from "@/app/components/Jitsi/JitsiMeet";
import { useEffect, useState } from 'react';

export default function InterviewerRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const [displayName, setDisplayName] = useState('Interviewer');

  useEffect(() => {
    const nameFromUrl = searchParams.get('name');
    if (nameFromUrl) {
      setDisplayName(decodeURIComponent(nameFromUrl));
    }
  }, [searchParams]);

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      {roomId && <JitsiMeet roomName={roomId} displayName={displayName} />}

      {/* ✅ Floating Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Go to Report Page */}
        <button
          onClick={() => router.push(`/interviewer/${roomId}/report`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          View Report
        </button>

        {/* (Optional) Direct PDF Download */}
        <button
          onClick={() => window.open(`/api/reports/${roomId}/pdf`, '_blank')}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
