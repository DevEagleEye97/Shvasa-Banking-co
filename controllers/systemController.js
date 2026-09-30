/**
 * System Controller
 * Handles system status, health checks, and admin operations
 */

import { asyncHandler } from '../middleware/errorHandler.js';
import AccountService from '../services/accountService.js';

class SystemController {
  constructor(accountService) {
    this.accountService = accountService;
    this.startTime = Date.now();
  }

  /**
   * Get system status
   * GET /api/system/status
   */
  getSystemStatus = asyncHandler(async (req, res) => {
    const uptime = Date.now() - this.startTime;
    
    res.json({
      success: true,
      data: {
        status: 'OPERATIONAL',
        service: 'Shvasa ATM Backend',
        version: '1.0.0',
        uptime: `${Math.floor(uptime / 1000)}s`,
        uptimeMs: uptime,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB'
        },
        accounts: {
          total: this.accountService.getAllAccounts().length,
          active: this.accountService.getAllAccounts().filter(a => a.status === 'ACTIVE').length
        }
      }
    });
  });

  /**
   * Reset demo account
   * POST /api/system/reset
   */
  resetAccount = asyncHandler(async (req, res) => {
    const result = this.accountService.resetAccount();
    
    res.json({
      success: result.success,
      message: result.message,
      data: {
        accountNumber: 'XXXX XXXX 4521',
        balance: 10000,
        currency: 'INR',
        status: 'ACTIVE',
        resetAt: new Date().toISOString()
      }
    });
  });

  /**
   * Health check endpoint
   * GET /api/system/health
   */
  healthCheck = asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'HEALTHY',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime
      }
    });
  });
}

export default SystemController;