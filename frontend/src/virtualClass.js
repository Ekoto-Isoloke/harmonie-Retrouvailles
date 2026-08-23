export const VIRTUAL_CLASS_DB = 'hr_virtual_classes_db';

export function getVirtualClasses() {
  const data = localStorage.getItem(VIRTUAL_CLASS_DB);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse virtual class DB', e);
    return [];
  }
}

// Alias for convenience
export const getSessions = getVirtualClasses;

export function saveVirtualClasses(arr) {
  localStorage.setItem(VIRTUAL_CLASS_DB, JSON.stringify(arr));
}

export function createSession(sessionObj) {
  const sessions = getVirtualClasses();
  const id = crypto.randomUUID();
  const newSession = { id, participants: [], createdAt: new Date().toLocaleDateString('fr-FR'), ...sessionObj };
  sessions.push(newSession);
  saveVirtualClasses(sessions);
  return id;
}

export function recordAttendance(sessionId, participantInfo) {
  const sessions = getVirtualClasses();
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return;
  session.participants.push(participantInfo);
  saveVirtualClasses(sessions);
}
