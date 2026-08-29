import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { usePlatformDialog } from '../../contexts/PlatformDialogContext';
import {
  DEFAULT_AVATAR_ID,
  getAvatarEmoji,
  rankPodiumClass,
  WORKBOARD_AVATARS
} from '../../utils/workboardAvatars';

const RankRow = ({ row, isCurrentUser }) => (
  <article
    className={`wb-lb-row${isCurrentUser ? ' is-me' : ''} ${rankPodiumClass(row.rank)}`}
  >
    <span className="wb-lb-rank" aria-label={`Position ${row.rank}`}>
      {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank}
    </span>
    <span className="wb-lb-avatar" aria-hidden="true">
      {row.avatarEmoji || getAvatarEmoji(row.avatarId)}
    </span>
    <div className="wb-lb-user">
      <p className="wb-lb-username">
        {row.username}
        {row.isOwner ? <span className="wb-lb-owner-badge">Host</span> : null}
        {isCurrentUser ? <span className="wb-lb-you-badge">You</span> : null}
      </p>
      <p className="wb-lb-meta">
        Level {row.level}
        {' · '}
        <span aria-hidden="true">🔥</span> {row.visitStreak} day streak
      </p>
    </div>
    <div className="wb-lb-xp">
      <p className="wb-lb-xp-value">{Number(row.leaderboardXp ?? row.workboardXp ?? 0).toLocaleString()}</p>
      <p className="wb-lb-xp-label">XP</p>
    </div>
  </article>
);

