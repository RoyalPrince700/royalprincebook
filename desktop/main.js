const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  globalShortcut,
  ipcMain,
  nativeImage,
  screen,
  shell
} = require('electron');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const { classifyHttpStatus, createOutbox, loadOutboxItems } = require('./outbox');

const SHORTCUT = 'CommandOrControl+Shift+Space';
const SHORTCUT_LABEL = 'Ctrl+Shift+Space';
const DEFAULT_API = 'https://royalprincebook.onrender.com/api';
const DEFAULT_SITE = 'https://www.royalprincehub.com';

const APP_NAMES = {
  winword: 'Word',
  excel: 'Excel',
  powerpnt: 'PowerPoint',
  outlook: 'Outlook',
  chrome: 'Chrome',
  msedge: 'Edge',
  firefox: 'Firefox',
  code: 'Visual Studio Code',
  cursor: 'Cursor',
  notepad: 'Notepad',
  explorer: 'File Explorer',
  acrobat: 'Acrobat',
  acrord32: 'Acrobat'
};

let tray = null;
let captureWindow = null;
let settings = null;
let settingsPath = '';
let quitting = false;
let currentContext = { appName: '', windowTitle: '', label: '' };
let lastExternalContext = { appName: '', windowTitle: '', label: '' };
let foregroundWatcher = null;
let signInPromise = null;
let taskOutbox = createOutbox();
let outboxPath = '';
let flushPromise = null;
let flushTimer = null;
const recentFailures = new Map();
const SYNC_TIMEOUT_MS = 90000;
const QUICK_SAVE_MS = 4000;
const RETRY_MS = 30000;
const CAPTURE_HEIGHT = 640;

const trimSlash = (value) => String(value || '').replace(/\/+$/, '');

const loadSettings = () => {
  const defaults = {
    apiBaseUrl: trimSlash(process.env.TASK_CAPTURE_API_BASE_URL || DEFAULT_API),
    siteUrl: trimSlash(process.env.TASK_CAPTURE_SITE_URL || DEFAULT_SITE),
    openAtLogin: true,
    token: '',
    user: null
  };

  try {
    const stored = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    settings = { ...defaults, ...stored, user: stored.user || null };
  } catch (_error) {
    settings = defaults;
  }

  if (process.env.TASK_CAPTURE_API_BASE_URL) {
    settings.apiBaseUrl = trimSlash(process.env.TASK_CAPTURE_API_BASE_URL);
  }
  if (process.env.TASK_CAPTURE_SITE_URL) {
    settings.siteUrl = trimSlash(process.env.TASK_CAPTURE_SITE_URL);
  }
};

const saveSettings = () => {
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
};

const applyLoginItem = () => {
  if (!app.isPackaged) return;
  app.setLoginItemSettings({ openAtLogin: Boolean(settings.openAtLogin) });
};

const prettyAppName = (name) => {
  const key = String(name || '').toLowerCase();
  if (!key) return '';
  if (APP_NAMES[key]) return APP_NAMES[key];
  return key.charAt(0).toUpperCase() + key.slice(1);
};

const isOwnWindow = (appName, windowTitle) => {
  const name = String(appName || '').toLowerCase();
  const title = String(windowTitle || '').toLowerCase();
  return name === 'electron' || name === 'task capture' || title.includes('task capture');
};

const contextFromWindow = (appName, windowTitle) => {
  const pretty = prettyAppName(appName);
  const title = String(windowTitle || '').trim();
  let label = 'Saved to your taskboard for today.';
  if (pretty && title) label = `While using ${pretty}: ${title}`;
  else if (title) label = `While using: ${title}`;
  else if (pretty) label = `While using ${pretty}`;
  return { appName: pretty, windowTitle: title, label };
};

