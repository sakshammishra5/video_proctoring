// app/api/logs/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || !body.roomId || !body.candidateName || !body.type || !body.message) {
      return NextResponse.json({ ok: false, error: 'Invalid log payload' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'proctoring_db');

    const doc = {
      roomId: body.roomId,
      candidateName: body.candidateName,
      type: body.type,
      message: body.message,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    const res = await db.collection('logs').insertOne(doc);

    return NextResponse.json({ ok: true, id: res.insertedId });
  } catch (err) {
    console.error('Error saving log:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    if (!roomId) {
      return NextResponse.json({ ok: false, error: 'roomId is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'proctoring_db');

    const logs = await db.collection('logs').find({ roomId }).sort({ timestamp: 1 }).toArray();

    return NextResponse.json({ ok: true, logs });
  } catch (err) {
    console.error('Error fetching logs:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
