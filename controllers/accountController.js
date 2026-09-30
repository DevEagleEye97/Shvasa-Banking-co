/**
 * Account Controller
 * Handles balance inquiries and account information
 */

import { asyncHandler } from '../middleware/errorHandler.js';
import { maskAccountNumber, formatCurrency } from '../utils/index.js';

class AccountController {
  constructor(accountService) {
    this.accountService = accountService;
  }

  /**
   * Get account balance
   * GET /api/account/balance
   */
  getBalance = asyncHandler(async (req, res) => {
    const accountNumber = 'DEMO_USER';
    const balance = this.accountService.getBalance(accountNumber);
    
    res.json({
      success: true,
      data: {
        accountNumber: maskAccountNumber(balance.accountNumber),
        holderName: balance.holderName,
        balance: balance.balance,
        formattedBalance: formatCurrency(balance.balance, balance.currency),
        currency: balance.currency,
        status: balance.status,
        lastUpdated: balance.lastUpdated
      }
    });
  });

  /**
   * Get account details
   * GET /api/account/details
   */
  getAccountDetails = asyncHandler(async (req, res) => {
    const accountNumber = 'DEMO_USER';
    const details = this.accountService.getAccountDetails(accountNumber);
    
    res.json({
      success: true,
      data: {
        ...details,
        accountNumber: maskAccountNumber(details.accountNumber)
      }
    });
  });

  /**
   * Get all accounts (admin)
   * GET /api/account/list
   */
  getAllAccounts = asyncHandler(async (req, res) => {
    const accounts = this.accountService.getAllAccounts();
    
    res.json({
      success: true,
      data: accounts.map(acc => ({
        ...acc,
        accountNumber: maskAccountNumber(acc.accountNumber),
        formattedBalance: formatCurrency(acc.balance, acc.currency)
      }))
    });
  });
}

export default AccountController;