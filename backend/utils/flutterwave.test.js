const assert = require('assert');
const { parseBookIdFromTxRef, getFlutterwaveTransactionId, isSuccessfulFlutterwaveCharge, toAmount } = require('./flutterwave');

let passed = 0;
const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
};

test('parses local and mongo book ids from tx_ref', () => {
  assert.strictEqual(parseBookIdFromTxRef('1775664832194-local-leading-from-within'), 'local-leading-from-within');
  assert.strictEqual(parseBookIdFromTxRef('1775664832194-698dbfc1305664340f2f79dd'), '698dbfc1305664340f2f79dd');
  assert.strictEqual(parseBookIdFromTxRef('missing'), null);
});

test('reads transaction ids from Flutterwave callback shapes', () => {
  assert.strictEqual(getFlutterwaveTransactionId({ transaction_id: 11 }), 11);
  assert.strictEqual(getFlutterwaveTransactionId({ id: 22 }), 22);
  assert.strictEqual(getFlutterwaveTransactionId({ data: { id: 33 } }), 33);
});

test('accepts successful Flutterwave charge envelopes', () => {
  assert.strictEqual(isSuccessfulFlutterwaveCharge({ status: 'success', data: { status: 'successful' } }), true);
  assert.strictEqual(isSuccessfulFlutterwaveCharge({ status: 'successful' }), true);
  assert.strictEqual(isSuccessfulFlutterwaveCharge({ data: { status: 'successful' } }), true);
  assert.strictEqual(isSuccessfulFlutterwaveCharge({ status: 'success', data: { status: 'failed' } }), false);
});

test('coerces Flutterwave amounts', () => {
  assert.strictEqual(toAmount('1000'), 1000);
  assert.strictEqual(toAmount(1000), 1000);
  assert.strictEqual(toAmount('abc'), 0);
});

console.log(`\n${passed} flutterwave helper tests passed.`);
