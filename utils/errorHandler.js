class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.controller = 'Unknown';
    this.method = 'Unknown';

    Error.captureStackTrace(this, this.constructor);

    // Extract controller (file name) and method names from the stack trace
    const stackLines = this.stack.split('\n');
    if (stackLines.length > 1) {
      const callerLine = stackLines[1];
      let match = callerLine.match(/at\s+(?:(\w+)\.)?(\w+)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        const fullPath = match[3];
        const pathParts = fullPath.split(/[\\/]/); // Split by '/' or '\'
        this.controller = pathParts[pathParts.length - 1].replace('.js', '');
        this.method = match[2];
      } else {
        // Fallback regex for other stack trace formats
        match = callerLine.match(/at\s+(.+?):(\d+):(\d+)/);
        if (match) {
          const fullPath = match[1];
          const pathParts = fullPath.split(/[\\/]/);
          this.controller = pathParts[pathParts.length - 1].replace('.js', '');
        }
      }
    }
  }
}

module.exports = ErrorHandler;