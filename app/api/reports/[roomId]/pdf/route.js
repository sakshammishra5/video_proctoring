import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import ReportPDF from '@/app/components/ReportPDF/ReportPDF';

function computeIntegrity(logs) {
  let score = 100;
  for (const e of logs) {
    if (e.type === 'suspicious_item' && e.message.includes('cell phone')) score -= 10;
    if (e.type === 'warning' && e.message.includes('Looking away')) score -= 5;
    if (e.type === 'critical' && e.message.includes('Multiple faces')) score -= 25;
    if (e.type === 'critical' && e.message.includes('No face')) score -= 15;
  }
  return Math.max(0, score);
}

export async function GET(req, context) {
  try {
    const { params } = await context;
    const { roomId } = params;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'proctoring_db');
    const logs = await db.collection('logs').find({ roomId }).sort({ timestamp: 1 }).toArray();

    if (!logs.length) {
      return NextResponse.json({ ok: false, error: 'No logs found' }, { status: 404 });
    }

    const candidateName = logs[0].candidateName || 'Unknown';
    const start = new Date(logs[0].timestamp);
    const end = new Date(logs[logs.length - 1].timestamp);
    const durationSec = Math.floor((end - start) / 1000);
    const duration = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;
    const integrityScore = computeIntegrity(logs);

    // ✅ Render PDF with React
    const pdfBuffer = await renderToBuffer(
      <ReportPDF
        candidateName={candidateName}
        roomId={roomId}
        duration={duration}
        integrityScore={integrityScore}
        logs={logs}
      />
    );

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report_${roomId}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF generation failed:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
