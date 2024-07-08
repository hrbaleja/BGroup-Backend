const ErrorHandler = require('./errorHandler');

function captureErrorContext(error) {
    console.log(error)
  const stack = error.stack.split('\n');
  const callerLine = stack[2]; 
  const match = callerLine.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
  const functionName = match && match[1] ? match[1].split('.') : [];
  console.log("stack:",stack)
  return {
    controller: functionName[0] || 'Unknown',
    method: functionName[1] || 'Unknown'
  };
}

function createErrorWithContext(message, statusCode) {
  const error = new ErrorHandler(message, statusCode);
  const { controller, method } = captureErrorContext(error);
  error.controller = controller;
  error.method = method;
  return error;
}

module.exports = { createErrorWithContext };