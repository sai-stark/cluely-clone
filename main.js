const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  // Linux-specific window type for better compatibility
  const windowType = process.platform === 'linux' ? 'toolbar' : 'panel';
  
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    focusable: true,
    type: windowType,
    acceptFirstMouse: true,
    // Performance optimizations
    webSecurity: false,
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    // Linux-specific settings for better window management
    ...(process.platform === 'linux' && {
      titleBarStyle: 'hidden',
      autoHideMenuBar: true
    }),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // Performance optimizations
      backgroundThrottling: false,
      webgl: false,
      offscreen: false
    }
  });
  
  // Linux-specific window behavior
  if (process.platform === 'linux') {
    // Ensure window stays on top on Linux
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    // Set window flags for Linux
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  } else {
    mainWindow.setContentProtection(true);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }
  
  mainWindow.setIgnoreMouseEvents(false);
  mainWindow.loadFile('index.html');
  if (process.platform === 'darwin') app.dock.hide();

  // Create system tray
  createTray();

  // IPC handlers for overlay mode
  ipcMain.on('set-overlay-mode', (event, enable) => {
    if (enable) {
      // Keep focusable for keyboard events, but ignore mouse events
      mainWindow.setFocusable(true);
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      mainWindow.setFocusable(true);
      mainWindow.setIgnoreMouseEvents(false);
    }
  });

  // IPC handler for dragging the window
  ipcMain.on('drag-window', (event, deltaX, deltaY) => {
    const [x, y] = mainWindow.getPosition();
    mainWindow.setPosition(x + deltaX, y + deltaY);
  });

  // IPC handler for minimizing the window
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  // IPC handler for closing the window
  ipcMain.on('close-window', () => {
    console.log('Closing application...');
    app.quit();
  });

  // Handle window minimize event
  mainWindow.on('minimize', () => {
    mainWindow.hide();
  });

  // Handle window close event
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  // Create tray icon (using a simple text icon for now)
  tray = new Tray(path.join(__dirname, 'favicon.ico'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Hide App',
      click: () => {
        mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('Cluely Clone - AI Interview Assistant');
  tray.setContextMenu(contextMenu);
  
  // Double-click tray icon to show window
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Global shortcut to toggle overlay (improved)
  globalShortcut.register('CommandOrControl+Shift+O', () => {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
      mainWindow.focus();
      // Always restore to normal mode when shown
      mainWindow.setFocusable(true);
      mainWindow.setIgnoreMouseEvents(false);
    } else {
      // If visible, just hide it
      mainWindow.hide();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Clean up tray on app quit
app.on('before-quit', () => {
  app.isQuiting = true;
}); 