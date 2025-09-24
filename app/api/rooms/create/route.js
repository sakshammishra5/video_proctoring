import { NextResponse } from 'next/server';
import { generateRoomId } from '../../../../utils/roomGenerator';

export async function POST(request) {
  try {
    const body = await request.json();
    const { interviewerName, interviewerEmail, videoService = 'webrtc' } = body;

    if (!interviewerName || !interviewerEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Generate room ID
    const roomId = generateRoomId();
    
    // Create room data
    const roomData = {
      roomId,
      videoService,
      interviewer: {
        name: interviewerName,
        email: interviewerEmail
      },
      createdAt: new Date(),
      status: 'active'
    };

    // TODO: Save to database
    console.log('Room created:', roomData);

    return NextResponse.json({
      success: true,
      data: {
        roomId,
        videoService,
        message: 'Room created successfully'
      }
    });

  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
