const assert = require('assert');
const {
  getLocalAliasIdsForTitle,
  expandBookAccessIds,
  resolveBookByIdOrAlias
} = require('./bookAliases');

let passed = 0;

const test = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
};

test('maps Build with AI titles to the local alias id', () => {
  const aliases = getLocalAliasIdsForTitle(
    'Build with AI: From Zero to Full-Stack Developer with Cursor'
  );
  assert.deepStrictEqual(aliases, ['local-build-with-ai']);
});

test('maps Leading from Within titles to the local alias id', () => {
  const aliases = getLocalAliasIdsForTitle('Leading from Within: Mastering Self to Impact Others');
  assert.deepStrictEqual(aliases, ['local-leading-from-within']);
});

test('expands purchased mongo ids with matching local alias ids', () => {
  const mongoId = '674abc123def456789012345';
  const expanded = expandBookAccessIds([mongoId], [
    { _id: mongoId, title: 'Build with AI: From Zero to Full-Stack Developer with Cursor' }
  ]);

  assert.ok(expanded.includes(mongoId));
  assert.ok(expanded.includes('local-build-with-ai'));
  assert.strictEqual(expanded.length, 2);
});

test('resolveBookByIdOrAlias resolves local ids through title match', async () => {
  const mongoId = '674abc123def456789012346';
  const mockBook = {
    _id: mongoId,
    title: 'Build with AI: From Zero to Full-Stack Developer with Cursor',
    price: 1000
  };

  const Book = {
    find: async () => [mockBook],
    findById: async (id) => (String(id) === mongoId ? mockBook : null)
  };

  const resolvedFromLocal = await resolveBookByIdOrAlias('local-build-with-ai', Book);
  assert.strictEqual(resolvedFromLocal._id, mongoId);

  const resolvedFromMongo = await resolveBookByIdOrAlias(mongoId, Book);
  assert.strictEqual(resolvedFromMongo._id, mongoId);
});

test('resolveBookByIdOrAlias returns null when no matching book exists', async () => {
  const Book = {
    find: async () => [],
    findById: async () => null
  };

  const resolved = await resolveBookByIdOrAlias('local-build-with-ai', Book);
  assert.strictEqual(resolved, null);
});

console.log(`\n${passed} book access tests passed.`);
