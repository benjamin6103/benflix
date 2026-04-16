// 📊 Logger utility for consistent error logging and debugging

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const isDevelopment = import.meta.env.DEV;

const formatLog = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  return { prefix, message, data };
};

const logger = {
  debug: (message, data) => {
    if (isDevelopment) {
      const { prefix } = formatLog(LOG_LEVELS.DEBUG, message, data);
      console.log(`${prefix} ${message}`, data || '');
    }
  },

  info: (message, data) => {
    const { prefix } = formatLog(LOG_LEVELS.INFO, message, data);
    console.info(`${prefix} ${message}`, data || '');
  },

  warn: (message, data) => {
    const { prefix } = formatLog(LOG_LEVELS.WARN, message, data);
    console.warn(`${prefix} ${message}`, data || '');
  },

  error: (message, error, data) => {
    const { prefix } = formatLog(LOG_LEVELS.ERROR, message, data);
    console.error(`${prefix} ${message}`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
      ...data
    });
    
    // Optional: Send to error tracking service in production
    if (!isDevelopment && error instanceof Error) {
      // Placeholder for external error tracking (e.g., Sentry, LogRocket)
      // sendToErrorTrackingService(error, data);
    }
  },

  group: (label, callback) => {
    if (isDevelopment) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },
};

export default logger;
