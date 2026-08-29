const WorkboardShare = require('../models/WorkboardShare');
const WorkboardAccessRequest = require('../models/WorkboardAccessRequest');
const WorkboardCollaboratorGrant = require('../models/WorkboardCollaboratorGrant');
const User = require('../models/User');
const {
  sendWorkboardAccessRequestEmail,
  sendWorkboardAccessGrantedEmail
} = require('../mailtrap/emails');
const {
  WORKBOARD_PERMISSIONS,
  normalizePermissions,
  getPermissionsForUser
} = require('../utils/workboardAccess');

const DEFAULT_REQUESTED_PERMISSIONS = ['add_task', 'edit_task', 'update_status', 'add_comment'];

const serializeRequest = (request) => ({
  id: request._id,
  status: request.status,
  shareToken: request.shareToken || '',
  message: request.message || '',
  ownerNote: request.ownerNote || '',
  requestedPermissions: normalizePermissions(request.requestedPermissions),
  grantedPermissions: normalizePermissions(request.grantedPermissions),
  createdAt: request.createdAt,
  resolvedAt: request.resolvedAt || null,
  requester: request.requester
    ? {
        id: request.requester._id || request.requester.id,
        username: request.requester.username,
        email: request.requester.email
      }
    : null
});

const createAccessRequest = async (req, res) => {
  try {
    const { shareToken, message = '' } = req.body;
    if (!shareToken) {
      return res.status(400).json({ message: 'shareToken is required' });
    }

    const share = await WorkboardShare.findOne({ token: shareToken });
    if (!share) {
      return res.status(404).json({ message: 'Share link not found' });
    }
    if (share.expiresAt && share.expiresAt.getTime() < Date.now()) {
      return res.status(410).json({ message: 'Share link has expired' });
    }

    const ownerId = share.owner.toString();
    const requesterId = req.user._id.toString();
    if (ownerId === requesterId) {
      return res.status(400).json({ message: 'You already own this taskboard' });
    }

    const existingGrant = await WorkboardCollaboratorGrant.findOne({
      owner: ownerId,
      collaborator: requesterId,
      revokedAt: null
    });
    if (existingGrant) {
      return res.status(409).json({
        message: 'You already have edit access to this taskboard',
        permissions: normalizePermissions(existingGrant.permissions)
      });
    }

    const pending = await WorkboardAccessRequest.findOne({
      owner: ownerId,
      requester: requesterId,
      status: 'pending'
    });
    if (pending) {
      return res.status(200).json({
        request: serializeRequest(pending),
        message: 'Access request already pending'
      });
    }

    const request = await WorkboardAccessRequest.create({
      owner: ownerId,
      requester: requesterId,
      shareToken,
      status: 'pending',
      requestedPermissions: DEFAULT_REQUESTED_PERMISSIONS,
      message: String(message || '').trim().slice(0, 500)
    });

    const populated = await WorkboardAccessRequest.findById(request._id).populate(
      'requester',
      'username email'
    );

    const owner = await User.findById(ownerId).select('username email');
    sendWorkboardAccessRequestEmail({
      owner,
      requester: populated?.requester,
      message: populated?.message || ''
    }).catch((emailError) => {
      console.error('Workboard access request email error:', emailError.message);
    });

    res.status(201).json({
      request: serializeRequest(populated),
      message: 'Access request sent to the board owner'
    });
  } catch (error) {
    console.error('Workboard access request create error:', error);
    res.status(500).json({ message: 'Failed to create access request' });
  }
};

const listAccessRequests = async (req, res) => {
  try {
    const ownerId = req.user._id.toString();
    const status = req.query.status || 'pending';

    const query = { owner: ownerId };
    if (status !== 'all') {
      query.status = status;
    }

    const requests = await WorkboardAccessRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('requester', 'username email');

    res.json({
      requests: requests.map(serializeRequest),
      permissionOptions: WORKBOARD_PERMISSIONS
    });
  } catch (error) {
    console.error('Workboard access request list error:', error);
    res.status(500).json({ message: 'Failed to load access requests' });
  }
};

