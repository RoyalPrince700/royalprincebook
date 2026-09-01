import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import BoardLoader from './BoardLoader';
import BoardShell from './BoardShell';
import BoardWebsiteLink from '../BoardWebsiteLink';
import WorkboardFocusMode from './WorkboardFocusMode';
import WorkboardDashboard from './WorkboardDashboard';
import WorkboardAchievements from './WorkboardAchievements';
import WorkboardProjectsPanel from './WorkboardProjectsPanel';
import WorkboardAnalytics from './WorkboardAnalytics';
import WorkboardVictoryJournal from './WorkboardVictoryJournal';
import WorkboardLeaderboard from './WorkboardLeaderboard';
import TaskboardPlayerName from './TaskboardPlayerName';
import WorkboardAccessGrantModal, {
  WORKBOARD_PERMISSION_OPTIONS
} from './WorkboardAccessGrantModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSignInPrompt } from '../Auth/SignInPromptModal';
import {
  PRIORITY_OPTIONS,
  DEFAULT_PRIORITY,
  calculateDailyScore,
  calculateLevelProgress,
  calculateRoyalScore,
  calculateWeeklySummary,
  flattenTasksByDate,
  buildTodaysMission,
  buildTaskHistoryTimeline,
  searchWorkboardItems
} from '../../utils/workboardGamification';
import './AdminWorkboard.css';

const STATUS_OPTIONS = [
  { value: 'started', label: 'Started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'almost_done', label: 'Almost done' },
  { value: 'completed', label: 'Completed' },
  { value: 'postponed', label: 'Postponed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WORK_WEEK_END_OFFSET = 6;
const NOTE_COLORS = ['yellow', 'mint', 'peach', 'sky', 'lilac'];
const EMPTY_SLOT_COUNT = 4;
const DEFAULT_START_TIME = '08:00';
const DEFAULT_END_TIME = '17:00';
const MOBILE_LAYOUT_STORAGE_KEY = 'workboard-mobile-layout';
const OVERVIEW_PAGE_WIDTH = 960;

const EMPTY_STREAK_META = {
  current: 0,
  longest: 0,
  streakBeforeBreak: 0,
  canRestore: false,
  restoreXpCost: 50,
  restoresRemainingThisMonth: 5,
  restoreMonthlyLimit: 5,
  lastVisitDate: null
};

const formatCollaboratorPermissions = (permissions = []) =>
  permissions
    .map(
      (value) =>
        WORKBOARD_PERMISSION_OPTIONS.find((option) => option.value === value)?.label || value
    )
    .join(' · ');

const formatAccessGrantedAt = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
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
  assignedBy: '',
  tag: '',
  priority: DEFAULT_PRIORITY,
  project: ''
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

/** Sunday on or before the given date (start of that Sun–Sat week). */
const sundayOnOrBefore = (dateKey) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() - date.getDay());
  return toDateKey(date);
};

/** Sunday on or before the 1st of the given month. */
const firstSundayOfMonth = (year, monthIndex) =>
  sundayOnOrBefore(toDateKey(new Date(year, monthIndex, 1)));

const weekOverlapsMonth = (weekStart, weekEnd, monthStart, monthEnd) =>
  weekStart <= monthEnd && weekEnd >= monthStart;

/** All Sun–Sat weeks that touch the selected month (4–6 weeks, labeled Week 1…n). */
const buildMonthWeeks = (monthKey) => {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const monthStart = toDateKey(new Date(year, monthIndex, 1));
  const monthEnd = toDateKey(new Date(year, monthIndex + 1, 0));
  const lastWeekStart = sundayOnOrBefore(monthEnd);

  const weeks = [];
  let cursor = firstSundayOfMonth(year, monthIndex);

  while (cursor <= lastWeekStart) {
    const end = shiftDateKey(cursor, WORK_WEEK_END_OFFSET);
    if (weekOverlapsMonth(cursor, end, monthStart, monthEnd)) {
      weeks.push({
        index: weeks.length,
        label: `Week ${weeks.length + 1}`,
        start: cursor,
        end
      });
    }
    cursor = shiftDateKey(cursor, 7);
  }

  return weeks;
};

const isDateInMonth = (dateKey, monthKey) => {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const date = parseDateKey(dateKey);
  return date.getFullYear() === year && date.getMonth() === monthIndex;
};

/** Full Sun–Sat calendar grid for the month, including spillover days from adjacent months. */
const buildMonthGrid = (monthKey) => {
  const weeks = buildMonthWeeks(monthKey);
  if (!weeks.length) return [];

  const gridStart = parseDateKey(weeks[0].start);
  const gridEnd = parseDateKey(weeks[weeks.length - 1].end);
  const rows = [];
  let row = Array(7).fill(null);
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const col = cursor.getDay();
    const dateKey = toDateKey(cursor);

    row[col] = {
      dateKey,
      day: cursor.getDate(),
      inMonth: isDateInMonth(dateKey, monthKey)
    };

    if (col === 6) {
      rows.push(row);
      row = Array(7).fill(null);
    }

    cursor.setDate(cursor.getDate() + 1);
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

const workWeekDays = (weekStartSunday, monthKey) =>
  WEEKDAY_LABELS.map((label, index) => {
    const dateKey = shiftDateKey(weekStartSunday, index);
    return {
      label,
      dateKey,
      inSelectedMonth: isDateInMonth(dateKey, monthKey)
    };
  });

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

const formatWeekRange = (weekStartSunday) => {
  const weekEndSaturday = shiftDateKey(weekStartSunday, WORK_WEEK_END_OFFSET);
  const start = parseDateKey(weekStartSunday);
  const end = parseDateKey(weekEndSaturday);
  const sameMonth = start.getMonth() === end.getMonth();
  if (sameMonth) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start);
    return `${month} ${start.getDate()}–${end.getDate()}`;
  }
  return `${formatShortDate(weekStartSunday)}–${formatShortDate(weekEndSaturday)}`;
};

const formatReportWeekLabel = (weekStartSunday) => {
  const weekEndSaturday = shiftDateKey(weekStartSunday, WORK_WEEK_END_OFFSET);
  const start = parseDateKey(weekStartSunday);
  const end = parseDateKey(weekEndSaturday);
  const year = start.getFullYear();
  if (start.getMonth() === end.getMonth()) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(start);
    return `${month} ${start.getDate()}–${end.getDate()}, ${year}`;
  }
  return `${formatReportDayLabel(weekStartSunday)} – ${formatReportDayLabel(weekEndSaturday)}`;
};

const weekdayLabelFor = (dateKey) => {
  const day = parseDateKey(dateKey).getDay();
  return WEEKDAY_LABELS[day] || null;
};

const statusLabel = (value) =>
  STATUS_OPTIONS.find((option) => option.value === value)?.label || value;

const priorityLabel = (value) =>
  PRIORITY_OPTIONS.find((option) => option.value === value)?.label || value || 'Normal';

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
  assignedBy: task.assignedBy || '',
  tag: task.tag || '',
  priority: task.priority || DEFAULT_PRIORITY,
  project: task.project ? String(task.project._id || task.project) : ''
});

const weekIndexForDate = (monthWeeks, dateKey) => {
  const match = monthWeeks.findIndex((week) => dateKey >= week.start && dateKey <= week.end);
  return match >= 0 ? match : 0;
};

