/**
 * Transaction Service
 * 
 * Handles withdrawals, deposits, and transaction history.
 * Mirrors the C program logic with validation rules.
 */
class TransactionService {
  constructor(accountService) {
    this.accountService = accountService;
  }

  /**
   * Process a cash withdrawal
   * @param {string} accountNumber - Account number
   * @param {number} amount - Amount to withdraw
   * @returns {Object} Transaction result
   */
  withdraw(accountNumber, amount) {
    const account = this.accountService.accounts.get('DEMO_USER');
    
    if (!account) {
      throw new Error('Account not found');
    }

    // Validation rules (mirroring C program logic)
    if (amount <= 0) {
      throw new Error('Invalid amount. Must be greater than 0.');
    }

    if (amount % 100 !== 0) {
      throw new Error('Amount must be in multiples of Rs 100.');
    }

    if (amount > account.balance) {
      throw new Error('Insufficient balance.');
    }

    // Process withdrawal
    const previousBalance = account.balance;
    account.balance -= amount;

    // Create transaction record
    const transaction = {
      id: this.generateTransactionId(),
      type: 'WITHDRAWAL',
      amount,
      previousBalance,
      newBalance: account.balance,
      currency: account.currency,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      receiptNumber: this.generateReceiptNumber()
    };

    account.transactions.push(transaction);

    // Calculate note breakdown
    const noteBreakdown = this.calculateNoteBreakdown(amount);

    return {
      success: true,
      transaction,
      noteBreakdown,
      message: 'Withdrawal successful'
    };
  }

  /**
   * Process a deposit (bonus feature)
   * @param {string} accountNumber - Account number
   * @param {number} amount - Amount to deposit
   * @returns {Object} Transaction result
   */
  deposit(accountNumber, amount) {
    const account = this.accountService.accounts.get('DEMO_USER');
    
    if (!account) {
      throw new Error('Account not found');
    }

    if (amount <= 0) {
      throw new Error('Invalid amount. Must be greater than 0.');
    }

    if (amount % 100 !== 0) {
      throw new Error('Amount must be in multiples of Rs 100.');
    }

    const previousBalance = account.balance;
    account.balance += amount;

    const transaction = {
      id: this.generateTransactionId(),
      type: 'DEPOSIT',
      amount,
      previousBalance,
      newBalance: account.balance,
      currency: account.currency,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      receiptNumber: this.generateReceiptNumber()
    };

    account.transactions.push(transaction);

    return {
      success: true,
      transaction,
      message: 'Deposit successful'
    };
  }

  /**
   * Get transaction history
   * @param {string} accountNumber - Account number
   * @param {number} limit - Max transactions to return
   * @returns {Object} Transaction history
   */
  getTransactionHistory(accountNumber, limit = 50) {
    const account = this.accountService.accounts.get('DEMO_USER');
    
    if (!account) {
      throw new Error('Account not found');
    }

    const transactions = account.transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    return {
      accountNumber: account.accountNumber,
      transactions,
      totalTransactions: account.transactions.length,
      summary: this.generateSummary(account.transactions)
    };
  }

  /**
   * Calculate note breakdown for withdrawal amount
   * @param {number} amount - Amount to break down
   * @returns {Array} Note breakdown
   */
  calculateNoteBreakdown(amount) {
    const notes = [2000, 500, 200, 100];
    const breakdown = [];
    let remaining = amount;

    for (const note of notes) {
      if (remaining >= note) {
        const count = Math.floor(remaining / note);
        breakdown.push({ denomination: note, count });
        remaining -= count * note;
      }
    }

    return breakdown;
  }

  /**
   * Generate transaction summary
   * @param {Array} transactions - Transaction list
   * @returns {Object} Summary
   */
  generateSummary(transactions) {
    const withdrawals = transactions.filter(t => t.type === 'WITHDRAWAL');
    const deposits = transactions.filter(t => t.type === 'DEPOSIT');
    
    const totalWithdrawn = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    const totalDeposited = deposits.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions: transactions.length,
      totalWithdrawals: withdrawals.length,
      totalDeposits: deposits.length,
      totalWithdrawn,
      totalDeposited
    };
  }

  /**
   * Generate unique transaction ID
   * @returns {string} Transaction ID
   */
  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN-${timestamp}-${random}`;
  }

  /**
   * Generate receipt number
   * @returns {string} Receipt number
   */
  generateReceiptNumber() {
    const timestamp = Date.now();
    return `RCPT-${timestamp}`;
  }
}

export default TransactionService;