'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ReportPage() {
  const { roomId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/reports/${roomId}/json`);
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [roomId]);

  if (loading) return <p className="p-4">Loading report...</p>;
  if (!report?.ok) return <p className="p-4 text-red-600">Error: {report?.error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Proctoring Report</h1>

        <div className="mb-6 space-y-1">
          <p><strong>Candidate:</strong> {report.candidateName}</p>
          <p><strong>Room ID:</strong> {report.roomId}</p>
          <p><strong>Duration:</strong> {report.duration}</p>
          <p><strong>Integrity Score:</strong> {report.integrityScore}/100</p>
        </div>

        <h2 className="text-xl font-semibold mb-2">Event Logs</h2>
        <div className="border rounded p-3 bg-gray-50 max-h-64 overflow-y-auto">
          {report.logs.map((log, i) => (
            <p key={i} className="text-sm mb-1">
              {new Date(log.timestamp).toLocaleTimeString()} — 
              <span className="font-semibold">[{log.type}]</span> {log.message}
            </p>
          ))}
        </div>

        {/* ✅ Download PDF Button */}
        <button
          onClick={() => window.open(`/api/reports/${roomId}/pdf`, '_blank')}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Download Report as PDF
        </button>
      </div>
    </div>
  );
}