const resolveAccessRequest = async (req, res) => {
  try {
    const { action, grantedPermissions = [], ownerNote = '' } = req.body;
    if (!['approve', 'deny'].includes(action)) {
      return res.status(400).json({ message: 'action must be approve or deny' });
    }

    const request = await WorkboardAccessRequest.findById(req.params.id).populate(
      'requester',
      'username email'
    );
    if (!request) {
      return res.status(404).json({ message: 'Access request not found' });
    }
    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the board owner can resolve requests' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been resolved' });
    }

    if (action === 'deny') {
      request.status = 'denied';
      request.ownerNote = String(ownerNote || '').trim().slice(0, 500);
      request.resolvedAt = new Date();
      request.resolvedBy = req.user._id;
      await request.save();

      return res.json({
        request: serializeRequest(request),
        message: 'Access request denied'
      });
    }

    const permissions = normalizePermissions(
      grantedPermissions.length ? grantedPermissions : request.requestedPermissions
    );
    if (!permissions.length) {
      return res.status(400).json({ message: 'Select at least one permission to grant' });
    }

    request.status = 'approved';
    request.grantedPermissions = permissions;
    request.ownerNote = String(ownerNote || '').trim().slice(0, 500);
    request.resolvedAt = new Date();
    request.resolvedBy = req.user._id;
    await request.save();

    await WorkboardCollaboratorGrant.findOneAndUpdate(
      {
        owner: request.owner,
        collaborator: request.requester._id,
        revokedAt: null
      },
      {
        owner: request.owner,
        collaborator: request.requester._id,
        permissions,
        grantedBy: req.user._id,
        sourceRequest: request._id,
        revokedAt: null,
        expiresAt: null
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    sendWorkboardAccessGrantedEmail({
      requester: request.requester,
      owner: req.user,
      permissions,
      ownerNote: request.ownerNote,
      shareToken: request.shareToken || ''
    }).catch((emailError) => {
      console.error('Workboard access granted email error:', emailError.message);
    });

    res.json({
      request: serializeRequest(request),
      permissions,
      message: 'Access granted'
    });
  } catch (error) {
    console.error('Workboard access request resolve error:', error);
    res.status(500).json({ message: 'Failed to resolve access request' });
  }
};

const listCollaborators = async (req, res) => {
  try {
    const grants = await WorkboardCollaboratorGrant.find({
      owner: req.user._id,
      revokedAt: null
    })
      .sort({ updatedAt: -1 })
      .populate('collaborator', 'username email');

    res.json({
      collaborators: grants.map((grant) => ({
        id: grant._id,
        permissions: normalizePermissions(grant.permissions),
        collaborator: grant.collaborator
          ? {
              id: grant.collaborator._id,
              username: grant.collaborator.username,
              email: grant.collaborator.email
            }
          : null,
        grantedAt: grant.updatedAt
      }))
    });
  } catch (error) {
    console.error('Workboard collaborators list error:', error);
    res.status(500).json({ message: 'Failed to load collaborators' });
  }
};

const revokeCollaborator = async (req, res) => {
  try {
    const grant = await WorkboardCollaboratorGrant.findById(req.params.id);
    if (!grant) {
      return res.status(404).json({ message: 'Collaborator grant not found' });
    }
    if (grant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the board owner can revoke access' });
    }

    grant.revokedAt = new Date();
    await grant.save();

    res.json({ message: 'Collaborator access revoked' });
  } catch (error) {
    console.error('Workboard collaborator revoke error:', error);
    res.status(500).json({ message: 'Failed to revoke collaborator access' });
  }
};

const buildShareAccessPayload = async (share, userId) => {
  if (!userId) {
    return {
      permission: 'view',
      readOnly: true,
      myPermissions: [],
      accessRequest: null
    };
  }

  const ownerId = share.owner.toString();
  const myPermissions = await getPermissionsForUser(ownerId, userId);
  if (myPermissions.length > 0) {
    return {
      permission: 'collaborate',
      readOnly: false,
      myPermissions,
      accessRequest: null
    };
  }

  const pending = await WorkboardAccessRequest.findOne({
    owner: ownerId,
    requester: userId,
    status: 'pending'
  }).select('status createdAt');

  const denied = await WorkboardAccessRequest.findOne({
    owner: ownerId,
    requester: userId,
    status: 'denied'
  })
    .sort({ resolvedAt: -1 })
    .select('status resolvedAt ownerNote');

  return {
    permission: 'view',
    readOnly: true,
    myPermissions: [],
    accessRequest: pending
      ? { status: 'pending', createdAt: pending.createdAt }
      : denied
        ? { status: 'denied', resolvedAt: denied.resolvedAt, ownerNote: denied.ownerNote || '' }
        : null
  };
};

module.exports = {
  createAccessRequest,
  listAccessRequests,
  resolveAccessRequest,
  listCollaborators,
  revokeCollaborator,
  buildShareAccessPayload,
  DEFAULT_REQUESTED_PERMISSIONS
};
