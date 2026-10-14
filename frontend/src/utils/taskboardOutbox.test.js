import assert from 'node:assert/strict';
import {
  createTaskOutbox,
  isRetryableStatus,
  mergePendingIntoBoard,
  omitPersonalTasks
} from './taskboardOutbox.js';

let passed = 0;

const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
};

const memoryStorage = () => {
  const saved = new Map();
  return {
    getItem: (key) => (saved.has(key) ? saved.get(key) : null),
    setItem: (key, value) => saved.set(key, value)
  };
};

test('stores a task for the signed-in user and the board it belongs to', () => {
  const outbox = createTaskOutbox(memoryStorage());
  const own = outbox.enqueue('user-1', { title: 'Draft chapter', date: '2026-10-14' });
  const shared = outbox.enqueue('user-1', {
    title: 'Review notes',
    date: '2026-10-14',
    ownerId: 'owner-2'
  });

  assert.equal(own.payload.clientRequestId, own.id);
  assert.equal(outbox.listForBoard('user-1', 'user-1').length, 1);
  assert.equal(outbox.listForBoard('user-1', 'owner-2')[0].id, shared.id);
  outbox.remove('user-1', own.id);
  assert.equal(outbox.list('user-1').length, 1);
});

test('shows queued tasks on the board without dropping server tasks', () => {
  const pending = {
    id: '123e4567-e89b-42d3-a456-426614174000',
    actorId: 'user-1',
    payload: { title: 'Queued', date: '2026-10-14', status: 'started' }
  };
  const merged = mergePendingIntoBoard(
    {
      '2026-10-14': [
        { _id: 'server-1', title: 'Already saved', pendingSync: false },
        { _id: 'old-local', title: 'Stale', pendingSync: true }
      ]
    },
    [pending]
  );

  assert.deepEqual(
    merged['2026-10-14'].map((task) => task.title),
    ['Already saved', 'Queued']
  );
  assert.equal(merged['2026-10-14'][1].pendingSync, true);
});

test('keeps the personal flag on queued tasks', () => {
  const outbox = createTaskOutbox(memoryStorage());
  const item = outbox.enqueue('user-1', {
    title: 'Call mum',
    date: '2026-10-14',
    isPersonal: true
  });
  assert.equal(item.payload.isPersonal, true);
});

test('drops personal tasks from a shared board payload', () => {
  const stripped = omitPersonalTasks({
    '2026-10-14': [
      { _id: 'work', title: 'Standup', isPersonal: false },
      { _id: 'home', title: 'Doctor', isPersonal: true }
    ]
  });
  assert.deepEqual(
    stripped['2026-10-14'].map((task) => task._id),
    ['work']
  );
});

test('retries when the server is asleep and stops on a rejected task', () => {
  assert.equal(isRetryableStatus(undefined), true);
  assert.equal(isRetryableStatus(503), true);
  assert.equal(isRetryableStatus(401), true);
  assert.equal(isRetryableStatus(400), false);
});

console.log(`${passed} passed`);
