const assert = require('node:assert/strict');
const {
  isBoardOwner,
  parsePersonalFlag,
  visibleTasksQuery,
  publicTasksQuery,
  isHiddenPersonalTask
} = require('./workboardPersonal');

let passed = 0;
const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
};

test('only the board owner is treated as owner', () => {
  assert.equal(isBoardOwner({ _id: 'abc' }, 'abc'), true);
  assert.equal(isBoardOwner({ _id: 'abc' }, 'xyz'), false);
  assert.equal(isBoardOwner(null, 'abc'), false);
});

test('parses personal checkbox values', () => {
  assert.equal(parsePersonalFlag(true), true);
  assert.equal(parsePersonalFlag('true'), true);
  assert.equal(parsePersonalFlag(false, true), false);
  assert.equal(parsePersonalFlag(undefined, false), false);
  assert.equal(parsePersonalFlag(undefined, true), true);
});

test('hides personal tasks from anyone who is not the owner', () => {
  assert.deepEqual(visibleTasksQuery({ _id: 'owner' }, 'owner'), {});
  assert.deepEqual(visibleTasksQuery({ _id: 'guest' }, 'owner'), { isPersonal: { $ne: true } });
  assert.deepEqual(publicTasksQuery(), { isPersonal: { $ne: true } });
  assert.equal(
    isHiddenPersonalTask({ isPersonal: true, owner: 'owner' }, { _id: 'guest' }),
    true
  );
  assert.equal(
    isHiddenPersonalTask({ isPersonal: true, owner: 'owner' }, { _id: 'owner' }),
    false
  );
});

console.log(`${passed} passed`);
