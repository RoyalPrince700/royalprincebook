import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import AdminArtboard from './AdminArtboard';
import BoardLoader from './BoardLoader';
import { useAuth } from '../../contexts/AuthContext';
import './AdminWorkboard.css';

const STATUS_OPTIONS = [
  { value: 'started', label: 'Started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'almost_done', label: 'Almost done' },
  { value: 'completed', label: 'Completed' },
  { value: 'postponed', label: 'Postponed' }
];

const WEEKDAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const NOTE_COLORS = ['yellow', 'mint', 'peach', 'sky', 'lilac'];
const EMPTY_SLOT_COUNT = 4;
const DEFAULT_START_TIME = '08:00';
const DEFAULT_END_TIME = '17:00';
const YEAR_OPTION_PAST = 5;
const YEAR_OPTION_FUTURE = 1;

const MONTH_OPTIONS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' }
];

const emptyForm = {
  title: '',
  description: '',
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
  status: 'started',
  date: '',
  assignedBy: ''
};

const toDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const shiftDateKey = (dateKey, amount) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
};

const monthKeyFromParts = (year, monthIndex) =>
  `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

const monthKeyFromDate = (date = new Date()) =>
  monthKeyFromParts(date.getFullYear(), date.getMonth());

const parseMonthKey = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return { year, monthIndex: month - 1 };
};

const formatMonthLabel = (monthKey) => {
  const { year, monthIndex } = parseMonthKey(monthKey);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(year, monthIndex, 1)
  );
};

/** Calendar years available in the year dropdown. */
const buildYearOptions = (anchorYear = new Date().getFullYear()) => {
  const years = [];
  for (let year = anchorYear - YEAR_OPTION_PAST; year <= anchorYear + YEAR_OPTION_FUTURE; year += 1) {
    years.push(year);
  }
  return years;
};

/** First Monday on or after the 1st of the given month. */
const firstMondayOfMonth = (year, monthIndex) => {
  const date = new Date(year, monthIndex, 1);
  const day = date.getDay(); // 0 Sun … 6 Sat
  const add = day === 1 ? 0 : day === 0 ? 1 : 8 - day;
  date.setDate(1 + add);
  return toDateKey(date);
};

/** Week 1–4 Mon–Fri ranges for the given month. */
const buildMonthWeeks = (monthKey) => {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const week1 = firstMondayOfMonth(year, monthIndex);

  return [0, 1, 2, 3].map((offset) => {
    const start = shiftDateKey(week1, offset * 7);
    const end = shiftDateKey(start, 4);
    return {
      index: offset,
      label: `Week ${offset + 1}`,
      start,
      end
    };
  });
};

/** Mon–Fri dates that fall inside the selected calendar month. */
const buildMonthWeekdayDates = (monthKey) => {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const dates = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day);
    const dow = date.getDay();
    if (dow >= 1 && dow <= 5) {
      dates.push({
        label: WEEKDAY_LABELS[dow - 1],
        dateKey: toDateKey(date),
        day
      });
    }
  }

  return dates;
};

/**
 * Full-month Mon–Fri grid rows (period-tracker style).
 * Leading/trailing cells may be null when the month starts/ends mid-week.
 */
const buildMonthGrid = (monthKey) => {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const rows = [];
  let row = [null, null, null, null, null];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    const col = dow - 1;
    if (col === 0 && row.some((cell) => cell !== null)) {
      rows.push(row);
      row = [null, null, null, null, null];
    }

    row[col] = { dateKey: toDateKey(date), day };
    if (col === 4) {
      rows.push(row);
      row = [null, null, null, null, null];
    }
  }

  if (row.some((cell) => cell !== null)) {
    rows.push(row);
  }

  return rows;
};

const monthBounds = (monthKey) => {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const start = toDateKey(new Date(year, monthIndex, 1));
  const end = toDateKey(new Date(year, monthIndex + 1, 0));
  return { start, end };
};

const workWeekDays = (weekStartMonday) =>
  WEEKDAY_LABELS.map((label, index) => ({
    label,
    dateKey: shiftDateKey(weekStartMonday, index)
  }));

const formatShortDate = (dateKey) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    parseDateKey(dateKey)
  );

const formatReportDayLabel = (dateKey) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(parseDateKey(dateKey));

const formatWeekRange = (weekStartMonday) => {
  const weekEndFriday = shiftDateKey(weekStartMonday, 4);
  const start = parseDateKey(weekStartMonday);
  const end = parseDateKey(weekEndFriday);
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameMonth) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start);
    return `${month} ${start.getDate()}–${end.getDate()}`;
  }
  return `${formatShortDate(weekStartMonday)}–${formatShortDate(weekEndFriday)}`;
};

const formatReportWeekLabel = (weekStartMonday) => {
  const weekEndFriday = shiftDateKey(weekStartMonday, 4);
  const start = parseDateKey(weekStartMonday);
  const end = parseDateKey(weekEndFriday);
  const year = start.getFullYear();
  if (start.getMonth() === end.getMonth()) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start);
    return `${month} ${start.getDate()}–${end.getDate()}, ${year}`;
  }
  return `${formatReportDayLabel(weekStartMonday)} – ${formatReportDayLabel(weekEndFriday)}`;
};

const weekdayLabelFor = (dateKey) => {
  const day = parseDateKey(dateKey).getDay();
  if (day >= 1 && day <= 5) return WEEKDAY_LABELS[day - 1];
  return null;
};

const statusLabel = (value) =>
  STATUS_OPTIONS.find((option) => option.value === value)?.label || value;

const notePaperColorFor = (index) => NOTE_COLORS[index % NOTE_COLORS.length];

const formatTime12h = (hhmm) => {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return '';
  const [hourStr, minuteStr] = hhmm.split(':');
  let hour = Number(hourStr);
  const minutes = Number(minuteStr);
  if (Number.isNaN(hour) || Number.isNaN(minutes)) return '';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  if (minutes === 0) return `${hour} ${period}`;
  return `${hour}:${String(minutes).padStart(2, '0')} ${period}`;
};

const formatTimeRange12h = (startTime, endTime) => {
  if (!startTime) return null;
  const startLabel = formatTime12h(startTime);
  if (!startLabel) return null;
  if (!endTime) return startLabel;
  const endLabel = formatTime12h(endTime);
  if (!endLabel) return startLabel;
  return `${startLabel} – ${endLabel}`;
};

const formFromTask = (task) => ({
  title: task.title || '',
  description: task.description || '',
  startTime: task.startTime || '',
  endTime: task.endTime || '',
  status: task.status || 'started',
  date: task.date || '',
  assignedBy: task.assignedBy || ''
});

const weekIndexForDate = (monthWeeks, dateKey) => {
  const match = monthWeeks.findIndex((week) => dateKey >= week.start && dateKey <= week.end);
  return match >= 0 ? match : 0;
};

const AdminWorkboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArtboardMode = searchParams.get('mode') === 'artboard';
  const isSuperior = user?.role === 'superior';
  const myId = String(user?.id || user?._id || '');

  const setBoardMode = (mode) => {
    if (mode === 'artboard') {
      setSearchParams({ mode: 'artboard' });
    } else {
      setSearchParams({});
    }
  };

  const yearOptions = useMemo(() => buildYearOptions(new Date().getFullYear()), []);
  const currentMonthKey = useMemo(() => monthKeyFromDate(new Date()), []);

  const [selectedMonthKey, setSelectedMonthKey] = useState(currentMonthKey);
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
  const [activeWeekIndex, setActiveWeekIndex] = useState(() =>
    weekIndexForDate(buildMonthWeeks(currentMonthKey), toDateKey())
  );
  const [ownerId, setOwnerId] = useState(myId);
  const [tasksByDate, setTasksByDate] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'create' | 'edit'
  const [viewTask, setViewTask] = useState(null);
  const [viewColor, setViewColor] = useState('yellow');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('week'); // 'day' | 'week' | 'month'
  const [reportDownloading, setReportDownloading] = useState(false);
  const [reportError, setReportError] = useState('');

  const { year: selectedYear, monthIndex: selectedMonthIndex } = useMemo(
    () => parseMonthKey(selectedMonthKey),
    [selectedMonthKey]
  );

  const setSelectedYear = (year) => {
    setSelectedMonthKey(monthKeyFromParts(Number(year), selectedMonthIndex));
  };

  const setSelectedMonthIndex = (monthIndex) => {
    setSelectedMonthKey(monthKeyFromParts(selectedYear, Number(monthIndex)));
  };

  const monthWeeks = useMemo(() => buildMonthWeeks(selectedMonthKey), [selectedMonthKey]);
  const monthGrid = useMemo(() => buildMonthGrid(selectedMonthKey), [selectedMonthKey]);
  const monthWeekdayDates = useMemo(
    () => buildMonthWeekdayDates(selectedMonthKey),
    [selectedMonthKey]
  );
  const { start: monthStart, end: monthEnd } = useMemo(
    () => monthBounds(selectedMonthKey),
    [selectedMonthKey]
  );

  const activeWeek = monthWeeks[activeWeekIndex] || monthWeeks[0];
  const weekStart = activeWeek.start;
  const days = useMemo(() => workWeekDays(weekStart), [weekStart]);
  const todayKey = toDateKey();

  const reportAnchorDate = useMemo(() => {
    if (reportPeriod === 'week') return weekStart;
    if (reportPeriod === 'month') return monthStart;
    return todayKey;
  }, [reportPeriod, weekStart, monthStart, todayKey]);

  const reportRangeLabel = useMemo(() => {
    if (reportPeriod === 'week') return formatReportWeekLabel(weekStart);
    if (reportPeriod === 'month') return formatMonthLabel(selectedMonthKey);
    return formatReportDayLabel(todayKey);
  }, [reportPeriod, weekStart, selectedMonthKey, todayKey]);

  const formDayOptions = viewMode === 'month' ? monthWeekdayDates : days;

  // When month changes, pick a sensible week (today if in month, else Week 1)
  useEffect(() => {
    const today = toDateKey();
    const { year, monthIndex } = parseMonthKey(selectedMonthKey);
    const todayDate = parseDateKey(today);
    const inSelectedMonth =
      todayDate.getFullYear() === year && todayDate.getMonth() === monthIndex;

    if (inSelectedMonth) {
      setActiveWeekIndex(weekIndexForDate(monthWeeks, today));
    } else {
      setActiveWeekIndex(0);
    }
  }, [selectedMonthKey, monthWeeks]);

  const loadTasks = useCallback(
    async ({ quiet = false } = {}) => {
      if (!ownerId) return;
      try {
        let startDate;
        let endDate;

        if (viewMode === 'month') {
          startDate = monthStart;
          endDate = monthEnd;
        } else {
          startDate = weekStart;
          endDate = shiftDateKey(weekStart, 4);
        }

        const response = await axios.get('/workboard/tasks', {
          params: { startDate, endDate, ownerId }
        });

        setTasksByDate(response.data.tasksByDate || {});
        setCanEdit(Boolean(response.data.canEdit));
        setError('');
      } catch (fetchError) {
        console.error('Failed to load workboard tasks:', fetchError);
        if (!quiet) {
          setError(fetchError.response?.data?.message || 'Failed to load workboard.');
        }
      }
    },
    [ownerId, viewMode, monthStart, monthEnd, weekStart]
  );

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        if (isSuperior) {
          const response = await axios.get('/workboard/workers');
          if (cancelled) return;
          const first = response.data.workers?.[0];
          setOwnerId(first ? String(first.id) : '');
        } else {
          setOwnerId(myId);
        }
      } catch (bootError) {
        console.error('Failed to bootstrap workboard:', bootError);
        if (!cancelled) {
          setError('Failed to load workboard access.');
          setLoading(false);
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [isSuperior, myId]);

  useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      await loadTasks();
      if (!cancelled) setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [ownerId, loadTasks]);

  useEffect(() => {
    if (user?.role !== 'admin') return undefined;

    const beat = () => {
      axios.post('/workboard/presence/heartbeat').catch(() => {});
    };

    beat();
    const interval = setInterval(beat, 20000);

    const markOffline = () => {
      const token = localStorage.getItem('token');
      const base = axios.defaults.baseURL || '';
      if (token) {
        fetch(`${base}/workboard/presence/offline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: '{}',
          keepalive: true
        }).catch(() => {});
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        markOffline();
      } else {
        beat();
      }
    };

    window.addEventListener('beforeunload', markOffline);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', markOffline);
      document.removeEventListener('visibilitychange', onVisibility);
      markOffline();
    };
  }, [user?.role]);

  const closeModal = () => {
    setModalMode(null);
    setViewTask(null);
    setEditingId(null);
    setForm(emptyForm);
  };

  const openCreate = (dateKey) => {
    if (!canEdit || !dateKey) return;
    setViewTask(null);
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: dateKey
    });
    setModalMode('create');
  };

  const openView = (task, color) => {
    setViewTask(task);
    setViewColor(color || notePaperColorFor(0));
    setEditingId(null);
    setForm(emptyForm);
    setModalMode('view');
  };

  const switchToEdit = () => {
    if (!canEdit || !viewTask) return;
    setEditingId(viewTask._id);
    setForm(formFromTask(viewTask));
    setModalMode('edit');
  };

  const selectWeek = (index) => {
    setActiveWeekIndex(index);
    setViewMode('week');
  };

  const saveTask = async (event) => {
    event.preventDefault();
    if (!canEdit || saving) return;
    if (modalMode !== 'create' && modalMode !== 'edit') return;

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        status: form.status,
        date: form.date,
        assignedBy: form.assignedBy
      };

      if (editingId) {
        const response = await axios.put(`/workboard/tasks/${editingId}`, payload);
        const updated = response.data.task;
        setViewTask(updated);
        setForm(formFromTask(updated));
        setModalMode('view');
        setEditingId(null);
      } else {
        await axios.post('/workboard/tasks', payload);
        closeModal();
      }

      await loadTasks({ quiet: true });
    } catch (saveError) {
      console.error('Failed to save task:', saveError);
      setError(saveError.response?.data?.message || 'Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (taskId, status) => {
    if (!canEdit) return;
    try {
      await axios.patch(`/workboard/tasks/${taskId}/status`, { status });
      await loadTasks({ quiet: true });
      if (viewTask && String(viewTask._id) === String(taskId)) {
        setViewTask((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (statusError) {
      console.error('Failed to update status:', statusError);
      setError(statusError.response?.data?.message || 'Failed to update status.');
    }
  };

  const requestDelete = (task) => {
    if (!canEdit || !task) return;
    setDeleteTarget(task);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!canEdit || !deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await axios.delete(`/workboard/tasks/${deleteTarget._id}`);
      if (viewTask && String(viewTask._id) === String(deleteTarget._id)) {
        closeModal();
      }
      setDeleteTarget(null);
      await loadTasks({ quiet: true });
    } catch (deleteError) {
      console.error('Failed to delete task:', deleteError);
      setError(deleteError.response?.data?.message || 'Failed to delete task.');
    } finally {
      setDeleting(false);
    }
  };

  const downloadReport = async () => {
    if (!ownerId || reportDownloading) return;
    setReportDownloading(true);
    setReportError('');
    try {
      const response = await axios.get('/workboard/report/docx', {
        params: {
          period: reportPeriod,
          date: reportAnchorDate,
          ownerId
        },
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const text = await response.data.text();
        const payload = JSON.parse(text);
        throw new Error(payload.message || 'Failed to download report.');
      }

      const disposition = response.headers['content-disposition'] || '';
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
      const fallbackName =
        reportPeriod === 'day'
          ? `workboard-daily-${reportAnchorDate}.docx`
          : reportPeriod === 'week'
            ? `workboard-weekly-${weekStart}-to-${shiftDateKey(weekStart, 4)}.docx`
            : `workboard-monthly-${selectedMonthKey}.docx`;
      const filename = filenameMatch?.[1] || fallbackName;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (downloadErr) {
      console.error('Failed to download workboard report:', downloadErr);
      let message = 'Failed to download report.';
      if (downloadErr.response?.data instanceof Blob) {
        try {
          const text = await downloadErr.response.data.text();
          const payload = JSON.parse(text);
          if (payload.message) message = payload.message;
        } catch {
          /* keep default */
        }
      } else if (downloadErr.response?.data?.message) {
        message = downloadErr.response.data.message;
      } else if (downloadErr.message) {
        message = downloadErr.message;
      }
      setReportError(message);
    } finally {
      setReportDownloading(false);
    }
  };

  const dayLabelForDate = (dateKey) => {
    const weekday = weekdayLabelFor(dateKey);
    if (weekday) return `${weekday} · ${formatShortDate(dateKey)}`;
    return formatShortDate(dateKey);
  };

  if (isArtboardMode) {
    return (
      <AdminLayout chrome="immersive">
        <AdminArtboard onExit={() => setBoardMode('workboard')} />
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout chrome="minimal">
        <BoardLoader label="Opening workboard…" />
      </AdminLayout>
    );
  }

  const showModal = modalMode !== null;
  const isFormMode = modalMode === 'create' || modalMode === 'edit';
  const viewTimeLabel = viewTask
    ? formatTimeRange12h(viewTask.startTime, viewTask.endTime)
    : null;
  const formTimeHint = formatTimeRange12h(form.startTime, form.endTime);

  return (
    <AdminLayout chrome="minimal">
      <div className="wb-board">
        {error ? <div className="wb-error">{error}</div> : null}

        <div className="wb-topbar">
          <div className="wb-toolbar">
            <div className="wb-mode-toggle" role="group" aria-label="Board mode">
              <button
                type="button"
                className="wb-mode-btn is-active"
                aria-pressed="true"
              >
                Workboard
              </button>
              <button
                type="button"
                className="wb-mode-btn"
                aria-pressed="false"
                onClick={() => setBoardMode('artboard')}
              >
                Artboard
              </button>
            </div>

            <select
              className="wb-month-select"
              value={selectedMonthIndex}
              onChange={(event) => setSelectedMonthIndex(event.target.value)}
              aria-label="Select month"
            >
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="wb-year-select"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              aria-label="Select year"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <div className="wb-view-toggle" role="group" aria-label="Calendar view">
              <button
                type="button"
                className={`wb-view-btn${viewMode === 'week' ? ' is-active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={`wb-view-btn${viewMode === 'month' ? ' is-active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
            </div>

            <div className={`wb-weeks${viewMode === 'month' ? ' is-secondary' : ''}`}>
              {monthWeeks.map((week) => (
                <button
                  key={week.start}
                  type="button"
                  className={`wb-week-tab${
                    viewMode === 'week' && activeWeekIndex === week.index ? ' is-active' : ''
                  }`}
                  onClick={() => selectWeek(week.index)}
                >
                  {week.label}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'week' ? (
            <p className="wb-week-range">{formatWeekRange(weekStart)}</p>
          ) : (
            <p className="wb-week-range">{formatMonthLabel(selectedMonthKey)} · Mon–Fri</p>
          )}
        </div>

        {viewMode === 'week' ? (
          <div className="wb-calendar">
            {days.map((day) => {
              const dayTasks = tasksByDate[day.dateKey] || [];
              const emptyCount = canEdit
                ? Math.max(1, EMPTY_SLOT_COUNT - dayTasks.length)
                : Math.max(0, EMPTY_SLOT_COUNT - dayTasks.length);
              const isToday = day.dateKey === todayKey;

              return (
                <div
                  key={day.dateKey}
                  className={`wb-day-row${isToday ? ' is-today' : ''}`}
                >
                  <div className="wb-day-label">
                    <p className="wb-day-name">{day.label}</p>
                    <p className="wb-day-date">{formatShortDate(day.dateKey)}</p>
                  </div>

                  <div className="wb-slots">
                    {dayTasks.map((task, index) => {
                      const paper = notePaperColorFor(index);
                      const tilt = `wb-note--tilt-${index % 4}`;
                      const timeLabel = formatTimeRange12h(task.startTime, task.endTime);

                      return (
                        <div
                          key={task._id}
                          className={`wb-note wb-note--${paper} wb-note-status--${task.status || 'started'} ${tilt} is-openable`}
                          role="button"
                          tabIndex={0}
                          onClick={() => openView(task, paper)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              openView(task, paper);
                            }
                          }}
                        >
                          <span
                            className={`wb-status-badge wb-status-badge--${task.status || 'started'}`}
                          >
                            {statusLabel(task.status)}
                          </span>
                          <p className="wb-note-meta">{timeLabel || 'All day'}</p>
                          <p className="wb-note-title">{task.title}</p>

                          {canEdit ? (
                            <div
                              className="wb-note-actions"
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              <select
                                value={task.status || 'started'}
                                onChange={(event) => changeStatus(task._id, event.target.value)}
                                aria-label="Task status"
                                className={`wb-status-select wb-status-select--${task.status || 'started'}`}
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                aria-label="Delete task"
                                onClick={() => requestDelete(task)}
                              >
                                ×
                              </button>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}

                    {Array.from({ length: emptyCount }).map((_, index) => (
                      <button
                        key={`empty-${day.dateKey}-${index}`}
                        type="button"
                        className={`wb-slot-empty${canEdit ? ' is-addable' : ''}`}
                        aria-label={canEdit ? `Add task on ${day.label}` : undefined}
                        disabled={!canEdit}
                        onClick={() => {
                          if (canEdit) openCreate(day.dateKey);
                        }}
                      >
                        {canEdit ? <span className="wb-slot-plus" aria-hidden="true">+</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="wb-month-calendar">
            <div className="wb-month-head">
              {WEEKDAY_SHORT.map((label) => (
                <div key={label} className="wb-month-head-cell">
                  {label}
                </div>
              ))}
            </div>

            <div className="wb-month-body">
              {monthGrid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="wb-month-row">
                  {row.map((cell, colIndex) => {
                    if (!cell) {
                      return (
                        <div
                          key={`empty-${rowIndex}-${colIndex}`}
                          className="wb-month-cell is-blank"
                          aria-hidden="true"
                        />
                      );
                    }

                    const dayTasks = tasksByDate[cell.dateKey] || [];
                    const isToday = cell.dateKey === todayKey;

                    return (
                      <div
                        key={cell.dateKey}
                        className={`wb-month-cell${isToday ? ' is-today' : ''}${
                          canEdit ? ' is-editable' : ''
                        }`}
                      >
                        <div className="wb-month-cell-top">
                          <span className="wb-month-day-num">{cell.day}</span>
                          {canEdit ? (
                            <button
                              type="button"
                              className="wb-month-add"
                              aria-label={`Add task on ${formatShortDate(cell.dateKey)}`}
                              onClick={() => openCreate(cell.dateKey)}
                            >
                              +
                            </button>
                          ) : null}
                        </div>

                        <div className="wb-month-chips">
                          {dayTasks.length === 0 && canEdit ? (
                            <button
                              type="button"
                              className="wb-month-empty-hit"
                              aria-label={`Add task on ${formatShortDate(cell.dateKey)}`}
                              onClick={() => openCreate(cell.dateKey)}
                            >
                              <span className="wb-slot-plus" aria-hidden="true">
                                +
                              </span>
                            </button>
                          ) : null}

                          {dayTasks.map((task, index) => {
                            const paper = notePaperColorFor(index);
                            return (
                              <button
                                key={task._id}
                                type="button"
                                className={`wb-month-chip wb-note--${paper} wb-note-status--${task.status || 'started'}`}
                                onClick={() => openView(task, paper)}
                                title={task.title}
                              >
                                <span
                                  className={`wb-status-dot wb-status-dot--${task.status || 'started'}`}
                                  aria-hidden="true"
                                />
                                <span className="wb-month-chip-title">{task.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="wb-report-bar">
          <div className="wb-report-bar-main">
            <span className="wb-report-label">Report</span>
            <div className="wb-report-periods" role="group" aria-label="Report period">
              {[
                { value: 'day', label: 'Daily' },
                { value: 'week', label: 'Weekly' },
                { value: 'month', label: 'Monthly' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`wb-report-period-btn${
                    reportPeriod === option.value ? ' is-active' : ''
                  }`}
                  onClick={() => {
                    setReportPeriod(option.value);
                    setReportError('');
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="wb-report-range">{reportRangeLabel}</p>
            <button
              type="button"
              className="wb-report-download"
              onClick={downloadReport}
              disabled={reportDownloading || !ownerId}
            >
              {reportDownloading ? 'Preparing…' : 'Download report (.docx)'}
            </button>
          </div>
          {reportError ? <p className="wb-report-error">{reportError}</p> : null}
        </div>

        {deleteTarget ? (
          <div
            className="wb-confirm-backdrop"
            onClick={cancelDelete}
          >
            <div
              className="wb-confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="workboard-delete-title"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="wb-note-meta">Delete task</p>
              <h2 id="workboard-delete-title">Remove this sticky note?</h2>
              <p className="wb-confirm-copy">
                “{deleteTarget.title || 'Untitled task'}” will be removed from the workboard.
                This cannot be undone.
              </p>
              <div className="wb-modal-actions">
                <button type="button" onClick={cancelDelete} disabled={deleting}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="wb-modal-danger is-solid"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showModal ? (
          <div className="wb-modal-backdrop" onClick={closeModal}>
            {modalMode === 'view' && viewTask ? (
              <div
                className={`wb-sticky-modal wb-note--${viewColor} wb-note-status--${viewTask.status || 'started'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="workboard-view-title"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="wb-sticky-meta">
                  {dayLabelForDate(viewTask.date)}
                  {viewTimeLabel ? ` · ${viewTimeLabel}` : ''}
                </p>
                <h2 id="workboard-view-title" className="wb-sticky-title">
                  {viewTask.title}
                </h2>

                {viewTask.description ? (
                  <p className="wb-sticky-notes">{viewTask.description}</p>
                ) : (
                  <p className="wb-sticky-notes is-empty">No notes</p>
                )}

                <div className="wb-sticky-fields">
                  <div className="wb-sticky-field">
                    <span className="wb-sticky-field-label">Status</span>
                    <span
                      className={`wb-status-badge wb-status-badge--${viewTask.status || 'started'}`}
                    >
                      {statusLabel(viewTask.status)}
                    </span>
                  </div>
                  {viewTask.assignedBy ? (
                    <div className="wb-sticky-field">
                      <span className="wb-sticky-field-label">Assigned by</span>
                      <span className="wb-sticky-field-value">{viewTask.assignedBy}</span>
                    </div>
                  ) : null}
                </div>

                <div className="wb-modal-actions">
                  <button type="button" onClick={closeModal}>
                    Close
                  </button>
                  {canEdit ? (
                    <>
                      <button
                        type="button"
                        className="wb-modal-danger"
                        onClick={() => requestDelete(viewTask)}
                      >
                        Delete
                      </button>
                      <button type="button" className="wb-modal-primary" onClick={switchToEdit}>
                        Edit
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            {isFormMode && canEdit ? (
              <div
                className="wb-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="workboard-task-title"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="wb-note-meta">{modalMode === 'edit' ? 'Edit task' : 'New task'}</p>
                <h2 id="workboard-task-title">
                  {modalMode === 'edit' ? 'Update sticky note' : 'Add a sticky note'}
                </h2>

                <form onSubmit={saveTask}>
                  <label className="wb-modal-label" htmlFor="wb-title">
                    Title
                  </label>
                  <input
                    id="wb-title"
                    required
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="What are you working on?"
                  />

                  <label className="wb-modal-label" htmlFor="wb-day">
                    Day
                  </label>
                  <select
                    id="wb-day"
                    required
                    value={form.date}
                    onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  >
                    {formDayOptions.map((day) => (
                      <option key={day.dateKey} value={day.dateKey}>
                        {day.label} · {formatShortDate(day.dateKey)}
                      </option>
                    ))}
                    {form.date &&
                    !formDayOptions.some((day) => day.dateKey === form.date) ? (
                      <option value={form.date}>
                        {dayLabelForDate(form.date)}
                      </option>
                    ) : null}
                  </select>

                  <label className="wb-modal-label" htmlFor="wb-notes">
                    Notes
                  </label>
                  <textarea
                    id="wb-notes"
                    rows={2}
                    value={form.description}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                    placeholder="Optional"
                  />

                  <div className="wb-modal-grid">
                    <div>
                      <label className="wb-modal-label" htmlFor="wb-start">
                        Start
                      </label>
                      <input
                        id="wb-start"
                        type="time"
                        value={form.startTime}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, startTime: event.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="wb-modal-label" htmlFor="wb-end">
                        End
                      </label>
                      <input
                        id="wb-end"
                        type="time"
                        value={form.endTime}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, endTime: event.target.value }))
                        }
                      />
                    </div>
                  </div>
                  {formTimeHint ? (
                    <p className="wb-time-hint">{formTimeHint}</p>
                  ) : null}

                  <label className="wb-modal-label" htmlFor="wb-status">
                    Status
                  </label>
                  <select
                    id="wb-status"
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <label className="wb-modal-label" htmlFor="wb-assigned-by">
                    Assigned by
                  </label>
                  <input
                    id="wb-assigned-by"
                    value={form.assignedBy}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, assignedBy: event.target.value }))
                    }
                    placeholder="Who assigned this?"
                  />

                  <div className="wb-modal-actions">
                    <button
                      type="button"
                      onClick={() => {
                        if (modalMode === 'edit' && viewTask) {
                          setEditingId(null);
                          setForm(emptyForm);
                          setModalMode('view');
                        } else {
                          closeModal();
                        }
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}>
                      {saving ? 'Saving…' : modalMode === 'edit' ? 'Save' : 'Add note'}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminWorkboard;
