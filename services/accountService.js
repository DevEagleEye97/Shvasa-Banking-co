/**
 * ATM Account Service
 * 
 * Manages account state, balance operations, and PIN verification.
 * In a production system, this would interface with a database.
 */
class AccountService {
  constructor() {
    // Default demo account (mirrors the C program)
    this.accounts = new Map();
    this.initializeDefaultAccount();
  }

  /**
   * Initialize the default demo account
   */
  initializeDefaultAccount() {
    this.accounts.set('DEMO_USER', {
      accountNumber: 'XXXX XXXX 4521',
      cardNumber: '4521 •••• •••• 8765',
      pin: '1234',
      holderName: 'DEMO USER',
      balance: 10000,
      currency: 'INR',
      status: 'ACTIVE',
      transactions: [],
      failedAttempts: 0,
      lockedUntil: null,
      createdAt: new Date().toISOString()
    });
  }

  /**
   * Verify PIN for an account
   * @param {string} accountNumber - Account number
   * @param {string} pin - PIN to verify
   * @returns {Object} Authentication result
   */
  verifyPIN(accountNumber, pin) {
    const account = this.accounts.get('DEMO_USER');
    
    if (!account) {
      throw new Error('Account not found');
    }

    // Check if account is locked
    if (account.lockedUntil && new Date() < new Date(account.lockedUntil)) {
      const remaining = Math.ceil((new Date(account.lockedUntil) - new Date()) / 1000);
      return {
        success: false,
        locked: true,
        message: `Account locked. Try again in ${remaining} seconds.`,
        remainingAttempts: 0
      };
    }

    // Reset lock if time has passed
    if (account.lockedUntil && new Date() >= new Date(account.lockedUntil)) {
      account.lockedUntil = null;
      account.failedAttempts = 0;
    }

    // Verify PIN
    if (pin === account.pin) {
      account.failedAttempts = 0;
      return {
        success: true,
        locked: false,
        message: 'Authentication successful',
        accountNumber: account.accountNumber,
        holderName: account.holderName
      };
    } else {
      account.failedAttempts += 1;
      const remainingAttempts = 3 - account.failedAttempts;

      // Lock account after 3 failed attempts
      if (account.failedAttempts >= 3) {
        account.lockedUntil = new Date(Date.now() + 30000).toISOString(); // 30 seconds lock
        return {
          success: false,
          locked: true,
          message: 'Account locked due to multiple failed attempts.',
          remainingAttempts: 0
        };
      }

      return {
        success: false,
        locked: false,
        message: 'Incorrect PIN',
        remainingAttempts
      };
    }
  }

  /**
   * Get account balance
   * @param {string} accountNumber - Account number
   * @returns {Object} Balance information
   */
  getBalance(accountNumber) {
    const account = this.accounts.get('DEMO_USER');
    if (!account) {
      throw new Error('Account not found');
    }

    return {
      accountNumber: account.accountNumber,
      holderName: account.holderName,
      balance: account.balance,
      currency: account.currency,
      status: account.status,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get account details
   * @param {string} accountNumber - Account number
   * @returns {Object} Account details
   */
  getAccountDetails(accountNumber) {
    const account = this.accounts.get('DEMO_USER');
    if (!account) {
      throw new Error('Account not found');
    }

    return {
      accountNumber: account.accountNumber,
      cardNumber: account.cardNumber,
      holderName: account.holderName,
      accountType: 'Premium Savings Account (Demo)',
      branchCode: 'GV-IN-007',
      netBanking: 'Enabled (256-Bit SSL Mock)',
      status: account.status,
      currency: account.currency,
      memberSince: 'January 2024'
    };
  }

  /**
   * Reset account to default state
   */
  resetAccount() {
    this.accounts.clear();
    this.initializeDefaultAccount();
    return { success: true, message: 'Account reset to default state' };
  }

  /**
   * Get all accounts (admin function)
   * @returns {Array} List of accounts
   */
  getAllAccounts() {
    return Array.from(this.accounts.values()).map(acc => ({
      accountNumber: acc.accountNumber,
      holderName: acc.holderName,
      balance: acc.balance,
      status: acc.status
    }));
  }
}

export default AccountService;