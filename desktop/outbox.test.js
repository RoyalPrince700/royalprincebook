const assert = require('assert');
const { classifyHttpStatus, createOutbox, loadOutboxItems } = require('./outbox');

let passed = 0;

const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
};

const sample = (id, accountKey, title = 'Write the chapter') => ({
  id,
  accountKey,
  payload: {
    title,
    description: 'While using Cursor',
    date: '2026-10-14',
    status: 'started'
  }
});

test('keeps each account queue separate', () => {
  const outbox = createOutbox();
  const id = '123e4567-e89b-42d3-a456-426614174000';
  outbox.enqueue(sample(id, 'ada@example.com'));
  outbox.enqueue(sample('123e4567-e89b-42d3-b456-426614174111', 'grace@example.com', 'Other'));
  assert.strictEqual(outbox.pendingFor('ada@example.com').length, 1);
  assert.strictEqual(outbox.pendingFor('grace@example.com')[0].payload.title, 'Other');
  assert.deepStrictEqual(outbox.pendingFor(''), []);
});

test('round-trips a saved queue and drops corrupt rows', () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  const outbox = createOutbox();
  outbox.enqueue(sample(id, 'ada@example.com', '  Ship the chapter  '));
  const restored = createOutbox(loadOutboxItems(JSON.stringify(outbox.all())));
  assert.strictEqual(restored.get(id).payload.title, 'Ship the chapter');
  assert.strictEqual(restored.get(id).payload.clientRequestId, id);
  assert.deepStrictEqual(loadOutboxItems('not-json'), []);
  assert.deepStrictEqual(loadOutboxItems(JSON.stringify([{ id: 'nope' }])), []);
});

test('keeps the personal flag on a queued task', () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  const outbox = createOutbox();
  const item = sample(id, 'ada@example.com');
  item.payload.isPersonal = true;
  outbox.enqueue(item);
  const restored = createOutbox(loadOutboxItems(JSON.stringify(outbox.all())));
  assert.strictEqual(restored.get(id).payload.isPersonal, true);
  assert.strictEqual(outbox.enqueue(sample('123e4567-e89b-42d3-b456-426614174111', 'ada@example.com')).payload.isPersonal, false);
});

test('classifies cold-start failures as retryable and bad tasks as permanent', () => {
  assert.strictEqual(classifyHttpStatus(undefined), 'retry');
  assert.strictEqual(classifyHttpStatus(500), 'retry');
  assert.strictEqual(classifyHttpStatus(401), 'auth');
  assert.strictEqual(classifyHttpStatus(400), 'permanent');
});

console.log(`${passed} passed`);
