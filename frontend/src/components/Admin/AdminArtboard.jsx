import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import BoardLoader from './BoardLoader';
import { getArtboardSocket, getSocketId } from '../../utils/artboardSocket';
import './AdminWorkboard.css';
import './AdminArtboard.css';

const NOTE_W = 352;
const NOTE_H = 280;
const CANVAS_W = 3600;
const CANVAS_H = 2400;
const DRAG_THRESHOLD = 5;
const STORAGE_KEY = 'artboard:lastId';
const VIEW_STORAGE_KEY = 'artboard:view';
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.1;

const noteId = (note) => String(note.id || note._id);

const clampZoom = (value) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(Number(value) * 100) / 100));

const readViewState = () => {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const writeViewState = (updater) => {
  try {
    const prev = readViewState() || {};
    const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
};

const getBoardView = (boardId) => {
  if (!boardId) return null;
  const view = readViewState();
  const boardView = view?.byBoard?.[String(boardId)];
  if (!boardView || typeof boardView !== 'object') return null;
  return boardView;
};

const ToolIcon = ({ name }) => {
  const props = {
    className: 'ab-tool-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };

  if (name === 'hand') {
    return (
      <svg {...props}>
        <path d="M18 11V6a1.5 1.5 0 0 0-3 0v5" />
        <path d="M15 11V4.5a1.5 1.5 0 0 0-3 0V11" />
        <path d="M12 11V5.5a1.5 1.5 0 0 0-3 0V14" />
        <path d="M9 11.5V12a1.5 1.5 0 1 0-3 0v2a7 7 0 0 0 7 7h1a5 5 0 0 0 5-5v-4.5a1.5 1.5 0 0 0-3 0V11" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M4 4l7.2 16.2 1.8-6.2 6.2-1.8L4 4z" />
    </svg>
  );
};

const SideIcon = ({ name }) => {
  const props = {
    className: 'ab-side-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };

  switch (name) {
    case 'back':
      return (
        <svg {...props}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'rename':
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case 'boards':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="7" height="16" rx="1.5" />
          <rect x="14" y="4" width="7" height="10" rx="1.5" />
        </svg>
      );
    case 'new':
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 18v-6" />
          <path d="M9 15h6" />
        </svg>
      );
    case 'panel':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M15 4v16" />
        </svg>
      );
    case 'layer':
      return (
        <svg {...props}>
          <path d="M12 2l9 5-9 5-9-5 9-5z" />
          <path d="M3 12l9 5 9-5" />
          <path d="M3 17l9 5 9-5" />
        </svg>
      );
    case 'note':
      return (
        <svg {...props}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...props}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );
    case 'share':
      return (
        <svg {...props}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4" />
          <path d="M15.4 6.5l-6.8 4" />
        </svg>
      );
    case 'copy':
      return (
        <svg {...props}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      );
    default:
      return null;
  }
};

const socketHeaders = () => {
  const id = getSocketId();
  return id ? { 'X-Socket-Id': id } : {};
};

const copyTextToClipboard = async (text) => {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(input);
      return ok;
    } catch {
      return false;
    }
  }
};

const shareUrlFromResponse = (data) => {
  const path =
    data?.path || (data?.token ? `/admin/workboard/artboard/share/${data.token}` : '');
  if (!path) return '';
  return `${window.location.origin}${path}`;
};