const createForegroundWatcher = () => {
  if (process.platform !== 'win32') {
    return { query: async () => ({ appName: '', windowTitle: '' }) };
  }

  const script = `
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -TypeDefinition @'
using System;
using System.Text;
using System.Runtime.InteropServices;
public class FgWin {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
'@
Write-Output 'FGREADY'
$reader = New-Object System.IO.StreamReader([Console]::OpenStandardInput())
while ($true) {
  $line = $reader.ReadLine()
  if ($null -eq $line) { break }
  if ($line -eq 'QUIT') { break }
  $hwnd = [FgWin]::GetForegroundWindow()
  $sb = New-Object System.Text.StringBuilder 512
  [void][FgWin]::GetWindowText($hwnd, $sb, $sb.Capacity)
  $procId = [uint32]0
  [void][FgWin]::GetWindowThreadProcessId($hwnd, [ref]$procId)
  $name = ''
  try { $name = (Get-Process -Id $procId -ErrorAction Stop).ProcessName } catch {}
  $title = ($sb.ToString() -replace "[\\r\\n|]", ' ')
  Write-Output ("FG|" + $name + "|" + $title)
}
`;

  const child = spawn(
    'powershell.exe',
    ['-NoProfile', '-NoLogo', '-NonInteractive', '-Command', script],
    { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] }
  );

  let buffer = '';
  let ready = false;
  const waiters = [];

  const flush = (line) => {
    if (line === 'FGREADY') {
      ready = true;
      return;
    }
    if (!line.startsWith('FG|')) return;
    const parts = line.split('|');
    const waiter = waiters.shift();
    if (waiter) {
      waiter({
        appName: parts[1] || '',
        windowTitle: parts.slice(2).join('|') || ''
      });
    }
  };

  child.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    let index = buffer.indexOf('\n');
    while (index >= 0) {
      flush(buffer.slice(0, index).trim());
      buffer = buffer.slice(index + 1);
      index = buffer.indexOf('\n');
    }
  });

  return {
    query() {
      return new Promise((resolve) => {
        const timer = setTimeout(() => resolve({ appName: '', windowTitle: '' }), 2000);
        const ask = () => {
          waiters.push((value) => {
            clearTimeout(timer);
            resolve(value);
          });
          child.stdin.write('FG\n');
        };
        if (ready) ask();
        else {
          const poll = setInterval(() => {
            if (!ready) return;
            clearInterval(poll);
            ask();
          }, 30);
        }
      });
    },
    stop() {
      try {
        child.stdin.write('QUIT\n');
      } catch (_error) {
        child.kill();
      }
    }
  };
};

const accountKey = () =>
  String(settings.user?.email || settings.user?.username || '').trim().toLowerCase();

const pendingCount = () => taskOutbox.pendingFor(accountKey()).length;

const publicState = (extra = {}) => ({
  signedIn: Boolean(settings.token),
  user: settings.user
    ? { username: settings.user.username || '', email: settings.user.email || '' }
    : null,
  context: currentContext,
  shortcut: SHORTCUT_LABEL,
  pending: pendingCount(),
  ...extra
});

const sendSession = (extra) => {
  if (!captureWindow || captureWindow.isDestroyed()) return;
  captureWindow.webContents.send('session', publicState(extra));
};

const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const api = async (pathname, { method = 'GET', body, token = settings.token, timeout = 25000 } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${settings.apiBaseUrl}${pathname}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || `Request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The taskboard took too long to respond. Try again.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

const clearSession = () => {
  settings.token = '';
  settings.user = null;
  saveSettings();
};

const refreshProfile = async () => {
  if (!settings.token) return null;
  const data = await api('/auth/profile');
  settings.user = {
    username: data.user?.username || '',
    email: data.user?.email || ''
  };
  saveSettings();
  return settings.user;
};

const rememberContext = async () => {
  const found = foregroundWatcher ? await foregroundWatcher.query() : { appName: '', windowTitle: '' };
  if (isOwnWindow(found.appName, found.windowTitle)) {
    currentContext = lastExternalContext.label
      ? lastExternalContext
      : contextFromWindow('', '');
    return;
  }
  currentContext = contextFromWindow(found.appName, found.windowTitle);
  if (currentContext.appName || currentContext.windowTitle) {
    lastExternalContext = currentContext;
  }
};

const positionWindow = () => {
  const cursor = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(cursor);
  const width = 420;
  const height = CAPTURE_HEIGHT;
  captureWindow.setBounds({
    x: Math.round(display.workArea.x + (display.workArea.width - width) / 2),
    y: Math.round(display.workArea.y + (display.workArea.height - height) / 2),
    width,
    height
  });
};

const hideCapture = () => {
  if (!captureWindow || captureWindow.isDestroyed()) return;
  captureWindow.hide();
};

const showCapture = async () => {
  const wasVisible = captureWindow && !captureWindow.isDestroyed() && captureWindow.isVisible();
  if (!wasVisible) {
    await rememberContext();
  }
  if (!captureWindow || captureWindow.isDestroyed()) {
    createCaptureWindow();
  }
  positionWindow();
  captureWindow.show();
  captureWindow.focus();
  sendSession({ reset: !wasVisible });
};

const createCaptureWindow = () => {
  captureWindow = new BrowserWindow({
    width: 420,
    height: CAPTURE_HEIGHT,
    show: false,
    frame: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: '#1c1915',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  captureWindow.setAlwaysOnTop(true, 'screen-saver');
  captureWindow.loadFile(path.join(__dirname, 'capture.html'));
  captureWindow.on('close', (event) => {
    if (quitting) return;
    event.preventDefault();
    hideCapture();
  });
  captureWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'Escape') {
      event.preventDefault();
      hideCapture();
    }
  });
  captureWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  captureWindow.webContents.on('will-navigate', (event) => event.preventDefault());
};

const openBoard = (board) => {
  const pathName = board === 'noteboard' ? '/noteboard' : '/taskboard';
  shell.openExternal(`${settings.siteUrl}${pathName}`);
};

const startSignIn = () =>
  new Promise((resolve, reject) => {
    let settled = false;
    let server;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (server) server.close();
      fn(value);
    };

    const timer = setTimeout(() => {
      finish(reject, new Error('Sign-in timed out. Try again.'));
    }, 3 * 60 * 1000);

    server = http.createServer((req, res) => {
      let url;
      try {
        url = new URL(req.url, 'http://127.0.0.1');
      } catch (_error) {
        res.writeHead(400);
        res.end();
        return;
      }

      if (url.pathname !== '/callback') {
        res.writeHead(404);
        res.end();
        return;
      }

      const token = url.searchParams.get('token') || '';
      const errorCode = url.searchParams.get('error') || '';
      const heading = token ? 'Signed in' : 'Sign-in did not finish';
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Task Capture</title></head><body style="font-family:Segoe UI,sans-serif;background:#1c1915;color:#f6f1e8;padding:40px"><h1>${heading}</h1><p>You can close this tab and return to Task Capture.</p></body></html>`
      );

      if (token) finish(resolve, token);
      else {
        const message =
          errorCode === 'no_token'
            ? 'Google did not return a sign-in. Try again.'
            : 'Google sign-in failed. Try again.';
        finish(reject, new Error(message));
      }
    });

    server.on('error', (error) => finish(reject, error));
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      shell.openExternal(`${settings.siteUrl}/login?desktop_port=${port}`).catch((error) => {
        finish(reject, error);
      });
    });
  });

