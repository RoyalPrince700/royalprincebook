import React from 'react';
import { mergeAchievementList } from '../../utils/workboardGamification';

const WorkboardAchievements = ({ achievements = [], onBack }) => {
  const list = mergeAchievementList(achievements);
  const unlockedCount = list.filter((item) => item.unlocked).length;

  return (
    <div className="wb-achievements">
      <header className="wb-achievements-head">
        <div>
          <p className="wb-game-kicker">Achievements</p>
          <h1 className="wb-achievements-title">Royal Marks</h1>
          <p className="wb-achievements-sub">
            {unlockedCount} / {list.length} unlocked
          </p>
        </div>
        <button type="button" className="wb-mode-btn is-active" onClick={onBack}>
          Back to board
        </button>
      </header>

      <div className="wb-achievements-grid">
        {list.every((item) => !item.unlocked) ? (
          <div className="wb-state-panel is-compact wb-achievements-empty">
            <p className="wb-state-title">Your first achievement is waiting.</p>
            <p className="wb-state-copy">Complete a task and the marks begin.</p>
          </div>
        ) : null}
        {list.map((item) => (
          <article
            key={item.id}
            className={`wb-achievement-card${item.unlocked ? ' is-unlocked' : ' is-locked'}`}
          >
            <p className="wb-achievement-icon" aria-hidden="true">
              {item.unlocked ? '🏆' : '◌'}
            </p>
            <h2 className="wb-achievement-name">{item.title}</h2>
            <p className="wb-achievement-desc">{item.description}</p>
            {item.unlocked && item.unlockedAt ? (
              <p className="wb-achievement-date">
                Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
              </p>
            ) : (
              <p className="wb-achievement-date">Locked</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default WorkboardAchievements;
