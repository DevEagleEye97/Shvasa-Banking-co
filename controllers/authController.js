/**
 * Authentication Controller
 * Handles PIN verification and session management
 */

import { asyncHandler } from '../middleware/errorHandler.js';
import AccountService from '../services/accountService.js';
import SessionService from '../services/sessionService.js';
import { maskAccountNumber } from '../utils/index.js';

class AuthController {
  constructor(accountService, sessionService) {
    this.accountService = accountService;
    this.sessionService = sessionService;
  }

  /**
   * Verify PIN and authenticate user
   * POST /api/auth/verify-pin
   */
  verifyPIN = asyncHandler(async (req, res) => {
    const { pin } = req.body;
    
    // Use default demo account
    const accountNumber = 'DEMO_USER';
    
    const result = this.accountService.verifyPIN(accountNumber, pin);
    
    if (result.success) {
      // Create session
      const session = this.sessionService.createSession(
        result.accountNumber,
        result.holderName
      );
      
      res.json({
        success: true,
        message: result.message,
        data: {
          authenticated: true,
          sessionId: session.id,
          accountNumber: maskAccountNumber(result.accountNumber),
          holderName: result.holderName,
          session: {
            id: session.id,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt
          }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: result.message,
        data: {
          locked: result.locked,
          remainingAttempts: result.remainingAttempts
        }
      });
    }
  });

  /**
   * Validate session
   * GET /api/auth/session
   */
  validateSession = asyncHandler(async (req, res) => {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    
    const result = this.sessionService.validateSession(sessionId);
    
    if (result.valid) {
      res.json({
        success: true,
        message: 'Session valid',
        data: {
          authenticated: true,
          sessionId: result.session.id,
          accountNumber: maskAccountNumber(result.session.accountNumber),
          holderName: result.session.holderName,
          lastActivity: result.session.lastActivity,
          expiresAt: result.session.expiresAt
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: result.message,
        data: { authenticated: false }
      });
    }
  });

  /**
   * Logout / end session
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    const sessionId = req.headers['x-session-id'];
    
    const result = this.sessionService.endSession(sessionId);
    
    res.json({
      success: result.success,
      message: result.message
    });
  });

  /**
   * Get authentication status
   * GET /api/auth/status
   */
  getAuthStatus = asyncHandler(async (req, res) => {
    const sessionId = req.headers['x-session-id'];
    const result = this.sessionService.validateSession(sessionId);
    
    res.json({
      success: true,
      data: {
        authenticated: result.valid,
        message: result.valid ? 'Authenticated' : result.message
      }
    });
  });
}

export default AuthController;