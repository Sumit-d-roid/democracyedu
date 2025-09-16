// Browser console logger that sends logs to server for debugging
let originalConsole: any = {};

// Store original console methods
['log', 'error', 'warn', 'info'].forEach((method) => {
  originalConsole[method] = console[method as keyof Console];
});

// Function to send logs to server
async function sendLogToServer(level: string, message: string, error?: any) {
  try {
    await fetch('/api/v1/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level,
        message: typeof message === 'string' ? message : JSON.stringify(message),
        error: error ? error.stack || error.toString() : undefined,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {
    // Silently fail if server logging fails
  }
}

// Override console methods to also log to server
export function enableServerLogging() {
  console.log = (...args: any[]) => {
    originalConsole.log.apply(console, args);
    sendLogToServer('log', args.join(' '));
  };

  console.error = (...args: any[]) => {
    originalConsole.error.apply(console, args);
    sendLogToServer('error', args.join(' '), args[0]);
  };

  console.warn = (...args: any[]) => {
    originalConsole.warn.apply(console, args);
    sendLogToServer('warn', args.join(' '));
  };

  console.info = (...args: any[]) => {
    originalConsole.info.apply(console, args);
    sendLogToServer('info', args.join(' '));
  };

  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    sendLogToServer('error', 'Unhandled Error: ' + event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack || event.error?.toString(),
    });
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    sendLogToServer('error', 'Unhandled Promise Rejection: ' + event.reason, {
      reason: event.reason?.stack || event.reason?.toString(),
    });
  });

  console.log('🔍 Server logging enabled - browser console will be mirrored to server terminal');
}

// Restore original console methods
export function disableServerLogging() {
  Object.keys(originalConsole).forEach((method) => {
    (console as any)[method] = originalConsole[method];
  });
}