const AdminArtboard = ({ onExit, shareToken = '' }) => {
  const isSharedMode = Boolean(shareToken);
  const [boards, setBoards] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [topZ, setTopZ] = useState(1);
  const [tool, setTool] = useState(() => {
    const saved = readViewState()?.tool;
    return saved === 'hand' || saved === 'select' ? saved : 'select';
  });
  const [zoom, setZoom] = useState(1);
  const [railOpen, setRailOpen] = useState(() => readViewState()?.railOpen !== false);
  const [sharePopoverBoardId, setSharePopoverBoardId] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareError, setShareError] = useState('');
  const [shareAnchor, setShareAnchor] = useState(null);
  const [peerCount, setPeerCount] = useState(0);

  const dragRef = useRef(null);
  const notesRef = useRef(notes);
  const saveTimers = useRef({});
  const titleInputRef = useRef(null);
  const noteEls = useRef({});
  const activeIdRef = useRef(activeId);
  const topZRef = useRef(topZ);
  const toolRef = useRef(tool);
  const zoomRef = useRef(zoom);
  const viewportRef = useRef(null);
  const viewRestoredForRef = useRef('');
  const scrollSaveTimer = useRef(null);
  const shareCopyTimer = useRef(null);
  const sharePopoverRef = useRef(null);
  const remoteSkipUntil = useRef({});
  const isHand = tool === 'hand';

  const noteApiBase = useCallback(
    (boardId) =>
      isSharedMode
        ? `/workboard/artboards/share/${shareToken}`
        : `/workboard/artboards/${boardId || activeIdRef.current}`,
    [isSharedMode, shareToken]
  );

  const persistView = useCallback(() => {
    const id = activeIdRef.current;
    if (!id) return;
    const vp = viewportRef.current;
    writeViewState((prev) => ({
      ...prev,
      tool: toolRef.current,
      byBoard: {
        ...(prev.byBoard || {}),
        [String(id)]: {
          zoom: zoomRef.current,
          scrollLeft: vp?.scrollLeft ?? 0,
          scrollTop: vp?.scrollTop ?? 0
        }
      }
    }));
  }, []);

  const restoreBoardView = useCallback((boardId) => {
    const boardView = getBoardView(boardId);
    const nextZoom = clampZoom(boardView?.zoom ?? 1);
    zoomRef.current = nextZoom;
    setZoom(nextZoom);

    const applyScroll = () => {
      const vp = viewportRef.current;
      if (!vp) return false;
      vp.scrollLeft = Number(boardView?.scrollLeft) || 0;
      vp.scrollTop = Number(boardView?.scrollTop) || 0;
      return true;
    };

    // Wait for zoomed canvas layout before restoring scroll.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!applyScroll()) {
          requestAnimationFrame(applyScroll);
        }
      });
    });
  }, []);

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    topZRef.current = topZ;
  }, [topZ]);

  useEffect(() => {
    toolRef.current = tool;
    writeViewState({ tool });
    dragRef.current = null;
    if (tool === 'hand') {
      const active = document.activeElement;
      if (active?.closest?.('.ab-note') && typeof active.blur === 'function') {
        active.blur();
      }
    }
  }, [tool]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (loading || !activeId) return;
    if (viewRestoredForRef.current === String(activeId)) return;
    viewRestoredForRef.current = String(activeId);
    restoreBoardView(activeId);
  }, [activeId, loading, restoreBoardView]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || loading) return undefined;

    const onScroll = () => {
      if (scrollSaveTimer.current) clearTimeout(scrollSaveTimer.current);
      scrollSaveTimer.current = setTimeout(() => {
        persistView();
      }, 120);
    };

    vp.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      vp.removeEventListener('scroll', onScroll);
      if (scrollSaveTimer.current) clearTimeout(scrollSaveTimer.current);
    };
  }, [loading, activeId, persistView]);

  useEffect(
    () => () => {
      persistView();
      if (scrollSaveTimer.current) clearTimeout(scrollSaveTimer.current);
    },
    [persistView]
  );

  useEffect(() => {
    const isTypingTarget = (target) => {
      if (!target || !(target instanceof Element)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      );
    };

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === 'v') {
        event.preventDefault();
        setTool('select');
      } else if (key === 'h') {
        event.preventDefault();
        setTool('hand');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const applyZoom = useCallback(
    (nextZoom) => {
      const clamped = clampZoom(nextZoom);
      const prev = zoomRef.current;
      if (clamped === prev) return;

      const vp = viewportRef.current;
      if (vp) {
        const cx = vp.scrollLeft + vp.clientWidth / 2;
        const cy = vp.scrollTop + vp.clientHeight / 2;
        const ratio = clamped / prev;
        zoomRef.current = clamped;
        setZoom(clamped);
        requestAnimationFrame(() => {
          vp.scrollLeft = cx * ratio - vp.clientWidth / 2;
          vp.scrollTop = cy * ratio - vp.clientHeight / 2;
          persistView();
        });
      } else {
        zoomRef.current = clamped;
        setZoom(clamped);
        persistView();
      }
    },
    [persistView]
  )

  const zoomIn = () => applyZoom(zoomRef.current + ZOOM_STEP);
  const zoomOut = () => applyZoom(zoomRef.current - ZOOM_STEP);

  useEffect(
    () => () => {
      Object.values(saveTimers.current).forEach((timer) => clearTimeout(timer));
    },
    []
  );

  const applyBoard = useCallback((artboard) => {
    const nextNotes = artboard.notes || [];
    setActiveId(String(artboard.id));
    setTitle(artboard.title || 'Untitled');
    setNotes(nextNotes);
    setTopZ(Math.max(1, ...nextNotes.map((n) => n.zIndex || 1)));
    if (!isSharedMode) {
      try {
        localStorage.setItem(STORAGE_KEY, String(artboard.id));
      } catch {
        /* ignore */
      }
    }
  }, [isSharedMode]);

  const markLocalNoteWrite = useCallback((id) => {
    remoteSkipUntil.current[String(id)] = Date.now() + 400;
  }, []);

  useEffect(() => {
    if (!activeId) return undefined;

    const socket = getArtboardSocket();
    const boardId = String(activeId);

    const join = () => {
      socket.emit('artboard:join', { artboardId: boardId });
    };

    join();
    socket.on('connect', join);

    const onCreated = (payload) => {
      if (String(payload?.artboardId) !== boardId || !payload?.note) return;
      const id = noteId(payload.note);
      if ((remoteSkipUntil.current[id] || 0) > Date.now()) return;
      setNotes((prev) => {
        if (prev.some((n) => noteId(n) === id)) {
          return prev.map((n) => (noteId(n) === id ? { ...n, ...payload.note } : n));
        }
        return [...prev, payload.note];
      });
      setTopZ((z) => Math.max(z, payload.note.zIndex || 1));
    };

    const onUpdated = (payload) => {
      if (String(payload?.artboardId) !== boardId || !payload?.note) return;
      const id = noteId(payload.note);
      if ((remoteSkipUntil.current[id] || 0) > Date.now()) return;
      // Don't clobber an in-progress local drag for this note.
      if (dragRef.current?.id === id && dragRef.current.moved) return;
      setNotes((prev) =>
        prev.map((n) => (noteId(n) === id ? { ...n, ...payload.note } : n))
      );
      setTopZ((z) => Math.max(z, payload.note.zIndex || 1));
    };

    const onDeleted = (payload) => {
      if (String(payload?.artboardId) !== boardId || !payload?.noteId) return;
      const id = String(payload.noteId);
      setNotes((prev) => prev.filter((n) => noteId(n) !== id));
    };

    const onTitle = (payload) => {
      if (String(payload?.artboardId) !== boardId) return;
      if (payload.title) {
        setTitle(payload.title);
        setBoards((prev) =>
          prev.map((b) => (String(b.id) === boardId ? { ...b, title: payload.title } : b))
        );
      }
    };

    const onBoardDeleted = (payload) => {
      if (String(payload?.artboardId) !== boardId) return;
      if (isSharedMode) {
        setError('This artboard was deleted by the owner');
        setNotes([]);
      }
    };

    const onPeer = (payload) => {
      if (payload?.type === 'joined') {
        setPeerCount((c) => c + 1);
      } else if (payload?.type === 'left') {
        setPeerCount((c) => Math.max(0, c - 1));
      }
    };

    socket.on('artboard:note:created', onCreated);
    socket.on('artboard:note:updated', onUpdated);
    socket.on('artboard:note:deleted', onDeleted);
    socket.on('artboard:title', onTitle);
    socket.on('artboard:deleted', onBoardDeleted);
    socket.on('artboard:peer', onPeer);

    return () => {
      socket.emit('artboard:leave', { artboardId: boardId });
      socket.off('connect', join);
      socket.off('artboard:note:created', onCreated);
      socket.off('artboard:note:updated', onUpdated);
      socket.off('artboard:note:deleted', onDeleted);
      socket.off('artboard:title', onTitle);
      socket.off('artboard:deleted', onBoardDeleted);
      socket.off('artboard:peer', onPeer);
      setPeerCount(0);
    };
  }, [activeId, isSharedMode]);

  const closeSharePopover = useCallback(() => {
    setSharePopoverBoardId('');
    setShareUrl('');
    setShareCopied(false);
    setShareLoading(false);
    setShareError('');
    setShareAnchor(null);
    if (shareCopyTimer.current) {
      clearTimeout(shareCopyTimer.current);
      shareCopyTimer.current = null;
    }
  }, []);

  const markShareCopied = useCallback(() => {
    setShareCopied(true);
    if (shareCopyTimer.current) clearTimeout(shareCopyTimer.current);
    shareCopyTimer.current = setTimeout(() => setShareCopied(false), 1800);
  }, []);

  const placeSharePopover = (anchorEl) => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const gap = 10;
    const estimatedHeight = 220;
    const top = Math.max(12, Math.min(rect.top, window.innerHeight - estimatedHeight - 12));
    const right = Math.max(12, window.innerWidth - rect.left + gap);
    setShareAnchor({ top, right });
  };

  const handleShareBoard = async (board, event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const id = String(board.id);
    if (sharePopoverBoardId === id && shareUrl) {
      closeSharePopover();
      return;
    }

    placeSharePopover(event?.currentTarget);
    setSharePopoverBoardId(id);
    setShareUrl('');
    setShareCopied(false);
    setShareError('');
    setShareLoading(true);
    try {
      const response = await axios.post(
        `/workboard/artboards/${id}/share`,
        {},
        { headers: socketHeaders() }
      );
      const url = shareUrlFromResponse(response.data);
      if (!url) {
        setShareError('Failed to create share link');
        return;
      }
      setShareUrl(url);
      const copied = await copyTextToClipboard(url);
      if (copied) markShareCopied();
    } catch (err) {
      setShareError(err.response?.data?.message || 'Failed to create share link');
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!shareUrl) return;
    const copied = await copyTextToClipboard(shareUrl);
    if (copied) {
      markShareCopied();
      return;
    }
    setShareError('Could not copy link. Select it and copy manually.');
  };

  const loadBoard = useCallback(
    async (id) => {
      if (isSharedMode) {
        const response = await axios.get(`/workboard/artboards/share/${shareToken}`);
        applyBoard(response.data.artboard);
        return;
      }
      const response = await axios.get(`/workboard/artboards/${id}`);
      applyBoard(response.data.artboard);
    },
    [applyBoard, isSharedMode, shareToken]
  );

  const bootstrap = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (isSharedMode) {
        const response = await axios.get(`/workboard/artboards/share/${shareToken}`);
        const board = response.data.artboard;
        setBoards([
          {
            id: board.id,
            title: board.title,
            createdAt: board.createdAt,
            updatedAt: board.updatedAt
          }
        ]);
        applyBoard(board);
        return;
      }

      const listRes = await axios.get('/workboard/artboards');
      const list = listRes.data.artboards || [];
      setBoards(list);

      if (list.length === 0) {
        const created = await axios.post('/workboard/artboards', { title: 'My Artboard' });
        const board = created.data.artboard;
        setBoards([
          {
            id: board.id,
            title: board.title,
            createdAt: board.createdAt,
            updatedAt: board.updatedAt
          }
        ]);
        applyBoard(board);
      } else {
        let preferred = null;
        try {
          preferred = localStorage.getItem(STORAGE_KEY);
        } catch {
          preferred = null;
        }
        const pick = list.find((b) => String(b.id) === String(preferred)) || list[0];
        await loadBoard(pick.id);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          (isSharedMode ? 'Failed to open shared artboard' : 'Failed to load artboards')
      );
    } finally {
      setLoading(false);
    }
  }, [applyBoard, isSharedMode, loadBoard, shareToken]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  useEffect(() => {
    if (!sharePopoverBoardId) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeSharePopover();
    };
    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.ab-share-popover') || target.closest('.ab-layer-share')) return;
      closeSharePopover();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [sharePopoverBoardId, closeSharePopover]);

  useEffect(
    () => () => {
      if (shareCopyTimer.current) clearTimeout(shareCopyTimer.current);
    },
    []
  );

  const handleSelectBoard = async (id) => {
    if (!id || String(id) === String(activeId)) return;
    persistView();
    viewRestoredForRef.current = '';
    setEditingTitle(false);
    closeSharePopover();
    setLoading(true);
    setError('');
    try {
      await loadBoard(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to open artboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (board) => {
    const id = String(board.id);
    const label = board.title || 'Untitled';
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;

    setError('');
    try {
      await axios.delete(`/workboard/artboards/${id}`);

      writeViewState((prev) => {
        const byBoard = { ...(prev.byBoard || {}) };
        delete byBoard[id];
        return { ...prev, byBoard };
      });

      const remaining = boards.filter((b) => String(b.id) !== id);
      setBoards(remaining);

      if (String(activeId) !== id) return;

      viewRestoredForRef.current = '';
      if (remaining.length > 0) {
        await loadBoard(remaining[0].id);
        return;
      }

      const created = await axios.post('/workboard/artboards', { title: 'My Artboard' });
      const next = created.data.artboard;
      setBoards([
        {
          id: next.id,
          title: next.title,
          createdAt: next.createdAt,
          updatedAt: next.updatedAt
        }
      ]);
      applyBoard(next);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete artboard');
    }
  };

  const handleCreateBoard = async () => {
    if (creating || isSharedMode) return;
    persistView();
    viewRestoredForRef.current = '';
    setCreating(true);
    setEditingTitle(false);
    closeSharePopover();
    setError('');
    try {
      const response = await axios.post('/workboard/artboards', { title: 'Untitled' });
      const board = response.data.artboard;
      applyBoard(board);
      setBoards((prev) => {
        const entry = {
          id: board.id,
          title: board.title,
          createdAt: board.createdAt,
          updatedAt: board.updatedAt
        };
        const without = prev.filter((b) => String(b.id) !== String(board.id));
        return [entry, ...without];
      });
      setTitleDraft(board.title || 'Untitled');
      setEditingTitle(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create artboard');
    } finally {
      setCreating(false);
    }
  };

  const saveTitle = async () => {
    const trimmed = titleDraft.trim();
    setEditingTitle(false);
    if (!trimmed || trimmed === title || !activeId || isSharedMode) return;
    const previous = title;
    setTitle(trimmed);
    try {
      await axios.patch(
        `/workboard/artboards/${activeId}`,
        { title: trimmed },
        { headers: socketHeaders() }
      );
      setBoards((prev) =>
        prev.map((b) => (String(b.id) === String(activeId) ? { ...b, title: trimmed } : b))
      );
    } catch (err) {
      setTitle(previous);
      setError(err.response?.data?.message || 'Failed to rename artboard');
    }
  };

  const queueNoteSave = useCallback((id, patch) => {
    const boardId = activeIdRef.current;
    if (!boardId) return;
    const key = String(id);
    markLocalNoteWrite(key);
    if (saveTimers.current[key]) clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      try {
        markLocalNoteWrite(key);
        await axios.patch(`${noteApiBase(boardId)}/notes/${id}`, patch, {
          headers: socketHeaders()
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to save note');
      }
    }, 280);
  }, [markLocalNoteWrite, noteApiBase]);

  const updateNoteLocal = useCallback((id, patch) => {
    setNotes((prev) =>
      prev.map((note) => (noteId(note) === String(id) ? { ...note, ...patch } : note))
    );
  }, []);

  const addNote = async () => {
    if (!activeId) return;
    setError('');
    try {
      const response = await axios.post(
        `${noteApiBase(activeId)}/notes`,
        {},
        { headers: socketHeaders() }
      );
      const note = response.data.note;
      markLocalNoteWrite(noteId(note));
      setNotes((prev) => {
        if (prev.some((n) => noteId(n) === noteId(note))) {
          return prev.map((n) => (noteId(n) === noteId(note) ? { ...n, ...note } : n));
        }
        return [...prev, note];
      });
      setTopZ((z) => Math.max(z, note.zIndex || z));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    }
  };

  const handleTextChange = (id, text) => {
    updateNoteLocal(id, { text });
    queueNoteSave(id, { text });
  };

  const bringToFront = useCallback(
    (id) => {
      const nextZ = topZRef.current + 1;
      topZRef.current = nextZ;
      setTopZ(nextZ);
      updateNoteLocal(id, { zIndex: nextZ });
      queueNoteSave(id, { zIndex: nextZ });
    },
    [queueNoteSave, updateNoteLocal]
  );

  useEffect(() => {
    const onMove = (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (drag.type === 'pan') {
        if (toolRef.current !== 'hand') {
          dragRef.current = null;
          return;
        }
        const vp = viewportRef.current;
        if (!vp) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        drag.moved = true;
        event.preventDefault();
        vp.scrollLeft = drag.origScrollLeft - dx;
        vp.scrollTop = drag.origScrollTop - dy;
        return;
      }

      if (drag.type === 'note') {
        const dx = (event.clientX - drag.startX) / zoomRef.current;
        const dy = (event.clientY - drag.startY) / zoomRef.current;
        if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD / zoomRef.current) return;

        if (!drag.moved) {
          drag.moved = true;
          bringToFront(drag.id);
          const el = noteEls.current[drag.id];
          el?.setPointerCapture?.(event.pointerId);
          const active = document.activeElement;
          if (active?.closest?.('.ab-note') && typeof active.blur === 'function') {
            active.blur();
          }
        }

        event.preventDefault();

        const x = Math.max(0, Math.min(CANVAS_W - NOTE_W, drag.origX + dx));
        const y = Math.max(0, Math.min(CANVAS_H - NOTE_H, drag.origY + dy));
        updateNoteLocal(drag.id, { x, y });
      }
    };

    const onUp = (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (drag.type === 'note' && drag.moved) {
        const current = notesRef.current.find((n) => noteId(n) === drag.id);
        if (current) {
          queueNoteSave(drag.id, { x: current.x, y: current.y, zIndex: current.zIndex });
        }
      }

      dragRef.current = null;
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [bringToFront, queueNoteSave, updateNoteLocal]);

  const onViewportPointerDown = (event) => {
    if (event.button !== 0) return;
    if (toolRef.current !== 'hand') return;
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('.ab-share-popover')) return;
    if (event.target.closest('.ab-note')) return;

    const vp = viewportRef.current;
    if (!vp) return;

    event.preventDefault();
    vp.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      type: 'pan',
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origScrollLeft: vp.scrollLeft,
      origScrollTop: vp.scrollTop,
      moved: false
    };
  };

  const onNotePointerDown = (event, note) => {
    if (event.button !== 0) return;

    const onText =
      event.target instanceof Element && event.target.closest('.ab-note-text');
    if (toolRef.current === 'select' && onText) return;

    event.stopPropagation();
    if (toolRef.current === 'hand') {
      event.preventDefault();
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);

    dragRef.current = {
      type: 'note',
      id: noteId(note),
      startX: event.clientX,
      startY: event.clientY,
      origX: note.x,
      origY: note.y,
      moved: false,
      pointerId: event.pointerId
    };
  };

  if (loading && !activeId) {
    return (
      <div className="ab-shell">
        <BoardLoader label="Opening artboard…" />
      </div>
    );
  }

  return (
    <div className={`ab-shell wb-board ${isHand ? 'ab-shell--hand' : 'ab-shell--select'}`}>
      {error ? <p className="ab-error">{error}</p> : null}

      <aside
        className={`ab-side-rail${railOpen ? ' is-open' : ''}${
          editingTitle ? ' has-flyout' : ''
        }`}
        aria-label="Artboard controls"
      >
        <div className={`ab-side-top ${railOpen ? '' : 'is-compact'}`}>
          <button
            type="button"
            className="ab-side-btn ab-side-toggle"
            onClick={() => {
              setRailOpen((open) => {
                const next = !open;
                writeViewState({ railOpen: next });
                return next;
              });
            }}
            aria-label={railOpen ? 'Collapse panel' : 'Expand panel'}
            aria-expanded={railOpen}
            title={railOpen ? 'Collapse' : 'Expand'}
          >
            <SideIcon name="panel" />
            {railOpen ? <span className="ab-side-btn-label">Panel</span> : null}
          </button>
        </div>

        {!isSharedMode && onExit ? (
          <button
            type="button"
            className={`ab-side-btn${railOpen ? ' ab-side-btn--row' : ''}`}
            onClick={onExit}
            aria-label="Back to workboard"
            title="Workboard"
          >
            <SideIcon name="back" />
            {railOpen ? <span className="ab-side-btn-label">Workboard</span> : null}
          </button>
        ) : null}

        {isSharedMode ? (
          <div className={`ab-share-badge${railOpen ? '' : ' is-compact'}`} title={title || 'Shared board'}>
            <SideIcon name="share" />
            {railOpen ? (
              <span className="ab-share-badge-copy">
                <span className="ab-share-badge-title">{title || 'Shared board'}</span>
                <span className="ab-share-badge-meta">
                  Live edit{peerCount > 0 ? ` · ${peerCount} other` : ''}
                </span>
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="ab-side-divider" aria-hidden="true" />

        {!isSharedMode ? (
          <div className="ab-layers">
            {railOpen ? <p className="ab-layers-heading">Boards</p> : null}
            <div className="ab-layers-list" role="list" aria-label="Artboards">
              {boards.map((board, index) => {
                const isActive = String(board.id) === String(activeId);
                const shareOpen = sharePopoverBoardId === String(board.id);
                return (
                  <div
                    key={board.id}
                    role="listitem"
                    className={`ab-layer${isActive ? ' is-active' : ''}${
                      railOpen ? '' : ' is-compact'
                    }`}
                    style={{ zIndex: boards.length - index }}
                  >
                    <button
                      type="button"
                      className="ab-layer-main"
                      onClick={() => handleSelectBoard(board.id)}
                      aria-current={isActive ? 'true' : undefined}
                      title={board.title || 'Untitled'}
                    >
                      <span className="ab-layer-icon" aria-hidden="true">
                        <SideIcon name="layer" />
                      </span>
                      {railOpen ? (
                        <span className="ab-layer-copy">
                          <span className="ab-layer-title">{board.title || 'Untitled'}</span>
                          <span className="ab-layer-meta">Layer {boards.length - index}</span>
                        </span>
                      ) : null}
                    </button>

                    <div className="ab-layer-actions">
                      <button
                        type="button"
                        className={`ab-layer-share${shareOpen ? ' is-open' : ''}${
                          shareOpen && shareCopied ? ' is-copied' : ''
                        }`}
                        onClick={(event) => handleShareBoard(board, event)}
                        aria-label={`Share ${board.title || 'Untitled'}`}
                        title={shareOpen && shareCopied ? 'Link copied' : 'Share board'}
                        aria-expanded={shareOpen}
                      >
                        <SideIcon name="share" />
                      </button>
                      <span className="ab-layer-action-divider" aria-hidden="true" />
                      <button
                        type="button"
                        className="ab-layer-delete"
                        onClick={(event) => {
                          event.stopPropagation();
                          closeSharePopover();
                          handleDeleteBoard(board);
                        }}
                        aria-label={`Delete ${board.title || 'Untitled'}`}
                        title="Delete board"
                      >
                        <SideIcon name="trash" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {!isSharedMode ? <div className="ab-side-divider" aria-hidden="true" /> : null}

        {!isSharedMode ? (
          <button
            type="button"
            className={`ab-side-btn${railOpen ? ' ab-side-btn--row' : ''}${
              editingTitle ? ' is-active' : ''
            }`}
            onClick={() => {
              closeSharePopover();
              setTitleDraft(title);
              setEditingTitle(true);
            }}
            aria-label="Rename artboard"
            title={title || 'Untitled'}
          >
            <SideIcon name="rename" />
            {railOpen ? <span className="ab-side-btn-label">Rename</span> : null}
          </button>
        ) : null}

        {!isSharedMode ? (
          <button
            type="button"
            className={`ab-side-btn${railOpen ? ' ab-side-btn--row' : ''}`}
            onClick={handleCreateBoard}
            disabled={creating}
            aria-label="New artboard"
            title="New board"
          >
            <SideIcon name="new" />
            {railOpen ? (
              <span className="ab-side-btn-label">{creating ? 'Creating…' : 'New board'}</span>
            ) : null}
          </button>
        ) : null}

        <button
          type="button"
          className={`ab-side-btn ab-side-btn--add${railOpen ? ' ab-side-btn--row' : ''}`}
          onClick={addNote}
          aria-label="Add sticky note"
          title="Add sticky note"
        >
          <SideIcon name="note" />
          {railOpen ? <span className="ab-side-btn-label">Add note</span> : null}
        </button>

        {editingTitle && !isSharedMode ? (
          <div className="ab-side-panel">
            <p className="ab-side-panel-label">Board title</p>
            <input
              ref={titleInputRef}
              className="ab-title-input"
              value={titleDraft}
              maxLength={120}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  saveTitle();
                }
                if (e.key === 'Escape') {
                  setEditingTitle(false);
                  setTitleDraft(title);
                }
              }}
              aria-label="Artboard title"
              placeholder="Name this board"
            />
          </div>
        ) : null}
      </aside>

      {sharePopoverBoardId ? (
        <div
          ref={sharePopoverRef}
          className="ab-share-popover"
          role="dialog"
          aria-label="Share board link"
          style={
            shareAnchor
              ? { top: shareAnchor.top, right: shareAnchor.right }
              : undefined
          }
        >
          <p className="ab-share-popover-label">Share link</p>
          {shareLoading ? (
            <p className="ab-share-popover-hint">Generating link…</p>
          ) : shareError && !shareUrl ? (
            <>
              <p className="ab-share-popover-error">{shareError}</p>
              <div className="ab-share-popover-actions">
                <button type="button" className="ab-btn ab-btn-ghost" onClick={closeSharePopover}>
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                className="ab-share-popover-input"
                value={shareUrl}
                readOnly
                onFocus={(e) => e.target.select()}
                aria-label="Artboard share URL"
              />
              <div className="ab-share-popover-actions">
                <button
                  type="button"
                  className="ab-btn ab-btn-primary"
                  onClick={handleCopyShareLink}
                  disabled={!shareUrl}
                >
                  <SideIcon name="copy" />
                  <span>{shareCopied ? 'Copied' : 'Copy link'}</span>
                </button>
                <button type="button" className="ab-btn ab-btn-ghost" onClick={closeSharePopover}>
                  Close
                </button>
              </div>
              {shareError ? <p className="ab-share-popover-error">{shareError}</p> : null}
              <p className="ab-share-popover-hint">
                {shareCopied
                  ? 'Link copied. Anyone with it can edit this board live.'
                  : 'Anyone with this link can edit this board live.'}
              </p>
            </>
          )}
        </div>
      ) : null}

      <div
        className="ab-viewport"
        ref={viewportRef}
        onPointerDown={onViewportPointerDown}
      >
        <div
          className="ab-canvas-scale"
          style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom }}
        >
          <div
            className="ab-canvas"
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {notes.map((note) => {
              const id = noteId(note);
              return (
                <div
                  key={id}
                  ref={(el) => {
                    if (el) noteEls.current[id] = el;
                    else delete noteEls.current[id];
                  }}
                  className={`ab-note wb-note wb-note--${note.color || 'yellow'}${
                    isHand ? ' is-hand' : ' is-select'
                  }`}
                  style={{
                    left: note.x,
                    top: note.y,
                    zIndex: note.zIndex || 1,
                    width: NOTE_W,
                    height: NOTE_H
                  }}
                  onPointerDown={(e) => onNotePointerDown(e, note)}
                >
                  <span className="ab-note-handle" aria-hidden="true" />
                  <textarea
                    className="ab-note-text"
                    value={note.text || ''}
                    maxLength={500}
                    placeholder="Type a note…"
                    readOnly={isHand}
                    tabIndex={isHand ? -1 : 0}
                    onChange={(e) => handleTextChange(id, e.target.value)}
                    onFocus={() => {
                      if (!isHand) bringToFront(id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="ab-tool-rail" role="toolbar" aria-label="Artboard tools">
        <button
          type="button"
          className={`ab-tool-btn${tool === 'select' ? ' is-active' : ''}`}
          onClick={() => setTool('select')}
          aria-label="Select / Type"
          aria-pressed={tool === 'select'}
          title="Select / Type — drag the bar on a sticky to move it (V)"
        >
          <ToolIcon name="select" />
        </button>
        <button
          type="button"
          className={`ab-tool-btn${tool === 'hand' ? ' is-active' : ''}`}
          onClick={() => setTool('hand')}
          aria-label="Hand"
          aria-pressed={tool === 'hand'}
          title="Hand — move the board, or drag a sticky (H)"
        >
          <ToolIcon name="hand" />
        </button>

        <div className="ab-tool-divider" aria-hidden="true" />

        <button
          type="button"
          className="ab-tool-btn"
          onClick={zoomIn}
          disabled={zoom >= ZOOM_MAX}
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="ab-tool-btn"
          onClick={zoomOut}
          disabled={zoom <= ZOOM_MIN}
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
        <span className="ab-zoom-label" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
};

export default AdminArtboard;
