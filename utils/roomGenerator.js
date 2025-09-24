export function generateRoomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
}