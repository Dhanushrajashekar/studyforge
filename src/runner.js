import { getFunctionName } from './challenges.js';
// Executes code inside a unique sandboxed, opaque-origin iframe.
// No allow-same-origin or direct parent document access. The frame also uses a restrictive CSP. Do not treat this as a hardened code-execution sandbox.
// The frame is removed after the result or timeout. Not a hardened server-side sandbox.
export function runChallenge(challenge, code, timeoutMs = 2500) {
  return new Promise(resolve => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.display = 'none';
    const token = crypto.randomUUID();
    let finished = false;
    const cleanup = result => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      iframe.remove();
      resolve(result);
    };
    const onMessage = event => {
      if (event.source !== iframe.contentWindow || event.data?.token !== token) return;
      cleanup(event.data.result);
    };
    const timer = setTimeout(() => cleanup({ error: 'Time limit exceeded. Check for an infinite loop.', results: [] }), timeoutMs);
    window.addEventListener('message', onMessage);
    const functionName = getFunctionName(challenge.starter);
    const tests = challenge.tests.map(t => ({args: t.args, expected: t.expected}));
    const payload = JSON.stringify({ token, code, functionName, tests }).replace(/</g, '\\u003c');
    iframe.srcdoc = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; form-action 'none'; base-uri 'none'"><script>
      const payload = ${payload};
      const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
      const stringify = value => { try { return JSON.stringify(value); } catch { return String(value); } };
      try {
        const fn = new Function(payload.code + '\\n;return typeof ' + payload.functionName + ' === "function" ? ' + payload.functionName + ' : undefined;')();
        if (typeof fn !== 'function') throw new Error('Define the function ' + payload.functionName + ' to run the tests.');
        const results = payload.tests.map((t, i) => {
          try {
            const actual = fn(...structuredClone(t.args));
            return { number: i + 1, passed: same(actual, t.expected), expected: stringify(t.expected), actual: stringify(actual) };
          } catch(e) { return { number: i + 1, passed: false, expected: stringify(t.expected), actual: 'Error: ' + String(e.message || e) }; }
        });
        parent.postMessage({ token: payload.token, result: { results } }, '*');
      } catch (e) { parent.postMessage({ token: payload.token, result: {error: String(e.message || e), results:[]} }, '*'); }
    <\/script>`;
    document.body.append(iframe);
  });
}
