import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { useBoardTheme } from './BoardThemeContext';
import '../styles/platformDialog.css';

const PlatformDialogContext = createContext(null);

const ConfirmDialog = ({
  state,
  boardTheme,
  onCancel,
  onConfirm
}) => {
  useEffect(() => {
    if (!state) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !state.busy) {
        event.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state, onCancel]);

  if (!state) return null;

  const isBoard = state.theme === 'board';
  const backdropClass = isBoard
    ? 'wb-confirm-backdrop platform-dialog-backdrop--board'
    : 'platform-dialog-backdrop';
  const panelClass = isBoard ? 'wb-confirm' : 'platform-dialog';
  const kickerClass = isBoard ? 'wb-note-meta' : 'platform-dialog-kicker';
  const copyClass = isBoard ? 'wb-confirm-copy' : 'platform-dialog-copy';

  return createPortal(
    <div
      className={backdropClass}
      data-board-theme={isBoard ? boardTheme : undefined}
      onClick={state.busy ? undefined : onCancel}
    >
      <div
        className={panelClass}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="platform-dialog-title"
        aria-describedby={state.message ? 'platform-dialog-copy' : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {state.kicker ? <p className={kickerClass}>{state.kicker}</p> : null}
        <h2 id="platform-dialog-title" className={isBoard ? undefined : 'platform-dialog-title'}>
          {state.title}
        </h2>
        {state.message ? (
          <p id="platform-dialog-copy" className={copyClass}>
            {state.message}
          </p>
        ) : null}
        <div className={isBoard ? 'wb-modal-actions' : 'platform-dialog-actions'}>
          <button
            type="button"
            className={isBoard ? undefined : 'platform-dialog-cancel'}
            onClick={onCancel}
            disabled={state.busy}
          >
            {state.cancelLabel}
          </button>
          <button
            type="button"
            className={
              isBoard
                ? `wb-modal-danger is-solid${state.variant === 'danger' ? '' : ''}`
                : `platform-dialog-confirm${state.variant === 'danger' ? ' is-danger' : ''}`
            }
            onClick={onConfirm}
            disabled={state.busy}
          >
            {state.busy ? state.busyLabel : state.confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ToastStack = ({ toasts, boardTheme }) => {
  if (!toasts.length) return null;

  return createPortal(
    <div className="platform-toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`platform-toast platform-toast--${toast.variant}${
            toast.theme === 'board' ? ' platform-toast--board' : ''
          }`}
          data-board-theme={toast.theme === 'board' ? boardTheme : undefined}
          role="status"
        >
          {toast.title ? <p className="platform-toast-title">{toast.title}</p> : null}
          {toast.message ? <p className="platform-toast-message">{toast.message}</p> : null}
        </div>
      ))}
    </div>,
    document.body
  );
};

export const PlatformDialogProvider = ({ children }) => {
  const boardThemeContext = useBoardTheme();
  const boardTheme = boardThemeContext?.boardTheme || 'light';
  const [confirmState, setConfirmState] = useState(null);
  const [toasts, setToasts] = useState([]);
  const confirmResolverRef = useRef(null);
  const toastTimersRef = useRef({});

  useEffect(
    () => () => {
      Object.values(toastTimersRef.current).forEach((timer) => clearTimeout(timer));
    },
    []
  );

  const resolveConfirm = useCallback((result) => {
    confirmResolverRef.current?.(result);
    confirmResolverRef.current = null;
    setConfirmState(null);
  }, []);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmState({
        theme: options.theme || 'platform',
        kicker: options.kicker || '',
        title: options.title || 'Are you sure?',
        message: options.message || '',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        busyLabel: options.busyLabel || 'Working…',
        variant: options.variant || 'danger',
        busy: false
      });
    });
  }, []);

  const notify = useCallback((options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = {
      id,
      theme: options.theme || 'platform',
      title: options.title || '',
      message: options.message || '',
      variant: options.variant || 'info'
    };
    const duration = options.duration ?? 4200;

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      toastTimersRef.current[id] = setTimeout(() => {
        setToasts((prev) => prev.filter((entry) => entry.id !== id));
        delete toastTimersRef.current[id];
      }, duration);
    }

    return id;
  }, []);

  const showAlert = useCallback(
    (messageOrOptions) => {
      const options =
        typeof messageOrOptions === 'string'
          ? { message: messageOrOptions }
          : messageOrOptions || {};

      notify({
        title: options.title || '',
        message: options.message || options.body || '',
        variant: options.variant || 'info',
        theme: options.theme || 'platform',
        duration: options.duration
      });
    },
    [notify]
  );

  const handleConfirm = useCallback(() => {
    resolveConfirm(true);
  }, [resolveConfirm]);

  const handleCancel = useCallback(() => {
    if (confirmState?.busy) return;
    resolveConfirm(false);
  }, [confirmState, resolveConfirm]);

  const value = {
    confirm,
    notify,
    alert: showAlert
  };

  return (
    <PlatformDialogContext.Provider value={value}>
      {children}
      <ConfirmDialog
        state={confirmState}
        boardTheme={boardTheme}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <ToastStack toasts={toasts} boardTheme={boardTheme} />
    </PlatformDialogContext.Provider>
  );
};

export const usePlatformDialog = () => {
  const context = useContext(PlatformDialogContext);
  if (!context) {
    throw new Error('usePlatformDialog must be used within a PlatformDialogProvider');
  }
  return context;
};

export default PlatformDialogContext;