const signIn = async () => {
  if (!signInPromise) {
    signInPromise = startSignIn().finally(() => {
      signInPromise = null;
    });
  }

  const token = await signInPromise;
  settings.token = token;
  saveSettings();
  try {
    await refreshProfile();
  } catch (error) {
    clearSession();
    throw error;
  }
  kickFlush();
  return publicState();
};

const persistOutbox = () => {
  fs.mkdirSync(path.dirname(outboxPath), { recursive: true });
  fs.writeFileSync(outboxPath, JSON.stringify(taskOutbox.all(), null, 2));
};

const readOutboxFile = () => {
  try {
    taskOutbox = createOutbox(loadOutboxItems(fs.readFileSync(outboxPath, 'utf8')));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Could not read the task outbox', error);
    taskOutbox = createOutbox();
  }
};

const queuedMessage = (count) =>
  count === 1
    ? 'Saved on this computer. It will show on your taskboard once the server wakes up.'
    : `Saved on this computer. ${count} tasks will show on your taskboard once the server wakes up.`;

const scheduleFlush = () => {
  if (flushTimer || flushPromise || !settings.token || !accountKey()) return;
  if (!pendingCount()) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    kickFlush();
  }, RETRY_MS);
};

const runFlush = async () => {
  let retryLater = false;
  while (settings.token && accountKey()) {
    const item = taskOutbox.pendingFor(accountKey())[0];
    if (!item) break;
    try {
      await api('/taskboard/tasks', {
        method: 'POST',
        body: item.payload,
        timeout: SYNC_TIMEOUT_MS
      });
      taskOutbox.remove(item.id);
      persistOutbox();
    } catch (error) {
      const kind = error.status === 401 ? 'auth' : classifyHttpStatus(error.status);
      if (kind === 'auth') {
        clearSession();
        sendSession({ reset: true });
        break;
      }
      if (kind === 'permanent') {
        taskOutbox.remove(item.id);
        persistOutbox();
        recentFailures.set(item.id, error.message || 'Could not save the task.');
        sendSession({ syncError: recentFailures.get(item.id) });
        continue;
      }
      retryLater = true;
      break;
    }
  }
  return { retryLater };
};

const kickFlush = () => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (flushPromise) return flushPromise;
  if (!settings.token || !accountKey() || !pendingCount()) return Promise.resolve();

  let outcome = { retryLater: false };
  flushPromise = runFlush()
    .then((result) => {
      outcome = result || outcome;
    })
    .catch((error) => {
      console.error('Task sync failed', error);
      outcome = { retryLater: true };
    })
    .finally(() => {
      flushPromise = null;
      if (tray) rebuildTray();
      if (!settings.token || !accountKey()) return;
      if (outcome.retryLater) scheduleFlush();
      else if (pendingCount()) kickFlush();
    });
  return flushPromise;
};

