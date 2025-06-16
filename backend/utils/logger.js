const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

// Ensure logs directory exists
const logsDir = path.dirname(logFile);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] INFO: ${message}\n`;
    console.log(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
  },
  
  error: (message) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message}\n`;
    console.error(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
  },
  
  warn: (message) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARN: ${message}\n`;
    console.warn(logEntry.trim());
    fs.appendFileSync(logFile, logEntry);
  }
};

module.exports = logger;