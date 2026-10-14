const assert = require('assert');
const { normalizeClientRequestId } = require('./clientRequestId');

let passed = 0;

const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
};

test('ignores an absent client request id', () => {
  assert.strictEqual(normalizeClientRequestId(undefined), null);
  assert.strictEqual(normalizeClientRequestId(null), null);
  assert.strictEqual(normalizeClientRequestId(''), null);
});

test('accepts a version 4 uuid', () => {
  const result = normalizeClientRequestId('123E4567-E89B-42D3-A456-426614174000');
  assert.deepStrictEqual(result, { id: '123e4567-e89b-42d3-a456-426614174000' });
});

test('rejects anything that is not a version 4 uuid', () => {
  assert.deepStrictEqual(normalizeClientRequestId('task-1'), {
    error: 'Invalid clientRequestId'
  });
  assert.deepStrictEqual(normalizeClientRequestId('123e4567-e89b-12d3-a456-426614174000'), {
    error: 'Invalid clientRequestId'
  });
});

console.log(`${passed} passed`);