const saveTask = async (title, note = '', personal = false) => {
  const cleaned = String(title || '').trim().slice(0, 160);
  if (!cleaned) {
    throw new Error('Write the title first.');
  }
  if (!settings.token) {
    const error = new Error('Sign in before saving a task.');
    error.signedOut = true;
    throw error;
  }
  if (!accountKey()) {
    throw new Error('Sign in before saving a task.');
  }

  const context = currentContext.appName || currentContext.windowTitle
    ? currentContext.label
    : '';
  const written = String(note || '').trim();
  const description = written && context
    ? `${written}\n\n${context}`
    : written || context;
  const item = taskOutbox.enqueue({
    id: crypto.randomUUID(),
    accountKey: accountKey(),
    payload: {
      title: cleaned,
      description: description.slice(0, 4000),
      date: today(),
      status: 'started',
      isPersonal: Boolean(personal)
    }
  });
  persistOutbox();
  if (tray) rebuildTray();

  await Promise.race([
    kickFlush(),
    new Promise((resolve) => setTimeout(resolve, QUICK_SAVE_MS))
  ]);

  const failure = recentFailures.get(item.id);
  if (failure) {
    recentFailures.delete(item.id);
    throw new Error(failure);
  }

  if (!settings.token && taskOutbox.get(item.id)) {
    const expired = new Error('Saved on this computer. Sign in again and it will sync.');
    expired.signedOut = true;
    throw expired;
  }

  if (!taskOutbox.get(item.id)) {
    return { message: 'Saved to today’s taskboard.', pending: pendingCount() };
  }

  const pending = pendingCount();
  return { message: queuedMessage(pending), queued: true, pending };
};

const rebuildTray = () => {
  const menu = Menu.buildFromTemplate([
    { label: 'New task', click: () => showCapture() },
    { label: 'Open noteboard', click: () => openBoard('noteboard') },
    { label: 'Open taskboard', click: () => openBoard('taskboard') },
    { type: 'separator' },
    {
      label: 'Sign out',
      enabled: Boolean(settings.token),
      click: () => {
        clearSession();
        sendSession({ reset: true });
        showCapture();
      }
    },
    {
      label: 'Start with Windows',
      type: 'checkbox',
      checked: Boolean(settings.openAtLogin),
      click: (item) => {
        settings.openAtLogin = item.checked;
        saveSettings();
        applyLoginItem();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        quitting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(menu);
  const waiting = pendingCount() ? ` — ${pendingCount()} waiting to sync` : '';
  tray.setToolTip(`Task Capture — ${SHORTCUT_LABEL}${waiting}`);
};

const createTray = () => {
  const image = nativeImage.createFromPath(path.join(__dirname, 'tray.png'));
  tray = new Tray(image.isEmpty() ? nativeImage.createEmpty() : image.resize({ width: 16, height: 16 }));
  tray.on('click', () => showCapture());
  rebuildTray();
};

const registerIpc = () => {
  ipcMain.handle('get-state', () => publicState());
  ipcMain.handle('sign-in', () => signIn());
  ipcMain.handle('sign-out', () => {
    clearSession();
    return publicState({ reset: true });
  });
  ipcMain.handle('save-task', async (_event, task) => {
    try {
      const title = typeof task === 'string' ? task : task?.title;
      const note = typeof task === 'string' ? '' : task?.note;
      const personal = typeof task === 'string' ? false : Boolean(task?.personal);
      return { ok: true, ...(await saveTask(title, note, personal)) };
    } catch (error) {
      return {
        ok: false,
        message: error.message || 'Could not save the task.',
        signedOut: Boolean(error.signedOut)
      };
    }
  });
  ipcMain.handle('open-board', (_event, board) => {
    openBoard(board);
    return true;
  });
  ipcMain.handle('hide', () => {
    hideCapture();
    return true;
  });
};

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    showCapture().catch((error) => console.error(error));
  });

  app.whenReady().then(async () => {
    settingsPath = path.join(app.getPath('userData'), 'settings.json');
    outboxPath = path.join(app.getPath('userData'), 'outbox.json');
    loadSettings();
    readOutboxFile();
    applyLoginItem();
    foregroundWatcher = createForegroundWatcher();
    registerIpc();
    createTray();

    const registered = globalShortcut.register(SHORTCUT, () => {
      showCapture().catch((error) => console.error(error));
    });
    if (!registered) {
      console.error(`Could not register ${SHORTCUT_LABEL}`);
    }

    if (settings.token) {
      kickFlush();
      try {
        await refreshProfile();
      } catch (error) {
        if (error.status === 401) clearSession();
      }
      kickFlush();
    }

    if (!settings.token) {
      await showCapture();
    }
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
    if (foregroundWatcher) foregroundWatcher.stop();
  });

  app.on('window-all-closed', () => {});
}
