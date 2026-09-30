/**
 * Session Management Service
 * 
 * Manages user sessions, authentication state, and security.
 */
class SessionService {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Create a new session
   * @param {string} accountNumber - Account number
   * @param {string} holderName - Account holder name
   * @returns {Object} Session information
   */
  createSession(accountNumber, holderName) {
    const sessionId = this.generateSessionId();
    const session = {
      id: sessionId,
      accountNumber,
      holderName,
      authenticated: true,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString(),
      ip: null,
      userAgent: null
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Validate a session
   * @param {string} sessionId - Session ID
   * @returns {Object} Session validation result
   */
  validateSession(sessionId) {
    if (!sessionId) {
      return { valid: false, message: 'No session ID provided' };
    }

    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { valid: false, message: 'Session not found' };
    }

    // Check if session expired
    if (new Date() > new Date(session.expiresAt)) {
      this.sessions.delete(sessionId);
      return { valid: false, message: 'Session expired' };
    }

    // Update last activity
    session.lastActivity = new Date().toISOString();
    this.sessions.set(sessionId, session);

    return { valid: true, session };
  }

  /**
   * End a session
   * @param {string} sessionId - Session ID
   * @returns {Object} Result
   */
  endSession(sessionId) {
    if (sessionId && this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      return { success: true, message: 'Session ended' };
    }
    return { success: false, message: 'Session not found' };
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > new Date(session.expiresAt)) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Generate unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `SESS-${timestamp}-${random}`;
  }

  /**
   * Get active session count
   * @returns {number} Active session count
   */
  getActiveSessionCount() {
    return this.sessions.size;
  }
}

export default SessionService;