const AdminWorkboard = ({ standalone = false, shareToken = null }) => {
  const { user, refreshProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isSharedView = Boolean(shareToken);
  const isGuest = !isAuthenticated && !isSharedView;
  const layoutStandalone = standalone || isSharedView;
  const [searchParams, setSearchParams] = useSearchParams();
  const boardMode = searchParams.get('mode') || 'board';
  const isDashboardMode = boardMode === 'dashboard';
  const isAchievementsMode = boardMode === 'achievements';
  const isProjectsMode = boardMode === 'projects';
  const isAnalyticsMode = boardMode === 'analytics';
  const isVictoriesMode = boardMode === 'victories';
  const isLeaderboardMode = boardMode === 'leaderboard';
  const isSuperior = user?.role === 'superior';
  const myId = String(user?.id || user?._id || '');

  const setBoardMode = (mode) => {
    if (!mode || mode === 'board') {
      setSearchParams({});
      return;
    }
    setSearchParams({ mode });
  };

  useEffect(() => {
    if (boardMode === 'artboard') {
      navigate('/noteboard', { replace: true });
    }
  }, [boardMode, navigate]);

  const yearOptions = useMemo(() => buildYearOptions(new Date().getFullYear()), []);
  const currentMonthKey = useMemo(() => monthKeyFromDate(new Date()), []);

  const [selectedMonthKey, setSelectedMonthKey] = useState(currentMonthKey);
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
  const [activeWeekIndex, setActiveWeekIndex] = useState(() =>
    weekIndexForDate(buildMonthWeeks(currentMonthKey), toDateKey())
  );
  const [ownerId, setOwnerId] = useState(myId);
  const isBoardOwner = !isSharedView && !isGuest && Boolean(ownerId) && ownerId === myId;
  const [tasksByDate, setTasksByDate] = useState({});
  const [taskTags, setTaskTags] = useState([]);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [savingTag, setSavingTag] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [myPermissions, setMyPermissions] = useState([]);
  const canShowAddUi = isSharedView
    ? myPermissions.includes('add_task')
    : isGuest || canEdit;
  const canEditTasks = isSharedView ? myPermissions.includes('edit_task') : canEdit;
  const canDeleteTasks = isSharedView ? myPermissions.includes('delete_task') : canEdit;
  const canChangeStatus =
    isSharedView
      ? myPermissions.includes('update_status') || myPermissions.includes('edit_task')
      : canEdit;
  const { requireSignIn, signInPrompt } = useSignInPrompt(isSharedView ? 'share_edit' : 'task');
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
  const [shareCreating, setShareCreating] = useState(false);
  const [shareError, setShareError] = useState('');
  const [shareCopyNote, setShareCopyNote] = useState('');
  const [shareMeta, setShareMeta] = useState(null);
  const [accessRequest, setAccessRequest] = useState(null);
  const [accessRequestSubmitting, setAccessRequestSubmitting] = useState(false);
  const [accessRequestMessage, setAccessRequestMessage] = useState('');
  const [accessRequests, setAccessRequests] = useState([]);
  const [accessRequestsOpen, setAccessRequestsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorsLoading, setCollaboratorsLoading] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeSaving, setRevokeSaving] = useState(false);
  const [grantTarget, setGrantTarget] = useState(null);
  const [accessRequestsLoading, setAccessRequestsLoading] = useState(false);
  const [accessResolveSaving, setAccessResolveSaving] = useState(false);
  const [totalXp, setTotalXp] = useState(() => Number(user?.workboardXp) || 0);
  const [displayedXp, setDisplayedXp] = useState(() => Number(user?.workboardXp) || 0);
  const [historyTasks, setHistoryTasks] = useState([]);
  const [streakMeta, setStreakMeta] = useState(EMPTY_STREAK_META);
  const [streakRestoring, setStreakRestoring] = useState(false);
  const [streakError, setStreakError] = useState('');
  const [xpToast, setXpToast] = useState(null);
  const xpToastTimerRef = useRef(null);
  const [focusTask, setFocusTask] = useState(null);
  const [quickCapture, setQuickCapture] = useState('');
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [quickSaving, setQuickSaving] = useState(false);
  const quickCaptureRef = useRef(null);
  const [customMissionTitle, setCustomMissionTitle] = useState('');
  const [missionEditing, setMissionEditing] = useState(false);
  const [missionDraft, setMissionDraft] = useState('');
  const [projects, setProjects] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [victories, setVictories] = useState([]);
  const [victoriesLoading, setVictoriesLoading] = useState(false);
  const [victoriesError, setVictoriesError] = useState('');
  const [victorySaving, setVictorySaving] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const calendarRef = useRef(null);
  const overviewFrameRef = useRef(null);
  const overviewInnerRef = useRef(null);
  const [mobileLayoutMode, setMobileLayoutMode] = useState(() => {
    try {
      return localStorage.getItem(MOBILE_LAYOUT_STORAGE_KEY) === 'overview' ? 'overview' : 'cards';
    } catch {
      return 'cards';
    }
  });
  const [overviewScale, setOverviewScale] = useState(1);
  const [overviewFrameHeight, setOverviewFrameHeight] = useState(null);

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
  const monthWeekdayDates = useMemo(() => {
    const { year, monthIndex } = parseMonthKey(selectedMonthKey);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const dates = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, monthIndex, day);
      const dow = date.getDay();
      dates.push({
        label: WEEKDAY_LABELS[dow],
        dateKey: toDateKey(date),
        day
      });
    }

    return dates;
  }, [selectedMonthKey]);
  const { start: monthStart, end: monthEnd } = useMemo(
    () => monthBounds(selectedMonthKey),
    [selectedMonthKey]
  );
  const calendarRange = useMemo(() => {
    if (!monthWeeks.length) {
      return { start: monthStart, end: monthEnd };
    }
    return {
      start: monthWeeks[0].start,
      end: monthWeeks[monthWeeks.length - 1].end
    };
  }, [monthWeeks, monthStart, monthEnd]);

  const activeWeek = monthWeeks[activeWeekIndex] || monthWeeks[0];
  const weekStart = activeWeek?.start;
  const days = useMemo(() => {
    if (isSharedView && shareMeta?.period === 'day') {
      const dateKey = shareMeta.anchorDate || shareMeta.startDate;
      const dow = parseDateKey(dateKey).getDay();
      return [
        {
          label: WEEKDAY_LABELS[dow],
          dateKey,
          inSelectedMonth: isDateInMonth(dateKey, selectedMonthKey)
        }
      ];
    }
    return weekStart ? workWeekDays(weekStart, selectedMonthKey) : [];
  }, [isSharedView, shareMeta, weekStart, selectedMonthKey]);
  const todayKey = toDateKey();

  const updateOverviewLayout = useCallback(() => {
    if (mobileLayoutMode !== 'overview') {
      setOverviewScale(1);
      setOverviewFrameHeight(null);
      return;
    }

    const frame = overviewFrameRef.current;
    const inner = overviewInnerRef.current;
    if (!frame || !inner) return;

    const available = frame.clientWidth;
    const scale = available > 0 ? Math.min(1, available / OVERVIEW_PAGE_WIDTH) : 1;
    setOverviewScale(scale);
    setOverviewFrameHeight(inner.offsetHeight * scale);
  }, [mobileLayoutMode]);

  useEffect(() => {
    try {
      localStorage.setItem(MOBILE_LAYOUT_STORAGE_KEY, mobileLayoutMode);
    } catch {
      /* ignore storage errors */
    }
  }, [mobileLayoutMode]);

  useEffect(() => {
    updateOverviewLayout();
    if (mobileLayoutMode !== 'overview') return undefined;

    const frame = overviewFrameRef.current;
    const inner = overviewInnerRef.current;
    if (!frame || !inner) return undefined;

    const ro = new ResizeObserver(() => {
      updateOverviewLayout();
    });
    ro.observe(frame);
    ro.observe(inner);

    const onResize = () => updateOverviewLayout();
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [mobileLayoutMode, updateOverviewLayout, days, monthGrid, tasksByDate, viewMode, loading, isSharedView]);

  const reportAnchorDate = useMemo(() => {
    if (reportPeriod === 'week') return weekStart;
    if (reportPeriod === 'month') return monthStart;
    if (viewMode === 'month') {
      if (isDateInMonth(todayKey, selectedMonthKey)) return todayKey;
      return monthStart;
    }
    const weekEnd = shiftDateKey(weekStart, WORK_WEEK_END_OFFSET);
    if (todayKey >= weekStart && todayKey <= weekEnd) return todayKey;
    return weekStart;
  }, [reportPeriod, weekStart, monthStart, todayKey, viewMode, selectedMonthKey]);

  const sharedRangeLabel = useMemo(() => {
    if (!shareMeta) return '';
    if (shareMeta.period === 'week') return formatReportWeekLabel(shareMeta.startDate);
    if (shareMeta.period === 'month') {
      return formatMonthLabel(monthKeyFromDate(parseDateKey(shareMeta.startDate)));
    }
    return formatReportDayLabel(shareMeta.anchorDate || shareMeta.startDate);
  }, [shareMeta]);

  const reportRangeLabel = useMemo(() => {
    if (reportPeriod === 'week') return formatReportWeekLabel(weekStart);
    if (reportPeriod === 'month') return formatMonthLabel(selectedMonthKey);
    return formatReportDayLabel(reportAnchorDate);
  }, [reportPeriod, weekStart, selectedMonthKey, reportAnchorDate]);

  const formDayOptions = viewMode === 'month' ? monthWeekdayDates : days;

  // When month changes, jump to the week that contains today (including spillover weeks).
  useEffect(() => {
    const today = toDateKey();
    const idx = weekIndexForDate(monthWeeks, today);
    setActiveWeekIndex(idx >= 0 ? idx : 0);
  }, [selectedMonthKey, monthWeeks]);

  useEffect(() => {
    if (activeWeekIndex >= monthWeeks.length && monthWeeks.length > 0) {
      setActiveWeekIndex(monthWeeks.length - 1);
    }
  }, [activeWeekIndex, monthWeeks.length]);

  const loadTasks = useCallback(
    async ({ quiet = false } = {}) => {
      if (!ownerId) return;
      try {
        let startDate;
        let endDate;

        if (viewMode === 'month') {
          startDate = calendarRange.start;
          endDate = calendarRange.end;
        } else {
          startDate = weekStart;
          endDate = shiftDateKey(weekStart, WORK_WEEK_END_OFFSET);
        }

        const response = await axios.get('/taskboard/tasks', {
          params: { startDate, endDate, ownerId }
        });

        setTasksByDate(response.data.tasksByDate || {});
        setTaskTags(response.data.tags || []);
        setCanEdit(Boolean(response.data.canEdit));
        if (response.data.myPermissions) {
          setMyPermissions(response.data.myPermissions);
        }
        setError('');
      } catch (fetchError) {
        console.error('Failed to load taskboard tasks:', fetchError);
        if (!quiet) {
          setError(fetchError.response?.data?.message || 'Failed to load taskboard.');
        }
      }
    },
    [ownerId, viewMode, calendarRange.start, calendarRange.end, weekStart]
  );

  const loadGamification = useCallback(async () => {
    if (!ownerId) return;
    try {
      const response = await axios.get('/taskboard/gamification', {
        params: { ownerId }
      });
      setHistoryTasks(response.data.tasks || []);
      if (typeof response.data.totalXp === 'number') {
        setTotalXp(response.data.totalXp);
      }
      if (response.data.streak) {
        setStreakMeta(response.data.streak);
      }
    } catch (statsError) {
      console.error('Failed to load taskboard gamification:', statsError);
    }
  }, [ownerId]);

  const loadMission = useCallback(async () => {
    if (!ownerId) return;
    try {
      const response = await axios.get('/taskboard/mission', {
        params: { ownerId, date: toDateKey() }
      });
      setCustomMissionTitle(response.data.customTitle || '');
    } catch (missionError) {
      console.error('Failed to load mission:', missionError);
    }
  }, [ownerId]);

  const loadProjects = useCallback(async () => {
    if (!ownerId) return;
    try {
      const response = await axios.get('/taskboard/projects', { params: { ownerId } });
      setProjects(response.data.projects || []);
    } catch (projectError) {
      console.error('Failed to load projects:', projectError);
    }
  }, [ownerId]);

  const loadObjectives = useCallback(async () => {
    if (!ownerId) return;
    try {
      const response = await axios.get('/taskboard/objectives', {
        params: { ownerId, weekStart }
      });
      setObjectives(response.data.objectives || []);
    } catch (objectiveError) {
      console.error('Failed to load objectives:', objectiveError);
    }
  }, [ownerId, weekStart]);

  const loadAchievements = useCallback(async () => {
    if (!ownerId) return;
    try {
      const response = await axios.get('/taskboard/achievements', { params: { ownerId } });
      setAchievements(response.data.achievements || []);
      return response.data;
    } catch (achievementError) {
      console.error('Failed to load achievements:', achievementError);
      return null;
    }
  }, [ownerId]);

  const loadVictories = useCallback(async () => {
    if (!ownerId) return;
    setVictoriesLoading(true);
    setVictoriesError('');
    try {
      const response = await axios.get('/taskboard/victories', { params: { ownerId } });
      setVictories(response.data.victories || []);
    } catch (victoryError) {
      console.error('Failed to load victories:', victoryError);
      setVictoriesError(victoryError.response?.data?.message || 'Failed to load victory journal.');
    } finally {
      setVictoriesLoading(false);
    }
  }, [ownerId]);

  const showFeedbackToast = useCallback((payload) => {
    if (xpToastTimerRef.current) {
      clearTimeout(xpToastTimerRef.current);
    }
    setXpToast({ ...payload, id: Date.now() });
    xpToastTimerRef.current = setTimeout(() => {
      setXpToast(null);
      xpToastTimerRef.current = null;
    }, 3200);
  }, []);

  const handleRestoreStreak = useCallback(async () => {
    if (!streakMeta.canRestore || streakRestoring || !canEdit) return;
    setStreakRestoring(true);
    setStreakError('');
    try {
      const response = await axios.post('/taskboard/streak/restore');
      if (typeof response.data.totalXp === 'number') {
        setTotalXp(response.data.totalXp);
        setDisplayedXp(response.data.totalXp);
      }
      if (response.data.streak) {
        setStreakMeta(response.data.streak);
      }
      if (response.data.newlyUnlocked?.length) {
        response.data.newlyUnlocked.forEach((achievement) => {
          showFeedbackToast({ achievement, awarded: 0 });
        });
      } else {
        showFeedbackToast({
          awarded: 0,
          streakRestored: true,
          restoredStreak: response.data.streak?.current
        });
      }
      refreshProfile();
    } catch (restoreError) {
      setStreakError(restoreError.response?.data?.message || 'Failed to restore streak.');
    } finally {
      setStreakRestoring(false);
    }
  }, [
    streakMeta.canRestore,
    streakRestoring,
    canEdit,
    refreshProfile,
    showFeedbackToast
  ]);

  const showXpToast = useCallback(
    (awarded, extras = {}) => {
      if (!awarded || awarded <= 0) {
        if (extras.leveledUp || extras.achievement) {
          showFeedbackToast({ awarded: 0, ...extras });
        }
        return;
      }
      showFeedbackToast({ awarded, ...extras });
    },
    [showFeedbackToast]
  );

  const applyXpResponse = useCallback(
    async (payload) => {
      if (!payload) return;
      if (typeof payload.totalXp === 'number') {
        setTotalXp(payload.totalXp);
      }

      const unlocked = Array.isArray(payload.newlyUnlocked) ? payload.newlyUnlocked : [];
      const firstAchievement = unlocked[0] || null;

      if (payload.xpAwarded > 0 || payload.leveledUp || firstAchievement) {
        showXpToast(payload.xpAwarded || 0, {
          leveledUp: Boolean(payload.leveledUp),
          newLevel: payload.newLevel,
          achievement: firstAchievement
        });
      }

      await Promise.all([loadGamification(), loadProjects(), loadAchievements()]);
      if (!isSuperior) {
        refreshProfile().catch(() => {});
      }
    },
    [
      loadGamification,
      loadProjects,
      loadAchievements,
      refreshProfile,
      showXpToast,
      isSuperior
    ]
  );

  const goToToday = useCallback(() => {
    const today = toDateKey();
    const monthKey = monthKeyFromDate(parseDateKey(today));
    const weeks = buildMonthWeeks(monthKey);
    setSelectedMonthKey(monthKey);
    setViewMode('week');
    setActiveWeekIndex(Math.max(0, weekIndexForDate(weeks, today)));
    setBoardMode('board');
    requestAnimationFrame(() => {
      const node = calendarRef.current?.querySelector('.wb-day-row.is-today');
      node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    });
  }, []);

  const loadSharedView = useCallback(async () => {
    if (!shareToken) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/taskboard/share/${shareToken}`);
      const data = response.data;
      setShareMeta(data);
      setTasksByDate(data.tasksByDate || {});
      setMyPermissions(data.myPermissions || []);
      setAccessRequest(data.accessRequest || null);
      setCanEdit(Boolean(data.myPermissions?.length));
      setOwnerId(data.owner?.id ? String(data.owner.id) : '');

      const anchor = data.anchorDate || data.startDate;
      const monthKey = monthKeyFromDate(parseDateKey(anchor));

      if (data.period === 'month') {
        setViewMode('month');
        setSelectedMonthKey(monthKeyFromDate(parseDateKey(data.startDate)));
      } else if (data.period === 'week') {
        setViewMode('week');
        setSelectedMonthKey(monthKey);
        const weeks = buildMonthWeeks(monthKey);
        const idx = weekIndexForDate(weeks, data.startDate);
        setActiveWeekIndex(idx >= 0 ? idx : 0);
      } else {
        setViewMode('day');
        setSelectedMonthKey(monthKey);
        const weeks = buildMonthWeeks(monthKey);
        const idx = weekIndexForDate(weeks, anchor);
        setActiveWeekIndex(idx >= 0 ? idx : 0);
      }
    } catch (fetchError) {
      console.error('Failed to load shared taskboard:', fetchError);
      setError(fetchError.response?.data?.message || 'Share link is unavailable.');
    } finally {
      setLoading(false);
    }
  }, [shareToken]);

  const loadAccessRequests = useCallback(async () => {
    if (!isBoardOwner) return;
    setAccessRequestsLoading(true);
    try {
      const response = await axios.get('/taskboard/access-requests', {
        params: { status: 'pending' }
      });
      setAccessRequests(response.data.requests || []);
    } catch (requestError) {
      console.error('Failed to load access requests:', requestError);
    } finally {
      setAccessRequestsLoading(false);
    }
  }, [isBoardOwner]);

  const loadCollaborators = useCallback(async () => {
    if (!isBoardOwner) return;
    setCollaboratorsLoading(true);
    try {
      const response = await axios.get('/taskboard/collaborators');
      setCollaborators(response.data.collaborators || []);
    } catch (collaboratorError) {
      console.error('Failed to load collaborators:', collaboratorError);
    } finally {
      setCollaboratorsLoading(false);
    }
  }, [isBoardOwner]);

  const loadAccessPanel = useCallback(async () => {
    await Promise.all([loadAccessRequests(), loadCollaborators()]);
  }, [loadAccessRequests, loadCollaborators]);

  const requestEditAccess = async () => {
    if (!shareToken || accessRequestSubmitting) return;
    if (!isAuthenticated) {
      requireSignIn();
      return;
    }
    setAccessRequestSubmitting(true);
    setError('');
    try {
      await axios.post('/taskboard/access-requests', {
        shareToken,
        message: accessRequestMessage.trim()
      });
      setAccessRequest({ status: 'pending' });
      setAccessRequestMessage('');
    } catch (requestError) {
      console.error('Failed to request edit access:', requestError);
      setError(requestError.response?.data?.message || 'Failed to send access request.');
    } finally {
      setAccessRequestSubmitting(false);
    }
  };

  const resolveAccessRequest = async (action, grantedPermissions = [], ownerNote = '') => {
    if (!grantTarget || accessResolveSaving) return;
    setAccessResolveSaving(true);
    try {
      await axios.patch(`/taskboard/access-requests/${grantTarget.id}`, {
        action,
        grantedPermissions,
        ownerNote
      });
      setGrantTarget(null);
      await loadAccessPanel();
    } catch (resolveError) {
      console.error('Failed to resolve access request:', resolveError);
      setError(resolveError.response?.data?.message || 'Failed to update access request.');
    } finally {
      setAccessResolveSaving(false);
    }
  };

  const confirmRevokeAccess = async () => {
    if (!revokeTarget || revokeSaving) return;
    setRevokeSaving(true);
    setError('');
    try {
      await axios.delete(`/taskboard/collaborators/${revokeTarget.id}`);
      setRevokeTarget(null);
      await loadCollaborators();
    } catch (revokeError) {
      console.error('Failed to revoke collaborator access:', revokeError);
      setError(revokeError.response?.data?.message || 'Failed to revoke access.');
    } finally {
      setRevokeSaving(false);
    }
  };

  useEffect(() => {
    if (!isSharedView) return undefined;

    loadSharedView();
    return undefined;
  }, [isSharedView, loadSharedView]);

  useEffect(() => {
    if (!isSharedView || !ownerId || myPermissions.length === 0) return undefined;
    loadTasks({ quiet: true });
    return undefined;
  }, [
    isSharedView,
    ownerId,
    myPermissions.length,
    loadTasks,
    viewMode,
    calendarRange.start,
    calendarRange.end,
    weekStart
  ]);

  useEffect(() => {
    if (!isBoardOwner) return undefined;
    loadAccessPanel();
    return undefined;
  }, [isBoardOwner, loadAccessPanel]);

  useEffect(() => {
    if (isSharedView) return undefined;
    let cancelled = false;

    const bootstrap = async () => {
      try {
        if (isGuest) {
          setOwnerId('');
          return;
        }
        if (isSuperior) {
          const response = await axios.get('/taskboard/workers');
          if (cancelled) return;
          const first = response.data.workers?.[0];
          setOwnerId(first ? String(first.id) : '');
        } else {
          setOwnerId(myId);
        }
      } catch (bootError) {
        console.error('Failed to bootstrap taskboard:', bootError);
        if (!cancelled) {
          setError('Failed to load taskboard access.');
          setLoading(false);
        }
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [isSharedView, isGuest, isSuperior, myId]);

  useEffect(() => {
    if (isSharedView) return undefined;
    if (!ownerId) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      await Promise.all([
        loadTasks(),
        loadGamification(),
        loadMission(),
        loadProjects(),
        loadObjectives(),
        loadAchievements(),
        loadVictories()
      ]);
      if (!cancelled) setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [
    isSharedView,
    ownerId,
    loadTasks,
    loadGamification,
    loadMission,
    loadProjects,
    loadObjectives,
    loadAchievements,
    loadVictories
  ]);

  useEffect(() => {
    if (typeof user?.workboardXp === 'number' && !isSuperior) {
      setTotalXp(user.workboardXp);
    }
  }, [user?.workboardXp, isSuperior]);

  useEffect(() => {
    if (displayedXp === totalXp) return undefined;

    const diff = totalXp - displayedXp;
    const step = Math.max(1, Math.round(Math.abs(diff) / 12));
    const timer = setTimeout(() => {
      setDisplayedXp((prev) => {
        if (prev === totalXp) return prev;
        if (prev < totalXp) return Math.min(totalXp, prev + step);
        return Math.max(totalXp, prev - step);
      });
    }, 28);

    return () => clearTimeout(timer);
  }, [displayedXp, totalXp]);

  useEffect(
    () => () => {
      if (xpToastTimerRef.current) clearTimeout(xpToastTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (user?.role !== 'admin') return undefined;

    const beat = () => {
      axios.post('/taskboard/presence/heartbeat').catch(() => {});
    };

    beat();
    const interval = setInterval(beat, 20000);

    const markOffline = () => {
      const token = localStorage.getItem('token');
      const base = axios.defaults.baseURL || '';
      if (token) {
        fetch(`${base}/taskboard/presence/offline`, {
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
    setAddingTag(false);
    setNewTagName('');
  };

  const openCreate = (dateKey) => {
    if (!dateKey) return;
    if (isGuest) {
      requireSignIn();
      return;
    }
    if (!canEdit) return;
    setViewTask(null);
    setEditingId(null);
    setAddingTag(false);
    setNewTagName('');
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
    setAddingTag(false);
    setNewTagName('');
    setModalMode('edit');
  };

  const selectWeek = (index) => {
    setActiveWeekIndex(index);
    setViewMode('week');
  };

  const saveTask = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (modalMode !== 'create' && modalMode !== 'edit') return;
    if (modalMode === 'create' && !canShowAddUi) return;
    if (modalMode === 'edit' && !canEditTasks) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        status: form.status,
        date: form.date,
        assignedBy: form.assignedBy,
        tag: form.tag,
        priority: form.priority || DEFAULT_PRIORITY,
        project: form.project || null
      };
      if (isSharedView && ownerId) {
        payload.ownerId = ownerId;
      }

      if (editingId) {
        const response = await axios.put(`/taskboard/tasks/${editingId}`, payload);
        const updated = response.data.task;
        if (response.data.tags) setTaskTags(response.data.tags);
        setViewTask(updated);
        setForm(formFromTask(updated));
        setModalMode('view');
        setEditingId(null);
        await applyXpResponse(response.data);
      } else {
        const response = await axios.post('/taskboard/tasks', payload);
        if (response.data.tags) setTaskTags(response.data.tags);
        closeModal();
        await applyXpResponse(response.data);
      }

      await loadTasks({ quiet: true });
      if (isSharedView) {
        await loadSharedView();
      }
    } catch (saveError) {
      console.error('Failed to save task:', saveError);
      setError(saveError.response?.data?.message || 'Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const tagOptions = useMemo(() => {
    const names = new Set(taskTags.filter(Boolean));
    if (form.tag) names.add(form.tag);
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [taskTags, form.tag]);

  const addNewTag = async (event) => {
    event?.preventDefault?.();
    if (!canEdit || savingTag) return;

    const name = newTagName.trim().replace(/\s+/g, ' ');
    if (!name) return;

    setSavingTag(true);
    try {
      const response = await axios.post('/taskboard/tags', { name });
      const savedName = response.data.tag || name;
      setTaskTags(response.data.tags || []);
      setForm((prev) => ({ ...prev, tag: savedName }));
      setNewTagName('');
      setAddingTag(false);
      setError('');
    } catch (tagError) {
      console.error('Failed to create tag:', tagError);
      setError(tagError.response?.data?.message || 'Failed to create tag.');
    } finally {
      setSavingTag(false);
    }
  };

  const changeStatus = async (taskId, status) => {
    if (!canChangeStatus) return;
    try {
      const response = await axios.patch(`/taskboard/tasks/${taskId}/status`, { status });
      await loadTasks({ quiet: true });
      if (viewTask && String(viewTask._id) === String(taskId)) {
        setViewTask((prev) =>
          prev
            ? {
                ...prev,
                ...(response.data.task || {}),
                status
              }
            : prev
        );
      }
      if (focusTask && String(focusTask._id) === String(taskId)) {
        setFocusTask(null);
      }
      await applyXpResponse(response.data);
      await loadObjectives();
    } catch (statusError) {
      console.error('Failed to update status:', statusError);
      setError(statusError.response?.data?.message || 'Failed to update status.');
    }
  };

  const submitQuickCapture = async (event) => {
    event?.preventDefault?.();
    if (isGuest) {
      requireSignIn();
      return;
    }
    if (!canEdit || quickSaving) return;
    const title = quickCapture.trim();
    if (!title) return;

    setQuickSaving(true);
    try {
      const response = await axios.post('/taskboard/tasks', {
        title: title.slice(0, 160),
        date: toDateKey(),
        status: 'started',
        priority: DEFAULT_PRIORITY,
        startTime: DEFAULT_START_TIME,
        endTime: DEFAULT_END_TIME,
        ...(isSharedView && ownerId ? { ownerId } : {})
      });
      setQuickCapture('');
      setQuickCaptureOpen(false);
      await loadTasks({ quiet: true });
      await applyXpResponse(response.data);
    } catch (captureError) {
      console.error('Quick capture failed:', captureError);
      setError(captureError.response?.data?.message || 'Failed to capture task.');
    } finally {
      setQuickSaving(false);
    }
  };

  const saveCustomMission = async () => {
    if (!canEdit) return;
    try {
      const response = await axios.put('/taskboard/mission', {
        date: toDateKey(),
        customTitle: missionDraft.trim()
      });
      setCustomMissionTitle(response.data.customTitle || '');
      setMissionEditing(false);
    } catch (missionError) {
      console.error('Failed to save mission:', missionError);
      setError(missionError.response?.data?.message || 'Failed to save mission.');
    }
  };

  const saveFocusTime = async (seconds, options = {}) => {
    if (!canEdit || !focusTask?._id || !seconds) return;
    const taskId = focusTask._id;
    const payload = { seconds: Math.max(0, Math.floor(Number(seconds) || 0)) };
    if (payload.seconds <= 0) return;

    try {
      if (options.keepalive) {
        const token = localStorage.getItem('token');
        const base = axios.defaults.baseURL || '';
        if (token) {
          fetch(`${base}/taskboard/tasks/${taskId}/focus`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            keepalive: true
          }).catch(() => {});
        }
        // Optimistic local bump so the next session display stays coherent.
        setFocusTask((prev) =>
          prev
            ? { ...prev, focusTime: (Number(prev.focusTime) || 0) + payload.seconds }
            : prev
        );
        return;
      }

      const response = await axios.patch(`/taskboard/tasks/${taskId}/focus`, payload);
      const updated = response.data.task;
      setFocusTask((prev) => (prev ? { ...prev, focusTime: updated.focusTime } : prev));
      if (viewTask && String(viewTask._id) === String(taskId)) {
        setViewTask((prev) => (prev ? { ...prev, focusTime: updated.focusTime } : prev));
      }
      await loadTasks({ quiet: true });
      await loadGamification();
      if (response.data.newlyUnlocked?.length) {
        showXpToast(0, { achievement: response.data.newlyUnlocked[0] });
        await loadAchievements();
      }
    } catch (focusError) {
      console.error('Failed to save focus time:', focusError);
      throw focusError;
    }
  };

  const openFocusMode = (task) => {
    if (!task) return;
    setFocusTask(task);
    setModalMode(null);
  };

  const handleFocusComplete = async () => {
    if (!focusTask?._id) return;
    const id = focusTask._id;
    setFocusTask(null);
    await changeStatus(id, 'completed');
  };

  useEffect(() => {
    const isTypingTarget = (target) => {
      const tag = target?.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable
      );
    };

    const onKeyDown = (event) => {
      const key = String(event.key || '').toLowerCase();
      const isMod = event.metaKey || event.ctrlKey;
      const typing = isTypingTarget(event.target);

      if (key === 'escape') {
        if (searchOpen) {
          event.preventDefault();
          setSearchOpen(false);
          setSearchQuery('');
          return;
        }
        if (quickCaptureOpen) {
          event.preventDefault();
          setQuickCaptureOpen(false);
          setQuickCapture('');
          return;
        }
        if (deleteTarget) {
          event.preventDefault();
          cancelDelete();
          return;
        }
        if (modalMode) {
          event.preventDefault();
          closeModal();
          return;
        }
        if (focusTask) {
          event.preventDefault();
          setFocusTask(null);
        }
        return;
      }

      if (isMod && key === 'k') {
        if (isGuest) {
          event.preventDefault();
          requireSignIn();
          return;
        }
        if (!canEdit) return;
        if (typing && !quickCaptureOpen) return;
        event.preventDefault();
        setSearchOpen(false);
        setQuickCaptureOpen(true);
        requestAnimationFrame(() => quickCaptureRef.current?.focus());
        return;
      }

      if (typing || isMod || event.altKey) return;

      if (key === '/' ) {
        event.preventDefault();
        setQuickCaptureOpen(false);
        setSearchOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
        return;
      }

      if (key === 'n') {
        event.preventDefault();
        if (isGuest) {
          requireSignIn();
          return;
        }
        if (canEdit) {
          openCreate(todayKey);
        }
        return;
      }
      if (key === 't') {
        event.preventDefault();
        goToToday();
        setBoardMode('board');
        return;
      }
      if (key === 'f' && canEdit) {
        const todayTasks = (tasksByDate[todayKey] || []).filter(
          (task) => task.status !== 'completed' && task.status !== 'cancelled'
        );
        if (todayTasks[0]) {
          event.preventDefault();
          openFocusMode(todayTasks[0]);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    canEdit,
    isGuest,
    quickCaptureOpen,
    requireSignIn,
    searchOpen,
    deleteTarget,
    modalMode,
    focusTask,
    todayKey,
    tasksByDate
  ]);

  useEffect(() => {
    loadObjectives();
  }, [loadObjectives]);

  const saveVictory = async (payload) => {
    if (!canEdit || victorySaving) return;
    setVictorySaving(true);
    setVictoriesError('');
    try {
      const response = await axios.put('/taskboard/victories', payload);
      const saved = response.data.victory;
      setVictories((prev) => {
        const rest = prev.filter((entry) => entry.date !== saved.date);
        return [saved, ...rest];
      });
    } catch (saveError) {
      console.error('Failed to save victory:', saveError);
      setVictoriesError(saveError.response?.data?.message || 'Failed to save win.');
    } finally {
      setVictorySaving(false);
    }
  };

  const removeVictory = async (entry) => {
    if (!canEdit || !entry?._id) return;
    try {
      await axios.delete(`/taskboard/victories/${entry._id}`);
      setVictories((prev) => prev.filter((row) => String(row._id) !== String(entry._id)));
    } catch (deleteError) {
      console.error('Failed to delete victory:', deleteError);
      setVictoriesError(deleteError.response?.data?.message || 'Failed to delete win.');
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
    if (!canDeleteTasks || !deleteTarget || deleting) return;
    setDeleting(true);
    try {
      const response = await axios.delete(`/taskboard/tasks/${deleteTarget._id}`);
      if (viewTask && String(viewTask._id) === String(deleteTarget._id)) {
        closeModal();
      }
      setDeleteTarget(null);
      await loadTasks({ quiet: true });
      await applyXpResponse(response.data);
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
      const response = await axios.get('/taskboard/report/docx', {
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
          ? `taskboard-daily-${reportAnchorDate}.docx`
          : reportPeriod === 'week'
            ? `taskboard-weekly-${weekStart}-to-${shiftDateKey(weekStart, WORK_WEEK_END_OFFSET)}.docx`
            : `taskboard-monthly-${selectedMonthKey}.docx`;
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
      console.error('Failed to download taskboard report:', downloadErr);
      let message = 'Failed to download report.';
      if (downloadErr.response?.data?.message) {
        message = downloadErr.response.data.message;
      } else if (downloadErr.message) {
        message = downloadErr.message;
      }
      setReportError(message);
    } finally {
      setReportDownloading(false);
    }
  };

  const createCalendarShareLink = async () => {
    if (!ownerId || shareCreating || !canEdit) return;
    setShareCreating(true);
    setShareError('');
    setShareCopyNote('');
    try {
      const response = await axios.post('/taskboard/report/share', {
        period: reportPeriod,
        date: reportAnchorDate,
        ownerId
      });
      const sharePath = response.data.path || `/taskboard/share/${response.data.token}`;
      const shareUrl = `${window.location.origin}${sharePath}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareCopyNote('View link copied — friends can open the calendar read-only.');
    } catch (shareErr) {
      console.error('Failed to create taskboard share link:', shareErr);
      setShareError(shareErr.response?.data?.message || 'Failed to create share link.');
    } finally {
      setShareCreating(false);
    }
  };

  const dayLabelForDate = (dateKey) => {
    const weekday = weekdayLabelFor(dateKey);
    if (weekday) return `${weekday} · ${formatShortDate(dateKey)}`;
    return formatShortDate(dateKey);
  };

  const visibleTasks = useMemo(() => flattenTasksByDate(tasksByDate), [tasksByDate]);
  const statsTasks = useMemo(() => {
    if (historyTasks.length === 0) return visibleTasks;
    const byId = new Map();
    historyTasks.forEach((task) => {
      if (task?._id) byId.set(String(task._id), task);
    });
    visibleTasks.forEach((task) => {
      if (task?._id) byId.set(String(task._id), task);
    });
    return [...byId.values()];
  }, [historyTasks, visibleTasks]);

  const levelProgress = useMemo(() => calculateLevelProgress(displayedXp), [displayedXp]);
  const currentStreak = streakMeta.current;
  const longestStreak = streakMeta.longest;
  const royalToday = useMemo(
    () => calculateRoyalScore({ tasks: statsTasks, currentStreak, todayKey }),
    [statsTasks, currentStreak, todayKey]
  );
  const royalYesterday = useMemo(() => {
    const yesterdayKey = shiftDateKey(todayKey, -1);
    const tasksThroughYesterday = statsTasks.filter((task) => task.date <= yesterdayKey);
    const yesterdayStreak = currentStreak > 1 ? currentStreak - 1 : 0;
    return calculateRoyalScore({
      tasks: tasksThroughYesterday,
      currentStreak: yesterdayStreak,
      todayKey: yesterdayKey
    });
  }, [statsTasks, todayKey, currentStreak]);
  const royalDelta = royalToday.score - royalYesterday.score;
  const weeklySummary = useMemo(
    () => calculateWeeklySummary(weekStart, statsTasks, activeWeekIndex),
    [weekStart, statsTasks, activeWeekIndex]
  );
  const todaysMission = useMemo(
    () => buildTodaysMission(statsTasks, todayKey, customMissionTitle),
    [statsTasks, todayKey, customMissionTitle]
  );
  const todayDailyScore = useMemo(
    () => calculateDailyScore(todayKey, statsTasks),
    [todayKey, statsTasks]
  );
  const searchResults = useMemo(
    () =>
      searchWorkboardItems({
        query: searchQuery,
        tasks: statsTasks,
        projects,
        achievements,
        victories
      }),
    [searchQuery, statsTasks, projects, achievements, victories]
  );
  const viewTaskHistory = useMemo(
    () => (viewTask ? buildTaskHistoryTimeline(viewTask) : []),
    [viewTask]
  );

  const withSignInPrompt = (content) => (
    <>
      {signInPrompt}
      {content}
    </>
  );

  if (loading) {
    return withSignInPrompt(
      <AdminLayout chrome="minimal" standalone={layoutStandalone}>
        <BoardShell>
          <BoardLoader label={isSharedView ? 'Opening shared calendar…' : 'Opening taskboard…'} />
        </BoardShell>
      </AdminLayout>
    );
  }

  if (isDashboardMode) {
    return withSignInPrompt(
      <AdminLayout chrome="minimal" standalone={layoutStandalone}>
        <BoardShell>
          <WorkboardDashboard
            user={user}
            todayKey={todayKey}
            weekStart={weekStart}
            weekIndex={activeWeekIndex}
            totalXp={totalXp}
            royalScore={royalToday.score}
            currentStreak={currentStreak}
            statsTasks={statsTasks}
            customMissionTitle={customMissionTitle}
            objectives={objectives}
            onOpenTask={(task) => {
              setBoardMode('board');
              goToToday();
              openView(task, notePaperColorFor(0));
            }}
            onGoToday={() => {
              goToToday();
            }}
            onGoBoard={() => setBoardMode('board')}
            onGoAchievements={() => setBoardMode('achievements')}
            onGoProjects={() => setBoardMode('projects')}
            onGoAnalytics={() => setBoardMode('analytics')}
            onGoLeaderboard={() => setBoardMode('leaderboard')}
          />
          {xpToast ? (
            <div className="wb-xp-toast" key={xpToast.id} role="status" aria-live="polite">
              {xpToast.leveledUp ? (
                <>
                  <p className="wb-xp-toast-title">Level Up</p>
                  <p className="wb-xp-toast-xp">LEVEL {xpToast.newLevel}</p>
                </>
              ) : xpToast.streakRestored ? (
                <>
                  <p className="wb-xp-toast-title">🔥 Streak restored</p>
                  <p className="wb-xp-toast-xp">{xpToast.restoredStreak} days</p>
                </>
              ) : xpToast.achievement ? (
                <>
                  <p className="wb-xp-toast-title">🏆 Achievement unlocked</p>
                  <p className="wb-xp-toast-xp">{xpToast.achievement.title}</p>
                </>
              ) : (
                <>
                  <p className="wb-xp-toast-title">✓ Completed</p>
                  <p className="wb-xp-toast-xp">+{xpToast.awarded} XP</p>
                </>
              )}
            </div>
          ) : null}
        </BoardShell>
      </AdminLayout>
    );
  }

  if (isAchievementsMode) {
    return withSignInPrompt(
      <AdminLayout chrome="minimal" standalone={layoutStandalone}>
        <BoardShell>
          <WorkboardAchievements
            achievements={achievements}
            onBack={() => setBoardMode('board')}
          />
        </BoardShell>
      </AdminLayout>
    );
  }

  if (isProjectsMode) {
    return withSignInPrompt(
      <AdminLayout chrome="minimal" standalone={layoutStandalone}>
        <BoardShell>
          <WorkboardProjectsPanel
            projects={projects}
            objectives={objectives}
            weekStart={weekStart}
            canEdit={canEdit}
            onClose={() => setBoardMode('board')}
            onOpenTask={(task) => {
              setBoardMode('board');
              openView(task, notePaperColorFor(0));
            }}
            onCreateProject={async (title) => {
              await axios.post('/taskboard/projects', { title });
              await loadProjects();
            }}
            onCompleteProject={async (project) => {
              await axios.put(`/taskboard/projects/${project._id}`, { status: 'completed' });
              await loadProjects();
            }}
            onCreateObjective={async (payload) => {
              await axios.post('/taskboard/objectives', payload);
              await loadObjectives();
            }}
            onUpdateObjective={async (id, patch) => {
              await axios.put(`/taskboard/objectives/${id}`, patch);
              await loadObjectives();
            }}
          />
        </BoardShell>
      </AdminLayout>
    );
  }

  if (isAnalyticsMode) {
    return withSignInPrompt(
      <AdminLayout chrome="minimal" standalone={layoutStandalone}>
        <BoardShell>
          <WorkboardAnalytics
            todayKey={todayKey}
            weekStart={weekStart}
            weekIndex={activeWeekIndex}
            statsTasks={statsTasks}
            totalXp={totalXp}
            royalScore={royalToday.score}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            loading={false}
            error=""
            onRetry={() => loadGamification()}
            onBack={() => setBoardMode('board')}
            onGoVictories={() => setBoardMode('victories')}
          />
        </BoardShell>
      </AdminLayout>
    );
  }

  if (isLeaderboardMode) {
    return withSignInPrompt(
      <AdminLayout chrome="minimal" standalone={layoutStandalone}>
        <BoardShell>
          <WorkboardLeaderboard
            user={user}
            isGuest={isGuest}
            onRequireSignIn={requireSignIn}
            onAvatarUpdated={(nextUser) => {
              if (nextUser) refreshProfile();
            }}
            onBack={() => setBoardMode('board')}
          />
        </BoardShell>
      </AdminLayout>
    );
  }

  if (isVictoriesMode) {
    return withSignInPrompt(
      <AdminLayout chrome="minimal" standalone={layoutStandalone}>
        <BoardShell>
          <WorkboardVictoryJournal
            todayKey={todayKey}
            statsTasks={statsTasks}
            currentStreak={currentStreak}
            victories={victories}
            canEdit={canEdit}
            loading={victoriesLoading}
            error={victoriesError}
            saving={victorySaving}
            onSave={saveVictory}
            onDelete={removeVictory}
            onRetry={loadVictories}
            onBack={() => setBoardMode('board')}
          />
        </BoardShell>
      </AdminLayout>
    );
  }

  const showModal = modalMode !== null;
  const isFormMode = modalMode === 'create' || modalMode === 'edit';
  const viewTimeLabel = viewTask
    ? formatTimeRange12h(viewTask.startTime, viewTask.endTime)
    : null;
  const formTimeHint = formatTimeRange12h(form.startTime, form.endTime);

  return withSignInPrompt(
    <AdminLayout chrome="minimal" standalone={layoutStandalone}>
      <BoardShell className={mobileLayoutMode === 'overview' ? 'wb-board--overview' : ''}>
        {error ? <div className="wb-error">{error}</div> : null}

        <div className="wb-mobile-layout-bar">
          <div className="wb-mobile-layout-toggle" role="group" aria-label="Board layout">
            <button
              type="button"
              className={`wb-view-btn${mobileLayoutMode === 'cards' ? ' is-active' : ''}`}
              onClick={() => setMobileLayoutMode('cards')}
            >
              Cards
            </button>
            <button
              type="button"
              className={`wb-view-btn${mobileLayoutMode === 'overview' ? ' is-active' : ''}`}
              onClick={() => setMobileLayoutMode('overview')}
            >
              Overview
            </button>
          </div>
          {mobileLayoutMode === 'overview' ? (
            <p className="wb-mobile-layout-hint">Full-page fit · tap a note to open details</p>
          ) : (
            <p className="wb-mobile-layout-hint">Swipe toolbar rows sideways for more options</p>
          )}
        </div>

        <div
          ref={overviewFrameRef}
          className={`wb-page-scaler${mobileLayoutMode === 'overview' ? ' is-overview' : ''}`}
          style={
            mobileLayoutMode === 'overview' && overviewFrameHeight
              ? { height: overviewFrameHeight }
              : undefined
          }
        >
          <div
            ref={overviewInnerRef}
            className={`wb-page-scaler-inner${
              mobileLayoutMode === 'overview' ? ' is-overview' : ''
            }`}
            style={
              mobileLayoutMode === 'overview'
                ? {
                    width: OVERVIEW_PAGE_WIDTH,
                    transform: `scale(${overviewScale})`,
                    transformOrigin: 'top left'
                  }
                : undefined
            }
          >

        <div className="wb-topbar">
          {isSharedView ? (
            <div className="wb-shared-header">
              <div className="wb-shared-header-main">
                <BoardWebsiteLink className="wb-website-link--toolbar" />
                {myPermissions.length > 0 ? (
                  <span className="wb-shared-badge is-collaborator">Can edit</span>
                ) : (
                  <span className="wb-shared-badge">View only</span>
                )}
              </div>
              <div className="wb-shared-header-copy">
                <h1 className="wb-shared-title">
                  {shareMeta?.owner?.username || 'Taskboard'} calendar
                </h1>
                <p className="wb-shared-range">{sharedRangeLabel}</p>
                <p className="wb-shared-hint">
                  {shareMeta?.period === 'day'
                    ? 'Daily calendar'
                    : shareMeta?.period === 'week'
                      ? 'Weekly calendar'
                      : 'Monthly calendar'}
                  {' · '}
                  {myPermissions.length > 0 ? 'shared edit access' : 'read-only'}
                </p>
              </div>
              {myPermissions.length === 0 ? (
                <div className="wb-shared-access-actions">
                  {accessRequest?.status === 'pending' ? (
                    <p className="wb-shared-access-status">
                      Edit request sent — waiting for {shareMeta?.owner?.username || 'the owner'} to
                      approve. Refresh this page after they grant access.
                    </p>
                  ) : accessRequest?.status === 'denied' ? (
                    <>
                      <p className="wb-shared-access-status is-denied">
                        Edit access was denied
                        {accessRequest.ownerNote ? `: ${accessRequest.ownerNote}` : '.'}
                      </p>
                      <button
                        type="button"
                        className="wb-shared-access-btn"
                        onClick={requestEditAccess}
                        disabled={accessRequestSubmitting}
                      >
                        {accessRequestSubmitting ? 'Sending…' : 'Request again'}
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="wb-modal-label" htmlFor="wb-access-request-message">
                        Message to owner (optional)
                      </label>
                      <textarea
                        id="wb-access-request-message"
                        className="wb-access-note-input"
                        value={accessRequestMessage}
                        onChange={(event) => setAccessRequestMessage(event.target.value)}
                        rows={2}
                        maxLength={500}
                        placeholder="Tell them why you need access"
                      />
                      <button
                        type="button"
                        className="wb-shared-access-btn"
                        onClick={requestEditAccess}
                        disabled={accessRequestSubmitting}
                      >
                        {accessRequestSubmitting ? 'Sending…' : 'Request edit access'}
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <div className="wb-toolbar">
                <div className="wb-toolbar-row wb-toolbar-row--primary">
                  <BoardWebsiteLink className="wb-website-link--toolbar" />
                  <div className="wb-toolbar-scroll">
                    <div className="wb-mode-toggle" role="group" aria-label="Board mode">
                      <button
                        type="button"
                        className="wb-mode-btn"
                        aria-pressed="false"
                        onClick={() => setBoardMode('dashboard')}
                      >
                        Command
                      </button>
                      <button
                        type="button"
                        className="wb-mode-btn is-active"
                        aria-pressed="true"
                      >
                        Taskboard
                      </button>
                      <button
                        type="button"
                        className="wb-mode-btn"
                        aria-pressed="false"
                        onClick={() => navigate('/noteboard')}
                      >
                        Noteboard
                      </button>
                      <button
                        type="button"
                        className="wb-mode-btn"
                        aria-pressed="false"
                        onClick={() => setBoardMode('projects')}
                      >
                        Battles
                      </button>
                      <button
                        type="button"
                        className="wb-mode-btn"
                        aria-pressed="false"
                        onClick={() => setBoardMode('achievements')}
                      >
                        Marks
                      </button>
                      <button
                        type="button"
                        className="wb-mode-btn"
                        aria-pressed="false"
                        onClick={() => setBoardMode('analytics')}
                        title="Analytics"
                      >
                        Intel
                      </button>
                      <button
                        type="button"
                        className="wb-mode-btn"
                        aria-pressed="false"
                        onClick={() => setBoardMode('leaderboard')}
                        title="Leaderboard"
                      >
                        Leaderboard
                      </button>
                      <button
                        type="button"
                        className="wb-mode-btn"
                        aria-pressed="false"
                        onClick={() => setBoardMode('victories')}
                        title="Victory Journal"
                      >
                        Wins
                      </button>
                    </div>
                  </div>
                </div>

                <div className="wb-toolbar-row wb-toolbar-row--controls">
                  <button
                    type="button"
                    className="wb-today-btn"
                    onClick={goToToday}
                    title="Jump to today (T)"
                  >
                    Today
                  </button>

                  <button
                    type="button"
                    className="wb-mode-btn"
                    onClick={() => {
                      setSearchOpen(true);
                      requestAnimationFrame(() => searchInputRef.current?.focus());
                    }}
                    title="Search (/)"
                    aria-label="Search taskboard"
                  >
                    Search
                  </button>

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
                </div>

                <div className="wb-toolbar-row wb-toolbar-row--weeks">
                  <div className="wb-toolbar-scroll">
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
                </div>
              </div>

          {viewMode === 'week' ? (
            <p className="wb-week-range">{formatWeekRange(weekStart)}</p>
          ) : (
            <p className="wb-week-range">{formatMonthLabel(selectedMonthKey)} · Sun–Sat</p>
          )}
            </>
          )}
        </div>

        {!isSharedView ? (
        <div
          className={`wb-game-strip${viewMode === 'week' ? ' has-week' : ''}`}
          aria-label="Productivity summary"
        >
          <div className="wb-level-card">
            <TaskboardPlayerName user={user} editable={canEdit} />
            <p className="wb-level-title">Level {levelProgress.level}</p>
            <div className="wb-xp-track" aria-hidden="true">
              <span
                className="wb-xp-fill"
                style={{ width: `${levelProgress.percent}%` }}
              />
            </div>
            <p className="wb-xp-copy">
              <span className="wb-xp-live">{levelProgress.currentXP}</span>
              {' / '}
              {levelProgress.levelXP} XP
            </p>
          </div>

          <div className="wb-royal-card">
            <p className="wb-game-kicker">Royal Score</p>
            <p className="wb-royal-score">{royalToday.score}</p>
            <p className={`wb-royal-delta${royalDelta >= 0 ? ' is-up' : ' is-down'}`}>
              {royalDelta === 0
                ? 'No change from yesterday'
                : `${royalDelta > 0 ? '↑' : '↓'} ${Math.abs(royalDelta)} from yesterday`}
            </p>
          </div>

          <div className="wb-streak-card">
            <p className="wb-game-kicker">Streak</p>
            <p className="wb-streak-value">
              <span aria-hidden="true">🔥</span> {currentStreak} Day
              {currentStreak === 1 ? '' : 's'}
            </p>
            <p className="wb-streak-best">Best {longestStreak}</p>
            {streakMeta.canRestore && canEdit ? (
              <button
                type="button"
                className="wb-streak-restore"
                onClick={handleRestoreStreak}
                disabled={streakRestoring}
              >
                {streakRestoring
                  ? 'Restoring…'
                  : `Restore ${streakMeta.streakBeforeBreak}-day streak · ${streakMeta.restoreXpCost} XP`}
              </button>
            ) : null}
            {streakMeta.streakBeforeBreak > 1 && !streakMeta.canRestore && canEdit ? (
              <p className="wb-streak-restore-hint">
                {streakMeta.restoresRemainingThisMonth <= 0
                  ? 'No streak restores left this month.'
                  : totalXp < streakMeta.restoreXpCost
                    ? `Need ${streakMeta.restoreXpCost} XP to restore your ${streakMeta.streakBeforeBreak}-day streak.`
                    : null}
              </p>
            ) : null}
            {streakError ? <p className="wb-streak-error">{streakError}</p> : null}
          </div>

          {viewMode === 'week' ? (
            <div className="wb-week-summary">
              <p className="wb-game-kicker">{weeklySummary.label}</p>
              <div className="wb-week-summary-grid">
                <span>
                  <strong>{weeklySummary.completed}</strong> Completed
                </span>
                <span>
                  <strong>{weeklySummary.planned}</strong> Planned
                </span>
                <span>
                  <strong>{weeklySummary.completionRate}%</strong> Completion
                </span>
                <span>
                  <strong>{weeklySummary.xp}</strong> XP
                </span>
                <span>
                  <strong>🔥 {currentStreak}</strong> Day Streak
                </span>
              </div>
            </div>
          ) : null}
        </div>
        ) : null}

        {!isSharedView && viewMode === 'week' && objectives.some((row) => row.weekStart === weekStart) ? (
          <div className="wb-week-objectives" aria-label="Weekly objectives">
            {objectives
              .filter((row) => row.weekStart === weekStart)
              .slice(0, 2)
              .map((objective) => {
                const target = Math.max(1, Number(objective.target) || 1);
                const current = Math.max(0, Number(objective.current) || 0);
                const percent = Math.min(100, Math.round((current / target) * 100));
                return (
                  <div key={objective._id} className="wb-week-objective-chip">
                    <p className="wb-game-kicker">Weekly Objective</p>
                    <p className="wb-week-objective-title">{objective.title}</p>
                    <p className="wb-mission-meta">
                      Target {target} · Current {current} · {percent}%
                    </p>
                    <div className="wb-xp-track" aria-hidden="true">
                      <span className="wb-xp-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : null}

        {!isSharedView || canShowAddUi ? (
        <div className="wb-mission-quick-row">
        {canShowAddUi ? (
          <form className="wb-quick-capture" onSubmit={submitQuickCapture}>
            <label className="wb-game-kicker" htmlFor="wb-quick-capture">
              Quick Capture
            </label>
            <div className="wb-quick-capture-row">
              <input
                id="wb-quick-capture"
                ref={quickCaptureRef}
                value={quickCapture}
                onChange={(event) => setQuickCapture(event.target.value)}
                onFocus={() => {
                  if (isGuest) {
                    requireSignIn();
                    return;
                  }
                  setQuickCaptureOpen(true);
                }}
                placeholder="Add a task…"
                maxLength={160}
              />
              <button type="submit" disabled={quickSaving || !quickCapture.trim()}>
                {quickSaving ? '…' : 'Add'}
              </button>
            </div>
            <p className="wb-quick-hint">Ctrl/Cmd + K · / search · N new · F focus · T today · Esc close</p>
          </form>
        ) : null}

        {!isSharedView ? (
        <section className="wb-mission-card" aria-label="Today's mission">
          <div className="wb-mission-head">
            <p className="wb-game-kicker">Today&apos;s Mission</p>
            {canEdit ? (
              <button
                type="button"
                className="wb-mission-edit"
                onClick={() => {
                  setMissionDraft(customMissionTitle || todaysMission.title || '');
                  setMissionEditing((prev) => !prev);
                }}
              >
                {missionEditing ? 'Cancel' : 'Customize'}
              </button>
            ) : null}
          </div>

          {missionEditing ? (
            <div className="wb-mission-edit-row">
              <input
                value={missionDraft}
                onChange={(event) => setMissionDraft(event.target.value)}
                placeholder="Set a custom mission for today"
                maxLength={200}
              />
              <button type="button" className="wb-today-btn" onClick={saveCustomMission}>
                Save
              </button>
            </div>
          ) : todaysMission.empty ? (
            <p className="wb-mission-empty">Clear board. You&apos;ve got nothing scheduled.</p>
          ) : (
            <>
              <h2 className="wb-mission-title">
                {todaysMission.title || 'Execute today\'s priorities'}
              </h2>
              <p className="wb-mission-meta">
                {todaysMission.priorityCount} priority task
                {todaysMission.priorityCount === 1 ? '' : 's'}
                {' · '}
                {todaysMission.xpAvailable} XP available
                {' · '}
                Estimated time: {todaysMission.estimatedLabel}
                {todayDailyScore.planned > 0
                  ? ` · ${todayDailyScore.score} / 100 today`
                  : ''}
              </p>
            </>
          )}
        </section>
        ) : null}
        </div>
        ) : null}

        {viewMode === 'week' || viewMode === 'day' ? (
          <div className="wb-calendar" ref={calendarRef}>
            {days.map((day) => {
              const dayTasks = tasksByDate[day.dateKey] || [];
              const emptyCount = canShowAddUi
                ? Math.max(1, EMPTY_SLOT_COUNT - dayTasks.length)
                : Math.max(0, EMPTY_SLOT_COUNT - dayTasks.length);
              const isToday = day.dateKey === todayKey;

              return (
                <div
                  key={day.dateKey}
                  className={`wb-day-row${isToday ? ' is-today' : ''}${
                    day.inSelectedMonth === false ? ' is-outside-month' : ''
                  }`}
                >
                  <div className="wb-day-label">
                    <p className="wb-day-name">{day.label}</p>
                    <p className="wb-day-date">{formatShortDate(day.dateKey)}</p>
                    {(() => {
                      const daily = calculateDailyScore(day.dateKey, statsTasks);
                      if (daily.planned === 0) {
                        return <p className="wb-day-score is-empty">No tasks</p>;
                      }
                      return (
                        <p className="wb-day-score">
                          <span className="wb-day-score-value">{daily.score}</span>
                          <span className="wb-day-score-meta">
                            / 100 · {daily.completed}/{daily.planned}
                          </span>
                        </p>
                      );
                    })()}
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
                          {task.tag ? <p className="wb-note-tag">{task.tag}</p> : null}
                          {task.priority && task.priority !== 'NORMAL' ? (
                            <p className={`wb-note-priority wb-note-priority--${String(task.priority).toLowerCase()}`}>
                              {priorityLabel(task.priority)}
                            </p>
                          ) : null}

                          {canChangeStatus || canDeleteTasks ? (
                            <div
                              className="wb-note-actions"
                              onClick={(event) => event.stopPropagation()}
                              onKeyDown={(event) => event.stopPropagation()}
                            >
                              {canEdit ? (
                                <button
                                  type="button"
                                  className="wb-focus-chip"
                                  onClick={() => openFocusMode(task)}
                                >
                                  Focus
                                </button>
                              ) : null}
                              {canChangeStatus ? (
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
                              ) : null}
                              {canDeleteTasks ? (
                              <button
                                type="button"
                                aria-label="Delete task"
                                onClick={() => requestDelete(task)}
                              >
                                ×
                              </button>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}

                    {Array.from({ length: emptyCount }).map((_, index) => (
                      <button
                        key={`empty-${day.dateKey}-${index}`}
                        type="button"
                        className={`wb-slot-empty${canShowAddUi ? ' is-addable' : ''}`}
                        aria-label={canShowAddUi ? `Add task on ${day.label}` : undefined}
                        disabled={!canShowAddUi}
                        onClick={() => {
                          openCreate(day.dateKey);
                        }}
                      >
                        {canShowAddUi ? <span className="wb-slot-plus" aria-hidden="true">+</span> : null}
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
                          cell.inMonth === false ? ' is-outside-month' : ''
                        }${canShowAddUi ? ' is-editable' : ''}`}
                      >
                        <div className="wb-month-cell-top">
                          <span className="wb-month-day-num">{cell.day}</span>
                          {canShowAddUi ? (
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
                          {dayTasks.length === 0 && canShowAddUi ? (
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

        {!isSharedView ? (
        <div className="wb-report-bar">
          <div className="wb-report-bar-main">
            <span className="wb-report-label">Share &amp; report</span>
            <div className="wb-report-periods" role="group" aria-label="Share period">
              {[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' }
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
                    setShareError('');
                    setShareCopyNote('');
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="wb-report-range">{reportRangeLabel}</p>
            <button
              type="button"
              className="wb-report-share"
              onClick={() => {
                setAccessRequestsOpen((open) => {
                  const next = !open;
                  if (next) loadAccessPanel();
                  return next;
                });
              }}
              disabled={!isBoardOwner}
            >
              Manage access
              {accessRequests.length || collaborators.length
                ? ` (${[
                    accessRequests.length ? `${accessRequests.length} pending` : '',
                    collaborators.length ? `${collaborators.length} shared` : ''
                  ]
                    .filter(Boolean)
                    .join(', ')})`
                : ''}
            </button>
            <button
              type="button"
              className="wb-report-share"
              onClick={createCalendarShareLink}
              disabled={shareCreating || !ownerId || !canEdit}
              title="Create a read-only calendar link"
            >
              {shareCreating ? 'Creating…' : 'Share view'}
            </button>
            <button
              type="button"
              className="wb-report-download"
              onClick={downloadReport}
              disabled={reportDownloading || !ownerId}
            >
              {reportDownloading ? 'Preparing…' : 'Download report (.docx)'}
            </button>
          </div>
          {shareCopyNote ? <p className="wb-report-success">{shareCopyNote}</p> : null}
          {shareError ? <p className="wb-report-error">{shareError}</p> : null}
          {reportError ? <p className="wb-report-error">{reportError}</p> : null}
          {accessRequestsOpen ? (
            <div className="wb-access-requests-panel">
              <section className="wb-access-panel-section">
                <h3 className="wb-access-section-title">Pending requests</h3>
                {accessRequestsLoading ? (
                  <p className="wb-shared-access-status">Loading requests…</p>
                ) : accessRequests.length === 0 ? (
                  <p className="wb-shared-access-status">No pending access requests.</p>
                ) : (
                  <ul className="wb-access-requests-list">
                    {accessRequests.map((request) => (
                      <li key={request.id} className="wb-access-request-item">
                        <div>
                          <p className="wb-access-request-name">
                            {request.requester?.username || 'User'}
                          </p>
                          <p className="wb-access-email">{request.requester?.email}</p>
                          {request.message ? (
                            <p className="wb-access-request-message">“{request.message}”</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="wb-shared-access-btn"
                          onClick={() => setGrantTarget(request)}
                        >
                          Review
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="wb-access-collaborators-section">
                <h3 className="wb-access-section-title">People with access</h3>
                {collaboratorsLoading ? (
                  <p className="wb-shared-access-status">Loading shared access…</p>
                ) : collaborators.length === 0 ? (
                  <p className="wb-shared-access-status">
                    No one has edit access yet. Approved requests will appear here.
                  </p>
                ) : (
                  <ul className="wb-access-requests-list">
                    {collaborators.map((grant) => (
                      <li key={grant.id} className="wb-access-request-item">
                        <div>
                          <p className="wb-access-request-name">
                            {grant.collaborator?.username || 'User'}
                          </p>
                          <p className="wb-access-email">{grant.collaborator?.email}</p>
                          <p className="wb-access-permission-tags">
                            {formatCollaboratorPermissions(grant.permissions)}
                          </p>
                          {grant.grantedAt ? (
                            <p className="wb-access-granted-at">
                              Access granted {formatAccessGrantedAt(grant.grantedAt)}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="wb-access-revoke-btn"
                          onClick={() => setRevokeTarget(grant)}
                        >
                          Revoke
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          ) : null}
        </div>
        ) : null}
          </div>
        </div>

        <WorkboardAccessGrantModal
          open={Boolean(grantTarget)}
          request={grantTarget}
          resolving={accessResolveSaving}
          onClose={() => setGrantTarget(null)}
          onApprove={(permissions, ownerNote) =>
            resolveAccessRequest('approve', permissions, ownerNote)
          }
          onDeny={(ownerNote) => resolveAccessRequest('deny', [], ownerNote)}
        />

        {revokeTarget ? (
          <div className="wb-confirm-backdrop" onClick={() => !revokeSaving && setRevokeTarget(null)}>
            <div
              className="wb-confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="taskboard-revoke-title"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="wb-note-meta">Shared access</p>
              <h2 id="taskboard-revoke-title">Revoke taskboard access?</h2>
              <p className="wb-confirm-copy">
                <strong>{revokeTarget.collaborator?.username || 'This user'}</strong>
                {revokeTarget.collaborator?.email ? (
                  <>
                    {' '}
                    <span className="wb-access-email">({revokeTarget.collaborator.email})</span>
                  </>
                ) : null}{' '}
                will lose edit access to your taskboard. They can request access again later if
                needed.
              </p>
              <div className="wb-modal-actions">
                <button
                  type="button"
                  onClick={() => setRevokeTarget(null)}
                  disabled={revokeSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="wb-modal-danger is-solid"
                  onClick={confirmRevokeAccess}
                  disabled={revokeSaving}
                >
                  {revokeSaving ? 'Revoking…' : 'Revoke access'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {xpToast ? (
          <div className="wb-xp-toast" key={xpToast.id} role="status" aria-live="polite">
            {xpToast.leveledUp ? (
              <>
                <p className="wb-xp-toast-title">Level Up</p>
                <p className="wb-xp-toast-xp">LEVEL {xpToast.newLevel}</p>
              </>
            ) : xpToast.streakRestored ? (
              <>
                <p className="wb-xp-toast-title">🔥 Streak restored</p>
                <p className="wb-xp-toast-xp">{xpToast.restoredStreak} days</p>
              </>
            ) : xpToast.achievement && !(xpToast.awarded > 0) ? (
              <>
                <p className="wb-xp-toast-title">🏆 Achievement unlocked</p>
                <p className="wb-xp-toast-xp">{xpToast.achievement.title}</p>
              </>
            ) : (
              <>
                <p className="wb-xp-toast-title">✓ Completed</p>
                {xpToast.awarded > 0 ? (
                  <p className="wb-xp-toast-xp">+{xpToast.awarded} XP</p>
                ) : null}
                {xpToast.achievement ? (
                  <p className="wb-xp-toast-extra">🏆 {xpToast.achievement.title}</p>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {focusTask ? (
          <WorkboardFocusMode
            task={focusTask}
            onSaveFocus={saveFocusTime}
            onComplete={handleFocusComplete}
            onExit={() => setFocusTask(null)}
          />
        ) : null}

        {searchOpen ? (
          <div
            className="wb-search-backdrop"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          >
            <div
              className="wb-search-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Search taskboard"
              onClick={(event) => event.stopPropagation()}
            >
              <label className="wb-modal-label" htmlFor="wb-unified-search">
                Search
              </label>
              <input
                id="wb-unified-search"
                ref={searchInputRef}
                className="wb-search-input"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tasks, projects, achievements, wins…"
                autoComplete="off"
              />
              {!searchQuery.trim() ? (
                <p className="wb-search-empty">Type to search across your execution system.</p>
              ) : searchResults.total === 0 ? (
                <p className="wb-search-empty">Nothing matched. Try another word.</p>
              ) : (
                <div className="wb-search-results">
                  {searchResults.tasks.length > 0 ? (
                    <div className="wb-search-group">
                      <p className="wb-game-kicker">Tasks</p>
                      {searchResults.tasks.map((hit) => (
                        <button
                          key={`task-${hit.id}`}
                          type="button"
                          className="wb-search-hit"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            openView(hit.raw, notePaperColorFor(0));
                          }}
                        >
                          <span>{hit.title}</span>
                          <span className="wb-search-meta">{hit.meta}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {searchResults.projects.length > 0 ? (
                    <div className="wb-search-group">
                      <p className="wb-game-kicker">Projects</p>
                      {searchResults.projects.map((hit) => (
                        <button
                          key={`project-${hit.id}`}
                          type="button"
                          className="wb-search-hit"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            setBoardMode('projects');
                          }}
                        >
                          <span>{hit.title}</span>
                          <span className="wb-search-meta">{hit.meta}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {searchResults.achievements.length > 0 ? (
                    <div className="wb-search-group">
                      <p className="wb-game-kicker">Achievements</p>
                      {searchResults.achievements.map((hit) => (
                        <button
                          key={`ach-${hit.id}`}
                          type="button"
                          className="wb-search-hit"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            setBoardMode('achievements');
                          }}
                        >
                          <span>{hit.title}</span>
                          <span className="wb-search-meta">{hit.meta}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {searchResults.victories.length > 0 ? (
                    <div className="wb-search-group">
                      <p className="wb-game-kicker">Victories</p>
                      {searchResults.victories.map((hit) => (
                        <button
                          key={`win-${hit.id}`}
                          type="button"
                          className="wb-search-hit"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            setBoardMode('victories');
                          }}
                        >
                          <span>{hit.title}</span>
                          <span className="wb-search-meta">{hit.meta}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {deleteTarget ? (
          <div
            className="wb-confirm-backdrop"
            onClick={cancelDelete}
          >
            <div
              className="wb-confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="taskboard-delete-title"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="wb-note-meta">Delete task</p>
              <h2 id="taskboard-delete-title">Remove this sticky note?</h2>
              <p className="wb-confirm-copy">
                “{deleteTarget.title || 'Untitled task'}” will be removed from the taskboard.
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
                aria-labelledby="taskboard-view-title"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="wb-sticky-meta">
                  {dayLabelForDate(viewTask.date)}
                  {viewTimeLabel ? ` · ${viewTimeLabel}` : ''}
                </p>
                <h2 id="taskboard-view-title" className="wb-sticky-title">
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
                  {viewTask.tag ? (
                    <div className="wb-sticky-field">
                      <span className="wb-sticky-field-label">Tag</span>
                      <span className="wb-tag-chip">{viewTask.tag}</span>
                    </div>
                  ) : null}
                  <div className="wb-sticky-field">
                    <span className="wb-sticky-field-label">Priority</span>
                    <span className="wb-sticky-field-value">
                      {priorityLabel(viewTask.priority || DEFAULT_PRIORITY)}
                    </span>
                  </div>
                  {viewTask.project ? (
                    <div className="wb-sticky-field">
                      <span className="wb-sticky-field-label">Boss Battle</span>
                      <span className="wb-sticky-field-value">
                        {projects.find(
                          (project) =>
                            String(project._id) === String(viewTask.project._id || viewTask.project)
                        )?.title || 'Linked project'}
                      </span>
                    </div>
                  ) : null}
                </div>

                {viewTaskHistory.length > 0 ? (
                  <div className="wb-task-history" aria-label="Task history">
                    <p className="wb-game-kicker">History</p>
                    <ul className="wb-task-history-list">
                      {viewTaskHistory.map((event) => (
                        <li key={event.id}>
                          <span className="wb-task-history-label">{event.label}</span>
                          <span className="wb-task-history-detail">
                            {event.detail ||
                              (event.at
                                ? new Date(event.at).toLocaleString?.(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: typeof event.at === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(event.at)
                                      ? undefined
                                      : 'short'
                                  }) || String(event.at)
                                : '—')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="wb-modal-actions">
                  <button type="button" onClick={closeModal}>
                    Close
                  </button>
                  {canEditTasks || canDeleteTasks || (!isSharedView && canEdit) ? (
                    <>
                      {!isSharedView && canEdit ? (
                      <button type="button" className="wb-focus-chip" onClick={() => openFocusMode(viewTask)} title="Focus mode (F)">
                        Focus
                      </button>
                      ) : null}
                      {canDeleteTasks ? (
                      <button
                        type="button"
                        className="wb-modal-danger"
                        onClick={() => requestDelete(viewTask)}
                      >
                        Delete
                      </button>
                      ) : null}
                      {canEditTasks ? (
                      <button type="button" className="wb-modal-primary" onClick={switchToEdit}>
                        Edit
                      </button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            {isFormMode && (canShowAddUi || canEditTasks) ? (
              <div
                className="wb-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="taskboard-task-title"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="wb-note-meta">{modalMode === 'edit' ? 'Edit task' : 'New task'}</p>
                <h2 id="taskboard-task-title">
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

                  <label className="wb-modal-label" htmlFor="wb-priority">
                    Priority
                  </label>
                  <select
                    id="wb-priority"
                    value={form.priority || DEFAULT_PRIORITY}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, priority: event.target.value }))
                    }
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <label className="wb-modal-label" htmlFor="wb-project">
                    Boss Battle
                  </label>
                  <select
                    id="wb-project"
                    value={form.project || ''}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, project: event.target.value }))
                    }
                  >
                    <option value="">No project</option>
                    {projects
                      .filter((project) => project.status !== 'completed')
                      .map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.title}
                        </option>
                      ))}
                  </select>

                  <label className="wb-modal-label" htmlFor="wb-tag">
                    Tag
                  </label>
                  {addingTag ? (
                    <div className="wb-tag-row">
                      <input
                        id="wb-tag"
                        autoFocus
                        value={newTagName}
                        maxLength={40}
                        onChange={(event) => setNewTagName(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addNewTag();
                          }
                          if (event.key === 'Escape') {
                            event.preventDefault();
                            setAddingTag(false);
                            setNewTagName('');
                          }
                        }}
                        placeholder="New tag name"
                      />
                      <button
                        type="button"
                        className="wb-tag-confirm"
                        disabled={savingTag || !newTagName.trim()}
                        onClick={addNewTag}
                      >
                        {savingTag ? '…' : 'Add'}
                      </button>
                      <button
                        type="button"
                        className="wb-tag-cancel"
                        onClick={() => {
                          setAddingTag(false);
                          setNewTagName('');
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="wb-tag-row">
                      <select
                        id="wb-tag"
                        value={form.tag}
                        onChange={(event) => setForm((prev) => ({ ...prev, tag: event.target.value }))}
                      >
                        <option value="">No tag</option>
                        {tagOptions.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="wb-tag-plus"
                        aria-label="Add a new tag"
                        title="Add a new tag"
                        onClick={() => setAddingTag(true)}
                      >
                        +
                      </button>
                    </div>
                  )}

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
                          setAddingTag(false);
                          setNewTagName('');
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
      </BoardShell>
    </AdminLayout>
  );
};

export default AdminWorkboard;
