const isBoardOwner = (user, ownerId) =>
  Boolean(user?._id) && String(user._id) === String(ownerId);

const parsePersonalFlag = (value, fallback = false) => {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return fallback;
};

/** Owner sees personal tasks; everyone else does not. */
const visibleTasksQuery = (user, ownerId) =>
  isBoardOwner(user, ownerId) ? {} : { isPersonal: { $ne: true } };

/** Reports and share links never include personal tasks. */
const publicTasksQuery = () => ({ isPersonal: { $ne: true } });

const isHiddenPersonalTask = (task, user) =>
  Boolean(task?.isPersonal) && !isBoardOwner(user, task.owner);

module.exports = {
  isBoardOwner,
  parsePersonalFlag,
  visibleTasksQuery,
  publicTasksQuery,
  isHiddenPersonalTask
};
