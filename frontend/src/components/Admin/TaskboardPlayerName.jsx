import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTaskboardDisplayName } from '../../utils/taskboardUserDisplay';

const TaskboardPlayerName = ({ user, editable = true, variant = 'kicker', className = '' }) => {
  const { updateProfile } = useAuth();
  const displayName = getTaskboardDisplayName(user);
  const canEdit = editable && Boolean(user);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) {
      setDraft(displayName);
    }
  }, [displayName, editing]);

  const handleSave = async () => {
    const next = draft.trim();
    if (!next) {
      setError('Name cannot be empty');
      return;
    }

    if (next.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    if (next === displayName) {
      setEditing(false);
      setError('');
      return;
    }

    setSaving(true);
    setError('');
    const result = await updateProfile({ username: next });
    setSaving(false);

    if (result.success) {
      setEditing(false);
      return;
    }

    setError(result.message || 'Could not save name');
  };

  const startEdit = () => {
    if (!canEdit) return;
    setDraft(displayName);
    setError('');
    setEditing(true);
  };

  if (editing) {
    return (
      <div className={`wb-player-name-edit ${className}`}>
        <input
          className="wb-player-name-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSave();
            if (event.key === 'Escape') {
              setEditing(false);
              setError('');
            }
          }}
          maxLength={50}
          autoFocus
          disabled={saving}
          aria-label="Your display name"
        />
        <div className="wb-player-name-actions">
          <button
            type="button"
            className="wb-player-name-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            className="wb-player-name-cancel"
            onClick={() => {
              setEditing(false);
              setError('');
            }}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
        {error ? <p className="wb-player-name-error">{error}</p> : null}
      </div>
    );
  }

  if (variant === 'greeting') {
    if (!canEdit) {
      return (
        <span className={`wb-player-name-greeting ${className}`}>
          {displayName} <span aria-hidden="true">👑</span>
        </span>
      );
    }

    return (
      <button
        type="button"
        className={`wb-player-name-greeting is-editable ${className}`}
        onClick={startEdit}
        title="Click to update your name"
      >
        {displayName} <span aria-hidden="true">👑</span>
      </button>
    );
  }

  if (!canEdit) {
    return <p className={`wb-game-kicker ${className}`}>{displayName}</p>;
  }

  return (
    <button
      type="button"
      className={`wb-game-kicker wb-player-name-kicker is-editable ${className}`}
      onClick={startEdit}
      title="Click to update your name"
    >
      {displayName}
    </button>
  );
};

export default TaskboardPlayerName;
