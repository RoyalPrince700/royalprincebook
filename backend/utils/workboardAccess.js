const WorkboardCollaboratorGrant = require('../models/WorkboardCollaboratorGrant');

const WORKBOARD_PERMISSIONS = [
  'add_task',
  'edit_task',
  'delete_task',
  'update_status',
  'add_comment'
];

const PERMISSION_LABELS = {
  add_task: 'Add new tasks',
  edit_task: 'Edit existing tasks',
  delete_task: 'Delete tasks',
  update_status: 'Change task status',
  add_comment: 'Add comments'
};

const normalizePermissions = (permissions = []) => {
  if (!Array.isArray(permissions)) return [];
  return [...new Set(permissions.filter((key) => WORKBOARD_PERMISSIONS.includes(key)))];
};

const getActiveGrant = async (ownerId, collaboratorId) => {
  if (!ownerId || !collaboratorId) return null;
  if (String(ownerId) === String(collaboratorId)) return null;

  return WorkboardCollaboratorGrant.findOne({
    owner: ownerId,
    collaborator: collaboratorId,
    revokedAt: null,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
  }).lean();
};

const getPermissionsForUser = async (ownerId, userId) => {
  if (!ownerId || !userId) return [];
  if (String(ownerId) === String(userId)) {
    return [...WORKBOARD_PERMISSIONS];
  }

  const grant = await getActiveGrant(ownerId, userId);
  return normalizePermissions(grant?.permissions || []);
};

const hasWorkboardPermission = async (ownerId, userId, permission) => {
  const permissions = await getPermissionsForUser(ownerId, userId);
  return permissions.includes(permission);
};

const canCollaborateOnBoard = async (ownerId, userId) => {
  const permissions = await getPermissionsForUser(ownerId, userId);
  return permissions.length > 0;
};

module.exports = {
  WORKBOARD_PERMISSIONS,
  PERMISSION_LABELS,
  normalizePermissions,
  getActiveGrant,
  getPermissionsForUser,
  hasWorkboardPermission,
  canCollaborateOnBoard
};
