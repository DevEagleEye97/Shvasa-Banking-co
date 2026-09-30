/**
 * Utility functions for the ATM backend
 */

/**
 * Format currency amount with proper formatting
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  
  const symbol = symbols[currency] || currency;
  const formattedAmount = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${symbol}${formattedAmount}`;
};

/**
 * Sanitize account number for display (show only last 4 digits)
 * @param {string} accountNumber - Full account number
 * @returns {string} Masked account number
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const cleaned = accountNumber.replace(/[^0-9]/g, '');
  const lastFour = cleaned.slice(-4);
  return `XXXX XXXX ${lastFour}`;
};

/**
 * Generate a random transaction ID
 * @returns {string} Transaction ID
 */
export const generateTransactionId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}`.toUpperCase();
};

/**
 * Validate amount is a positive number
 * @param {any} amount - Amount to validate
 * @returns {boolean} True if valid
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Delay execution for a given milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get current IST timestamp
 * @returns {string} ISO timestamp in IST
 */
export const getISTTimestamp = () => {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * Calculate processing time between two timestamps
 * @param {string} start - Start timestamp
 * @param {string} end - End timestamp
 * @returns {number} Duration in milliseconds
 */
export const calculateDuration = (start, end) => {
  return new Date(end).getTime() - new Date(start).getTime();
};

/**
 * Format duration in human-readable format
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

/**
 * Truncate string to a maximum length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};