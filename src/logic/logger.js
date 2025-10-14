
const time = () => new Date().toLocaleTimeString();

export function logInput(message, details) {
  if (details !== undefined) {
    console.log(`[INPUT  ${time()}] ${message}`, details);
  } else {
    console.log(`[INPUT  ${time()}] ${message}`);
  }
}

export function logBackend(message, details) {
  if (details !== undefined) {
    console.log(`[BACKEND ${time()}] ${message}`, details);
  } else {
    console.log(`[BACKEND ${time()}] ${message}`);
  }
}

export function logInfo(message, details) {
  if (details !== undefined) {
    console.log(`[INFO   ${time()}] ${message}`, details);
  } else {
    console.log(`[INFO   ${time()}] ${message}`);
  }
}


