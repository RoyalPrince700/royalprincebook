import React, { useEffect, useState } from 'react';

export const WORKBOARD_PERMISSION_OPTIONS = [
  { value: 'add_task', label: 'Add new tasks' },
  { value: 'edit_task', label: 'Edit existing tasks' },
  { value: 'delete_task', label: 'Delete tasks' },
  { value: 'update_status', label: 'Change task status' },
  { value: 'add_comment', label: 'Add comments' }
];

const WorkboardAccessGrantModal = ({ open, request, onClose, onApprove, onDeny, resolving = false }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [ownerNote, setOwnerNote] = useState('');

  useEffect(() => {
    if (!open || !request) return;
    const defaults =
      request.requestedPermissions?.length > 0
        ? request.requestedPermissions
        : WORKBOARD_PERMISSION_OPTIONS.map((option) => option.value);
    setSelectedPermissions(defaults);
    setOwnerNote('');
  }, [open, request]);

  if (!open || !request) return null;

  const togglePermission = (value) => {
    setSelectedPermissions((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  return (
    <div className="wb-confirm-backdrop" onClick={onClose}>
      <div
        className="wb-confirm wb-access-grant-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wb-access-grant-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="wb-note-meta">Access request</p>
        <h2 id="wb-access-grant-title">Grant edit access</h2>
        <p className="wb-confirm-copy">
          <strong>{request.requester?.username || 'Someone'}</strong>
          {request.requester?.email ? (
            <>
              {' '}
              <span className="wb-access-email">({request.requester.email})</span>
            </>
          ) : null}{' '}
          wants to help on your taskboard.
        </p>
        {request.message ? (
          <p className="wb-access-request-message">“{request.message}”</p>
        ) : null}

        <div className="wb-access-permissions" role="group" aria-label="Grant permissions">
          {WORKBOARD_PERMISSION_OPTIONS.map((option) => (
            <label key={option.value} className="wb-access-permission">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(option.value)}
                onChange={() => togglePermission(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <label className="wb-modal-label" htmlFor="wb-access-owner-note">
          Note to requester (optional)
        </label>
        <textarea
          id="wb-access-owner-note"
          className="wb-access-note-input"
          value={ownerNote}
          onChange={(event) => setOwnerNote(event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Optional message when approving or denying"
        />

        <div className="wb-modal-actions">
          <button
            type="button"
            className="wb-modal-danger"
            onClick={() => onDeny(ownerNote)}
            disabled={resolving}
          >
            Deny
          </button>
          <button type="button" className="wb-modal-secondary" onClick={onClose} disabled={resolving}>
            Cancel
          </button>
          <button
            type="button"
            className="wb-modal-primary"
            onClick={() => onApprove(selectedPermissions, ownerNote)}
            disabled={resolving || selectedPermissions.length === 0}
          >
            {resolving ? 'Saving…' : 'Grant access'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkboardAccessGrantModal;
