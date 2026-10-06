const assert = require('assert');
const { isValidDesktopPort, signDesktopState, readDesktopPort } = require('./desktopAuthState');

const secret = 'desktop-auth-test-secret';
let passed = 0;

const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
};

test('accepts user-level ports only', () => {
  assert.strictEqual(isValidDesktopPort(43123), true);
  assert.strictEqual(isValidDesktopPort(80), false);
  assert.strictEqual(isValidDesktopPort(70000), false);
});

test('round-trips a signed desktop port', () => {
  const state = signDesktopState(43123, secret);
  assert.strictEqual(readDesktopPort(state, secret), 43123);
});

test('rejects a tampered desktop port', () => {
  const state = signDesktopState(43123, secret);
  const [payload] = state.split('.');
  const swapped = `${payload}.not-the-signature`;
  assert.strictEqual(readDesktopPort(swapped, secret), null);
});

test('rejects a different secret', () => {
  const state = signDesktopState(43123, secret);
  assert.strictEqual(readDesktopPort(state, 'other-secret'), null);
});

console.log(`${passed} passed`);
