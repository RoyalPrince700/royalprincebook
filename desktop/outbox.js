const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const classifyHttpStatus = (status) => {
  const code = Number(status);
  if (!code) return 'retry';
  if (code === 401) return 'auth';
  if (code === 408 || code === 429 || code >= 500) return 'retry';
  if (code >= 400 && code < 500) return 'permanent';
  return 'retry';
};

const normalizeItem = (item) => {
  if (!item || typeof item !== 'object') return null;
  const id = String(item.id || '').trim().toLowerCase();
  if (!UUID_RE.test(id)) return null;
  const payload = item.payload;
  if (!payload || typeof payload !== 'object') return null;
  const title = String(payload.title || '').trim().slice(0, 160);
  const date = String(payload.date || '');
  if (!title || !DATE_RE.test(date)) return null;
  return {
    id,
    accountKey: String(item.accountKey || '').trim().toLowerCase(),
    payload: {
      clientRequestId: id,
      title,
      description: String(payload.description || '').trim().slice(0, 4000),
      date,
      status: 'started',
      isPersonal: payload.isPersonal === true
    }
  };
};

const loadOutboxItems = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeItem).filter(Boolean);
  } catch (_error) {
    return [];
  }
};

const createOutbox = (items = []) => {
  let list = items.map(normalizeItem).filter(Boolean);

  return {
    all: () => list.slice(),
    get(id) {
      const key = String(id || '').toLowerCase();
      return list.find((item) => item.id === key) || null;
    },
    pendingFor(accountKey) {
      const key = String(accountKey || '').trim().toLowerCase();
      if (!key) return [];
      return list.filter((item) => item.accountKey === key);
    },
    enqueue(item) {
      const normalized = normalizeItem(item);
      if (!normalized || !normalized.accountKey) {
        throw new Error('Invalid queued task');
      }
      list = list.filter((entry) => entry.id !== normalized.id);
      list.push(normalized);
      return normalized;
    },
    remove(id) {
      const key = String(id || '').toLowerCase();
      list = list.filter((item) => item.id !== key);
    }
  };
};

module.exports = {
  classifyHttpStatus,
  createOutbox,
  loadOutboxItems
};