const WorkboardLeaderboard = ({
  user,
  isGuest,
  onRequireSignIn,
  onAvatarUpdated,
  onBack
}) => {
  const { confirm } = usePlatformDialog();
  const myId = String(user?.id || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [owned, setOwned] = useState([]);
  const [joined, setJoined] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [createName, setCreateName] = useState('');
  const [creating, setCreating] = useState(false);
  const [inviteQuery, setInviteQuery] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSentPopup, setInviteSentPopup] = useState(null);
  const [avatarId, setAvatarId] = useState(user?.workboardAvatar || DEFAULT_AVATAR_ID);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [respondingId, setRespondingId] = useState('');

  const allBoards = useMemo(
    () => [
      ...owned.map((row) => ({ ...row, section: 'owned' })),
      ...joined.map((row) => ({ ...row, section: 'joined' }))
    ],
    [owned, joined]
  );

  const loadList = useCallback(async () => {
    if (isGuest) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/taskboard/leaderboards');
      setOwned(data.owned || []);
      setJoined(data.joined || []);
      setPendingInvites(data.pendingInvites || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leaderboards');
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  const loadDetail = useCallback(async (id) => {
    if (!id) {
      setDetail(null);
      return;
    }

    setDetailLoading(true);
    setError('');
    try {
      const { data } = await axios.get(`/taskboard/leaderboards/${id}`);
      setDetail(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leaderboard');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    setAvatarId(user?.workboardAvatar || DEFAULT_AVATAR_ID);
  }, [user?.workboardAvatar]);

  useEffect(() => {
    if (selectedId) {
      loadDetail(selectedId);
    }
  }, [selectedId, loadDetail]);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (isGuest) {
      onRequireSignIn?.();
      return;
    }

    const name = createName.trim();
    if (!name) return;

    setCreating(true);
    setError('');
    try {
      const { data } = await axios.post('/taskboard/leaderboards', { name });
      setCreateName('');
      await loadList();
      setSelectedId(data.id);
      setDetail(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create leaderboard');
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    if (!selectedId || !inviteQuery.trim()) return;

    setInviting(true);
    setError('');
    try {
      const { data } = await axios.post(`/taskboard/leaderboards/${selectedId}/invite`, {
        email: inviteQuery.trim().toLowerCase()
      });
      setInviteSentPopup({
        email: data.invite?.invitedUser?.email || inviteQuery.trim().toLowerCase(),
        username: data.invite?.invitedUser?.username || ''
      });
      setInviteQuery('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const handleRespondInvite = async (inviteId, action) => {
    setRespondingId(inviteId);
    setError('');
    try {
      const { data } = await axios.patch(`/taskboard/leaderboards/invites/${inviteId}`, {
        action
      });
      await loadList();
      if (action === 'accept' && data.leaderboard?.id) {
        setSelectedId(data.leaderboard.id);
        setDetail(data.leaderboard);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to respond to invite');
    } finally {
      setRespondingId('');
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !detail?.isOwner) return;

    const leaderboardName = detail?.name || 'this leaderboard';
    const shouldDelete = await confirm({
      theme: 'board',
      kicker: 'Delete leaderboard',
      title: 'Remove this leaderboard?',
      message: `“${leaderboardName}” will be permanently deleted. This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger'
    });
    if (!shouldDelete) return;

    setError('');
    try {
      await axios.delete(`/taskboard/leaderboards/${selectedId}`);
      setSelectedId('');
      setDetail(null);
      await loadList();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete leaderboard');
    }
  };

  const handleSaveAvatar = async (nextId) => {
    if (isGuest) {
      onRequireSignIn?.();
      return;
    }

    setSavingAvatar(true);
    setError('');
    try {
      const { data } = await axios.put('/taskboard/leaderboards/avatar', { avatarId: nextId });
      setAvatarId(nextId);
      onAvatarUpdated?.(data.user);
      if (selectedId) await loadDetail(selectedId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update avatar');
    } finally {
      setSavingAvatar(false);
    }
  };

  if (isGuest) {
    return (
      <div className="wb-lb">
        <header className="wb-lb-head">
          <div>
            <p className="wb-game-kicker">Leaderboard</p>
            <h1 className="wb-lb-title">Leaderboard</h1>
            <p className="wb-lb-sub">Sign in to create leaderboards and compete with friends.</p>
          </div>
          <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
            Back to board
          </button>
        </header>
        <div className="wb-state-panel">
          <p className="wb-state-title">Join the competition</p>
          <p className="wb-state-copy">
            Create a leaderboard, invite friends by email, and compete with earned XP.
          </p>
          <button type="button" className="wb-today-btn" onClick={onRequireSignIn}>
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wb-lb">
      <header className="wb-lb-head">
        <div>
          <p className="wb-game-kicker">Leaderboard</p>
          <h1 className="wb-lb-title">Leaderboard</h1>
          <p className="wb-lb-sub">Compete with friends using your earned XP.</p>
        </div>
        <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
          Back to board
        </button>
      </header>

      {error ? <div className="wb-error">{error}</div> : null}

      <section className="wb-lb-avatar-panel">
        <div>
          <p className="wb-game-kicker">Your avatar</p>
          <p className="wb-lb-avatar-hint">Pick how you appear on every leaderboard.</p>
        </div>
        <div className="wb-lb-avatar-grid" role="list">
          {WORKBOARD_AVATARS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`wb-lb-avatar-btn${avatarId === item.id ? ' is-active' : ''}`}
              onClick={() => handleSaveAvatar(item.id)}
              disabled={savingAvatar}
              title={item.label}
              aria-pressed={avatarId === item.id}
            >
              <span aria-hidden="true">{item.emoji}</span>
            </button>
          ))}
        </div>
      </section>

      {pendingInvites.length ? (
        <section className="wb-lb-invites">
          <p className="wb-game-kicker">Pending invites</p>
          <div className="wb-lb-invite-list">
            {pendingInvites.map((invite) => (
              <article key={invite.id} className="wb-lb-invite-card">
                <p className="wb-lb-invite-copy">
                  <span aria-hidden="true">{invite.invitedBy?.avatarEmoji || '👑'}</span>{' '}
                  <strong>{invite.invitedBy?.username || 'Someone'}</strong> invited you to{' '}
                  <strong>{invite.leaderboard?.name || 'a leaderboard'}</strong>
                </p>
                <div className="wb-lb-invite-actions">
                  <button
                    type="button"
                    className="wb-today-btn"
                    disabled={respondingId === invite.id}
                    onClick={() => handleRespondInvite(invite.id, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="wb-mode-btn"
                    disabled={respondingId === invite.id}
                    onClick={() => handleRespondInvite(invite.id, 'decline')}
                  >
                    Decline
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="wb-lb-layout">
        <aside className="wb-lb-sidebar">
          <form className="wb-lb-create" onSubmit={handleCreate}>
            <label className="wb-lb-label" htmlFor="wb-lb-create-name">
              New leaderboard
            </label>
            <div className="wb-lb-create-row">
              <input
                id="wb-lb-create-name"
                className="wb-lb-input"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                placeholder="Squad name"
                maxLength={80}
              />
              <button type="submit" className="wb-today-btn" disabled={creating || !createName.trim()}>
                {creating ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>

          {loading ? (
            <p className="wb-lb-muted">Loading leaderboards…</p>
          ) : allBoards.length === 0 ? (
            <div className="wb-state-panel is-compact">
              <p className="wb-state-title">No leaderboards yet</p>
              <p className="wb-state-copy">Create one and invite friends by email.</p>
            </div>
          ) : (
            <div className="wb-lb-board-list">
              {owned.length ? (
                <div>
                  <p className="wb-game-kicker">Yours</p>
                  {owned.map((board) => (
                    <button
                      key={board.id}
                      type="button"
                      className={`wb-lb-board-btn${selectedId === board.id ? ' is-active' : ''}`}
                      onClick={() => setSelectedId(board.id)}
                    >
                      <span className="wb-lb-board-name">{board.name}</span>
                      <span className="wb-lb-board-meta">{board.memberCount} players</span>
                    </button>
                  ))}
                </div>
              ) : null}
              {joined.length ? (
                <div>
                  <p className="wb-game-kicker">Joined</p>
                  {joined.map((board) => (
                    <button
                      key={board.id}
                      type="button"
                      className={`wb-lb-board-btn${selectedId === board.id ? ' is-active' : ''}`}
                      onClick={() => setSelectedId(board.id)}
                    >
                      <span className="wb-lb-board-name">{board.name}</span>
                      <span className="wb-lb-board-meta">
                        {board.owner?.username || 'Host'} · {board.memberCount} players
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </aside>

        <section className="wb-lb-main">
          {!selectedId ? (
            <div className="wb-state-panel">
              <p className="wb-state-title">Select a leaderboard</p>
              <p className="wb-state-copy">Choose one from the list or create a new squad.</p>
            </div>
          ) : detailLoading && !detail ? (
            <p className="wb-lb-muted">Loading leaderboard…</p>
          ) : detail ? (
            <>
              <div className="wb-lb-detail-head">
                <div>
                  <h2 className="wb-lb-detail-title">{detail.name}</h2>
                  <p className="wb-lb-sub">
                    {detail.memberCount} player{detail.memberCount === 1 ? '' : 's'} · XP earned
                    since joining this leaderboard
                  </p>
                </div>
                {detail.isOwner ? (
                  <button type="button" className="wb-mode-btn" onClick={handleDelete}>
                    Delete
                  </button>
                ) : null}
              </div>

              <form className="wb-lb-invite-form" onSubmit={handleInvite}>
                <label className="wb-lb-label" htmlFor="wb-lb-invite">
                  Invite by email
                </label>
                <div className="wb-lb-create-row">
                  <input
                    id="wb-lb-invite"
                    className="wb-lb-input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={inviteQuery}
                    onChange={(event) => setInviteQuery(event.target.value)}
                    placeholder="friend@gmail.com"
                  />
                  <button
                    type="submit"
                    className="wb-today-btn"
                    disabled={inviting || !inviteQuery.trim()}
                  >
                    {inviting ? 'Sending…' : 'Invite'}
                  </button>
                </div>
              </form>

              <div className="wb-lb-rankings">
                {(detail.rankings || []).map((row) => (
                  <RankRow
                    key={row.id}
                    row={row}
                    isCurrentUser={String(row.id) === myId}
                  />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </div>

      {inviteSentPopup ? (
        <div
          className="wb-confirm-backdrop"
          onClick={() => setInviteSentPopup(null)}
        >
          <div
            className="wb-confirm wb-lb-invite-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wb-lb-invite-sent-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="wb-game-kicker">Invite sent</p>
            <h2 id="wb-lb-invite-sent-title">Your invite is on its way</h2>
            <p className="wb-confirm-copy">
              We sent a leaderboard invite to{' '}
              <strong>{inviteSentPopup.email}</strong>
              {inviteSentPopup.username ? (
                <>
                  {' '}
                  (<span>{inviteSentPopup.username}</span>)
                </>
              ) : null}
              . They&apos;ll get an email with a link to accept on Taskboard.
            </p>
            <div className="wb-modal-actions">
              <button
                type="button"
                className="wb-today-btn"
                onClick={() => setInviteSentPopup(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WorkboardLeaderboard;
