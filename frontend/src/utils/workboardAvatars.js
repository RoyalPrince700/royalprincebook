export const WORKBOARD_AVATARS = [
  { id: 'royal-crown', emoji: '👑', label: 'Royal Crown' },
  { id: 'lion', emoji: '🦁', label: 'Lion' },
  { id: 'eagle', emoji: '🦅', label: 'Eagle' },
  { id: 'wolf', emoji: '🐺', label: 'Wolf' },
  { id: 'dragon', emoji: '🐉', label: 'Dragon' },
  { id: 'knight', emoji: '⚔️', label: 'Knight' },
  { id: 'shield', emoji: '🛡️', label: 'Shield' },
  { id: 'target', emoji: '🎯', label: 'Target' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket' },
  { id: 'gem', emoji: '💎', label: 'Gem' }
];

export const DEFAULT_AVATAR_ID = 'royal-crown';

const avatarMap = new Map(WORKBOARD_AVATARS.map((item) => [item.id, item]));

export const getAvatarEmoji = (id) =>
  avatarMap.get(id)?.emoji || avatarMap.get(DEFAULT_AVATAR_ID).emoji;

export const getAvatarLabel = (id) =>
  avatarMap.get(id)?.label || avatarMap.get(DEFAULT_AVATAR_ID).label;

export const rankPodiumClass = (rank) => {
  if (rank === 1) return 'is-gold';
  if (rank === 2) return 'is-silver';
  if (rank === 3) return 'is-bronze';
  return '';
};
