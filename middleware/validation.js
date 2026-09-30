/**
 * Validation schemas using simple object validation
 * Replaces Joi dependency for simplicity
 */

export const validate = (schema, data) => {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Required check
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip further validation if value is not provided and not required
    if (value === undefined || value === null) {
      continue;
    }
    
    // Type check
    if (rules.type === 'number' && isNaN(parseFloat(value))) {
      errors.push(`${field} must be a number`);
      continue;
    }
    
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
      continue;
    }
    
    // Min/Max for numbers
    if (rules.type === 'number') {
      const num = parseFloat(value);
      if (rules.min !== undefined && num < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && num > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`);
      }
    }
    
    // Pattern for strings
    if (rules.pattern && typeof value === 'string') {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        errors.push(`${field} has invalid format`);
      }
    }
    
    // Length for strings
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }
    }
    
    // Custom validator
    if (rules.validate && typeof rules.validate === 'function') {
      const result = rules.validate(value, data);
      if (result !== true) {
        errors.push(result || `${field} is invalid`);
      }
    }
  }
  
  return {
    error: errors.length > 0,
    details: errors
  };
};

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.query, ...req.params };
    const result = validate(schema, data);
    
    if (result.error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          statusCode: 400,
          details: result.details
        }
      });
    }
    
    next();
  };
};