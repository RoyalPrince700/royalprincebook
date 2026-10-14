const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const isRetryableStatus = (status) => {
  const code = Number(status);
  if (!code) return true;
  if (code === 401 || code === 408 || code === 429) return true;
  if (code >= 500) return true;
  return false;
};

const storageKey = (userId) => `taskboard-outbox:${userId}`;

const cleanPayload = (payload, id) => {
  const title = String(payload?.title || '').trim().slice(0, 160);
  const date = String(payload?.date || '');
  if (!title || !DATE_RE.test(date)) {
    throw new Error('Write the task first.');
  }
  return {
    clientRequestId: id,
    title,
    description: String(payload.description || '').trim().slice(0, 4000),
    date,
    startTime: String(payload.startTime || '').slice(0, 5),
    endTime: String(payload.endTime || '').slice(0, 5),
    status: payload.status || 'started',
    assignedBy: String(payload.assignedBy || '').trim().slice(0, 80),
    tag: String(payload.tag || '').trim().slice(0, 40),
    priority: payload.priority || 'NORMAL',
    project: payload.project || null,
    isPersonal: Boolean(payload.isPersonal),
    ...(payload.ownerId ? { ownerId: String(payload.ownerId) } : {})
  };
};

export const toPendingTask = (item) => ({
  _id: item.id,
  clientRequestId: item.id,
  pendingSync: true,
  title: item.payload.title,
  description: item.payload.description || '',
  date: item.payload.date,
  startTime: item.payload.startTime || '',
  endTime: item.payload.endTime || '',
  status: item.payload.status || 'started',
  assignedBy: item.payload.assignedBy || '',
  tag: item.payload.tag || '',
  priority: item.payload.priority || 'NORMAL',
  project: item.payload.project || null,
  isPersonal: Boolean(item.payload.isPersonal)
});

export const omitPersonalTasks = (tasksByDate) => {
  const next = {};
  Object.entries(tasksByDate || {}).forEach(([date, tasks]) => {
    next[date] = (tasks || []).filter((task) => !task?.isPersonal);
  });
  return next;
};

export const mergePendingIntoBoard = (tasksByDate, pendingItems) => {
  const next = {};
  Object.entries(tasksByDate || {}).forEach(([date, tasks]) => {
    next[date] = (tasks || []).filter((task) => !task?.pendingSync);
  });

  (pendingItems || []).forEach((item) => {
    const dateKey = item?.payload?.date;
    if (!dateKey) return;
    const list = next[dateKey] ? [...next[dateKey]] : [];
    const alreadyListed = list.some(
      (task) => task.clientRequestId === item.id || String(task._id) === item.id
    );
    if (alreadyListed) return;
    list.push(toPendingTask(item));
    next[dateKey] = list;
  });

  return next;
};

export const createTaskOutbox = (storage) => {
  const read = (userId) => {
    if (!userId) return [];
    try {
      const parsed = JSON.parse(storage.getItem(storageKey(userId)) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  };

  const write = (userId, items) => {
    try {
      storage.setItem(storageKey(userId), JSON.stringify(items));
    } catch (_error) {
      throw new Error('Could not save the task on this device.');
    }
  };

  return {
    list(userId) {
      return read(userId);
    },
    listForBoard(userId, boardOwnerId) {
      const owner = String(boardOwnerId || '');
      if (!owner) return [];
      return read(userId).filter(
        (item) => String(item.payload?.ownerId || item.actorId) === owner
      );
    },
    enqueue(userId, payload) {
      if (!userId) throw new Error('Sign in before saving a task.');
      const id = crypto.randomUUID();
      const item = {
        id,
        actorId: String(userId),
        payload: cleanPayload(payload, id)
      };
      write(userId, [...read(userId), item]);
      return item;
    },
    remove(userId, id) {
      write(
        userId,
        read(userId).filter((item) => item.id !== id)
      );
    }
  };
};

const memory = new Map();
const browserStorage =
  typeof localStorage === 'undefined'
    ? {
        getItem: (key) => (memory.has(key) ? memory.get(key) : null),
        setItem: (key, value) => memory.set(key, value)
      }
    : localStorage;

export const taskOutbox = createTaskOutbox(browserStorage);
