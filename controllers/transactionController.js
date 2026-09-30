/**
 * Transaction Controller
 * Handles withdrawals, deposits, and transaction history
 */

import { asyncHandler } from '../middleware/errorHandler.js';
import TransactionService from '../services/transactionService.js';
import { formatCurrency, maskAccountNumber } from '../utils/index.js';

class TransactionController {
  constructor(transactionService) {
    this.transactionService = transactionService;
  }

  /**
   * Process cash withdrawal
   * POST /api/transactions/withdraw
   */
  withdraw = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const accountNumber = 'DEMO_USER';
    
    const result = this.transactionService.withdraw(accountNumber, amount);
    
    res.json({
      success: true,
      message: result.message,
      data: {
        transaction: {
          id: result.transaction.id,
          type: result.transaction.type,
          amount: result.transaction.amount,
          formattedAmount: formatCurrency(result.transaction.amount, result.transaction.currency),
          previousBalance: result.transaction.previousBalance,
          newBalance: result.transaction.newBalance,
          timestamp: result.transaction.timestamp,
          status: result.transaction.status,
          receiptNumber: result.transaction.receiptNumber
        },
        noteBreakdown: result.noteBreakdown.map(note => ({
          denomination: note.denomination,
          count: note.count,
          total: note.denomination * note.count
        })),
        accountNumber: maskAccountNumber(accountNumber)
      }
    });
  });

  /**
   * Process deposit
   * POST /api/transactions/deposit
   */
  deposit = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const accountNumber = 'DEMO_USER';
    
    const result = this.transactionService.deposit(accountNumber, amount);
    
    res.json({
      success: true,
      message: result.message,
      data: {
        transaction: {
          id: result.transaction.id,
          type: result.transaction.type,
          amount: result.transaction.amount,
          formattedAmount: formatCurrency(result.transaction.amount, result.transaction.currency),
          previousBalance: result.transaction.previousBalance,
          newBalance: result.transaction.newBalance,
          timestamp: result.transaction.timestamp,
          status: result.transaction.status,
          receiptNumber: result.transaction.receiptNumber
        },
        accountNumber: maskAccountNumber(accountNumber)
      }
    });
  });

  /**
   * Get transaction history
   * GET /api/transactions/history
   */
  getHistory = asyncHandler(async (req, res) => {
    const { limit = 50, page = 1 } = req.query;
    const accountNumber = 'DEMO_USER';
    
    const result = this.transactionService.getTransactionHistory(
      accountNumber,
      parseInt(limit)
    );
    
    // Paginate transactions
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedTransactions = result.transactions.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        accountNumber: maskAccountNumber(accountNumber),
        transactions: paginatedTransactions.map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          formattedAmount: formatCurrency(tx.amount, tx.currency),
          previousBalance: tx.previousBalance,
          newBalance: tx.newBalance,
          timestamp: tx.timestamp,
          status: tx.status,
          receiptNumber: tx.receiptNumber
        })),
        summary: result.summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.totalTransactions,
          totalPages: Math.ceil(result.totalTransactions / parseInt(limit))
        }
      }
    });
  });

  /**
   * Get transaction by ID
   * GET /api/transactions/:id
   */
  getTransactionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const accountNumber = 'DEMO_USER';
    
    const account = this.transactionService.accountService.accounts.get('DEMO_USER');
    const transaction = account.transactions.find(t => t.id === id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Transaction not found',
          statusCode: 404
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        ...transaction,
        formattedAmount: formatCurrency(transaction.amount, transaction.currency)
      }
    });
  });
}

export default TransactionController;