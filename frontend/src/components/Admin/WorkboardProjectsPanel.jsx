import React, { useMemo, useState } from 'react';
import { calculateObjectiveProgress, calculateProjectProgress } from '../../utils/workboardGamification';

const WorkboardProjectsPanel = ({
  projects = [],
  objectives = [],
  weekStart,
  canEdit,
  onCreateProject,
  onCompleteProject,
  onCreateObjective,
  onUpdateObjective,
  onClose,
  onOpenTask
}) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [objectiveForm, setObjectiveForm] = useState({
    title: '',
    category: '',
    target: '50',
    current: '0'
  });
  const [saving, setSaving] = useState(false);

  const activeProjects = useMemo(
    () => projects.filter((project) => project.status !== 'completed'),
    [projects]
  );
  const weekObjectives = useMemo(
    () => objectives.filter((row) => row.weekStart === weekStart),
    [objectives, weekStart]
  );

  const submitProject = async (event) => {
    event.preventDefault();
    if (!canEdit || !projectTitle.trim() || saving) return;
    setSaving(true);
    try {
      await onCreateProject?.(projectTitle.trim());
      setProjectTitle('');
    } finally {
      setSaving(false);
    }
  };

  const submitObjective = async (event) => {
    event.preventDefault();
    if (!canEdit || !objectiveForm.title.trim() || saving) return;
    setSaving(true);
    try {
      await onCreateObjective?.({
        title: objectiveForm.title.trim(),
        category: objectiveForm.category.trim(),
        target: Number(objectiveForm.target) || 1,
        current: Number(objectiveForm.current) || 0,
        weekStart
      });
      setObjectiveForm({ title: '', category: '', target: '50', current: '0' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wb-projects-panel">
      <header className="wb-projects-head">
        <div>
          <p className="wb-game-kicker">Boss Battles</p>
          <h2 className="wb-projects-title">Projects & Weekly Objectives</h2>
        </div>
        <button type="button" className="wb-mode-btn" onClick={onClose}>
          Close
        </button>
      </header>

      <div className="wb-projects-layout">
        <section className="wb-dash-card">
          <p className="wb-game-kicker">Projects</p>
          {canEdit ? (
            <form className="wb-inline-form" onSubmit={submitProject}>
              <input
                value={projectTitle}
                onChange={(event) => setProjectTitle(event.target.value)}
                placeholder="e.g. Launch a product campaign"
                maxLength={160}
              />
              <button type="submit" disabled={saving || !projectTitle.trim()}>
                Create
              </button>
            </form>
          ) : null}

          {activeProjects.length === 0 ? (
            <div className="wb-state-panel is-compact">
              <p className="wb-state-title">Create your first project.</p>
              <p className="wb-state-copy">Boss battles turn scattered tasks into campaigns.</p>
            </div>
          ) : (
            <ul className="wb-project-list">
              {activeProjects.map((project) => {
                const progress =
                  project.progress || calculateProjectProgress(project.tasks || []);
                return (
                  <li key={project._id} className="wb-project-card">
                    <div className="wb-project-card-head">
                      <h3>{project.title}</h3>
                      {canEdit ? (
                        <button
                          type="button"
                          className="wb-mode-btn"
                          onClick={() => onCompleteProject?.(project)}
                        >
                          Complete
                        </button>
                      ) : null}
                    </div>
                    <p className="wb-project-progress-label">
                      Progress {progress.percent}% · {progress.done}/{progress.total}
                    </p>
                    <div className="wb-xp-track" aria-hidden="true">
                      <span className="wb-xp-fill" style={{ width: `${progress.percent}%` }} />
                    </div>
                    <ul className="wb-project-tasks">
                      {(project.tasks || []).slice(0, 8).map((task) => (
                        <li key={task._id}>
                          <button
                            type="button"
                            className={`wb-project-task${
                              task.status === 'completed' ? ' is-done' : ''
                            }`}
                            onClick={() => onOpenTask?.(task)}
                          >
                            <span aria-hidden="true">
                              {task.status === 'completed' ? '✓' : '□'}
                            </span>
                            {task.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="wb-dash-card">
          <p className="wb-game-kicker">Weekly Objective</p>
          {canEdit ? (
            <form className="wb-objective-form" onSubmit={submitObjective}>
              <input
                value={objectiveForm.title}
                onChange={(event) =>
                  setObjectiveForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="e.g. Hit 50 weekly signups"
                maxLength={160}
                required
              />
              <div className="wb-modal-grid">
                <input
                  value={objectiveForm.category}
                  onChange={(event) =>
                    setObjectiveForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                  placeholder="e.g. Marketing"
                  maxLength={60}
                />
                <input
                  type="number"
                  min="1"
                  value={objectiveForm.target}
                  onChange={(event) =>
                    setObjectiveForm((prev) => ({ ...prev, target: event.target.value }))
                  }
                  placeholder="e.g. 50"
                  required
                />
                <input
                  type="number"
                  min="0"
                  value={objectiveForm.current}
                  onChange={(event) =>
                    setObjectiveForm((prev) => ({ ...prev, current: event.target.value }))
                  }
                  placeholder="e.g. 0"
                />
              </div>
              <button type="submit" disabled={saving}>
                Add objective
              </button>
            </form>
          ) : null}

          {weekObjectives.length === 0 ? (
            <p className="wb-mission-empty">No objectives for this week.</p>
          ) : (
            <ul className="wb-objective-list">
              {weekObjectives.map((objective) => {
                const progress = calculateObjectiveProgress(objective);
                return (
                  <li key={objective._id} className="wb-objective-item">
                    <div className="wb-objective-head">
                      <div>
                        <strong>{objective.title}</strong>
                        {objective.category ? (
                          <span className="wb-objective-cat">{objective.category}</span>
                        ) : null}
                      </div>
                      <span>
                        {progress.current} / {progress.target}
                      </span>
                    </div>
                    <p className="wb-project-progress-label">{progress.percent}%</p>
                    <div className="wb-xp-track" aria-hidden="true">
                      <span className="wb-xp-fill" style={{ width: `${progress.percent}%` }} />
                    </div>
                    {canEdit ? (
                      <div className="wb-objective-actions">
                        <button
                          type="button"
                          className="wb-mode-btn"
                          onClick={() =>
                            onUpdateObjective?.(objective._id, {
                              current: progress.current + 1
                            })
                          }
                        >
                          +1
                        </button>
                        {!progress.completed ? (
                          <button
                            type="button"
                            className="wb-mode-btn"
                            onClick={() =>
                              onUpdateObjective?.(objective._id, {
                                current: progress.target,
                                completed: true
                              })
                            }
                          >
                            Complete
                          </button>
                        ) : (
                          <span className="wb-objective-done">Done</span>
                        )}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default WorkboardProjectsPanel;
