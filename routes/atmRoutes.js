/**
 * ATM Routes
 * 
 * Defines all API routes for the ATM backend.
 * Routes are organized by domain: auth, account, transactions, session, system.
 */

import { Router } from 'express';
import AccountService from '../services/accountService.js';
import TransactionService from '../services/transactionService.js';
import SessionService from '../services/sessionService.js';
import AuthController from '../controllers/authController.js';
import AccountController from '../controllers/accountController.js';
import TransactionController from '../controllers/transactionController.js';
import SystemController from '../controllers/systemController.js';

// Initialize services
const accountService = new AccountService();
const transactionService = new TransactionService(accountService);
const sessionService = new SessionService();

// Initialize controllers
const authController = new AuthController(accountService, sessionService);
const accountController = new AccountController(accountService);
const transactionController = new TransactionController(transactionService);
const systemController = new SystemController(accountService);

// Create routers
const authRouter = Router();
const accountRouter = Router();
const transactionRouter = Router();
const sessionRouter = Router();
const systemRouter = Router();

// ============================================================
// AUTH ROUTES
// ============================================================

authRouter.post('/verify-pin', (req, res) => authController.verifyPIN(req, res));
authRouter.get('/session', (req, res) => authController.validateSession(req, res));
authRouter.post('/logout', (req, res) => authController.logout(req, res));
authRouter.get('/status', (req, res) => authController.getAuthStatus(req, res));

// ============================================================
// ACCOUNT ROUTES
// ============================================================

accountRouter.get('/balance', (req, res) => accountController.getBalance(req, res));
accountRouter.get('/details', (req, res) => accountController.getAccountDetails(req, res));
accountRouter.get('/list', (req, res) => accountController.getAllAccounts(req, res));

// ============================================================
// TRANSACTION ROUTES
// ============================================================

transactionRouter.post('/withdraw', (req, res) => transactionController.withdraw(req, res));
transactionRouter.post('/deposit', (req, res) => transactionController.deposit(req, res));
transactionRouter.get('/history', (req, res) => transactionController.getHistory(req, res));
transactionRouter.get('/:id', (req, res) => transactionController.getTransactionById(req, res));

// ============================================================
// SESSION ROUTES
// ============================================================

sessionRouter.post('/start', (req, res) => {
  const { accountNumber, holderName } = req.body;
  const session = sessionService.createSession(accountNumber || 'DEMO_USER', holderName || 'Demo User');
  res.json({ success: true, data: session });
});

sessionRouter.get('/validate', (req, res) => {
  const sessionId = req.headers['x-session-id'] || req.query.sessionId;
  const result = sessionService.validateSession(sessionId);
  res.json({ success: true, data: result });
});

sessionRouter.post('/end', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const result = sessionService.endSession(sessionId);
  res.json({ success: true, data: result });
});

sessionRouter.get('/active', (req, res) => {
  res.json({ success: true, data: { count: sessionService.getActiveSessionCount() } });
});

// ============================================================
// SYSTEM ROUTES
// ============================================================

systemRouter.get('/status', (req, res) => systemController.getSystemStatus(req, res));
systemRouter.get('/health', (req, res) => systemController.healthCheck(req, res));
systemRouter.post('/reset', (req, res) => systemController.resetAccount(req, res));

// ============================================================
// EXPORT ROUTES OBJECT
// ============================================================

export const routes = {
  auth: authRouter,
  account: accountRouter,
  transactions: transactionRouter,
  session: sessionRouter,
  system: systemRouter
};

// Export services for potential reuse
export { accountService, transactionService, sessionService };

export default routes;