/**
 * Request logging middleware
 * Logs incoming requests with timing and metadata
 */
export const requestLogger = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Capture original send
    const originalSend = res.send;
    let responseBody;

    res.send = function (data) {
      responseBody = data;
      return originalSend.apply(res, arguments);
    };

    // Log after response finishes
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      };

      if (res.statusCode >= 400) {
        logger.warn('Request failed', logData);
      } else {
        logger.info('Request completed', logData);
      }
    });

    next();
  };
};

/**
 * Performance monitoring middleware
 * Adds response time header and logs slow requests
 */
export const performanceLogger = (thresholdOrReq = 500, res = null, next = null) => {
  // Direct middleware usage: app.use(performanceLogger)
  if (typeof next === 'function') {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1e6;
      if (duration > 500) {
        console.warn(`⚠️  Slow request: ${thresholdOrReq.method} ${thresholdOrReq.originalUrl} - ${duration.toFixed(2)}ms`);
      }
    });
    return next();
  }

  // Factory usage: app.use(performanceLogger(500))
  const threshold = typeof thresholdOrReq === 'number' ? thresholdOrReq : 500;
  return (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1e6; // Convert to milliseconds

      if (duration > threshold) {
        console.warn(`⚠️  Slow request: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
      }
    });

    next();
  };
};

/**
 * Custom logger wrapper for consistent logging
 */
export const createLogger = (winstonLogger) => {
  return {
    info: (message, meta) => winstonLogger.info(message, meta),
    warn: (message, meta) => winstonLogger.warn(message, meta),
    error: (message, meta) => winstonLogger.error(message, meta),
    debug: (message, meta) => winstonLogger.debug(message, meta)
  };
};