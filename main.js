const { app, BrowserWindow, screen, nativeImage, Menu, Tray } = require('electron');
const path = require('path'); 
const version = require('./package.json').version;
const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");
const contextMenu = require('electron-context-menu');;

contextMenu({
	showSaveImageAs: true,
  ShowSearchWithGoogle: true,
  copy: true,
  paste: true,
  cut: true
});

let mainWindow;
let tray;
setupTitlebar();

function createMainWindow() {

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const iconPath = path.join(__dirname, './src/loading productions.png');
  const icon = nativeImage.createFromPath(iconPath);

  mainWindow = new BrowserWindow({
    width,
    height,
	  titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      spellcheck: true,
	    webgl: true,
      webviewTag: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    },
	  icon: icon
  });

  mainWindow.loadFile('./src/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

    // Handle failed loads to display error 404 page
    mainWindow.webContents.on('did-fail-load', (_, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (isMainFrame) {
        const errorPageURL = `file://${path.join(__dirname, './src/404.html')}`;
        mainWindow.loadURL(errorPageURL);
      }
    });
    attachTitlebarToWindow(mainWindow);
}
app.on('ready', () => {
  
  const iconPath = path.join(__dirname, './src/loading productions.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: `Version ${version}`, click: createGithubWindow },
    { label: 'Discord', click: createDiscordWindow },
    { label: 'Donate', click: createPayPalWindow },
    { label: 'Home',
      click: () => {
        if (mainWindow !== null) {
          mainWindow.loadFile('./src/index.html');
          mainWindow.show();
        }
      },
    },
    { label: 'Exit', role: 'quit' },
  ]);

  tray.setToolTip('Loading Productions')
  tray.setContextMenu(contextMenu)

  const TitleBarMenu = Menu.buildFromTemplate([
    {
      label: 'Version ' + version,
      submenu: [
        { label: 'Check for Updates', click: () => {
          if (mainWindow !== null) {
            mainWindow.webContents.loadURL('https://github.com/RepGraphics/Loading-Productions-Application/releases');
          }
        }, icon: nativeImage.createFromPath( path.join(__dirname, './src/github.png')) },
      ],
    },
    {
      label: 'Navigation',
      submenu: [
        { label: 'Home', click: () => {
          if (mainWindow !== null) {
            mainWindow.webContents.loadFile('./src/index.html');
          }
        }, icon: nativeImage.createFromPath( path.join(__dirname, './src/home.png')) },
        { label: 'Back', click: () => {
          if (mainWindow !== null) {
            mainWindow.webContents.goBack();
          }
        }, icon: nativeImage.createFromPath( path.join(__dirname, './src/back.png')) },
        { label: 'Forward', click: () => {
          if (mainWindow !== null) {
            mainWindow.webContents.goForward();
          }
        }, icon: nativeImage.createFromPath( path.join(__dirname, './src/forward.png')) },
        { type: 'separator' },
        { label: 'Exit', role: 'quit', icon: nativeImage.createFromPath(path.join(__dirname, './src/exit.png')) },
      ],
    },
    {
      label: 'Options',
      submenu: [
        { label: 'Refresh', role: 'reload', icon: nativeImage.createFromPath(path.join(__dirname, './src/refresh.png')) },
        { label: 'Force Refresh', role: 'forceReload', icon: nativeImage.createFromPath(path.join(__dirname, './src/reset.png')) },
        { type: 'separator' },
        { label: 'Zoom In', role: 'zoomIn', icon: nativeImage.createFromPath(path.join(__dirname, './src/zoomin.png')) },
        { label: 'Zoom Out', role: 'zoomOut', icon: nativeImage.createFromPath(path.join(__dirname, './src/zoomout.png')) },
        { label: 'Reset Zoom', role: 'resetZoom', icon: nativeImage.createFromPath(path.join(__dirname, './src/reset.png')) },
        { label: 'Toggle Fullscreen', role: 'togglefullscreen', icon: nativeImage.createFromPath(path.join(__dirname, './src/fullscreen.png')) },
        { type: 'separator' },
        { label: 'Developer Tools', role: 'toggleDevTools', icon: nativeImage.createFromPath(path.join(__dirname, './src/tools.png')) },
        { label: 'Exit', role: 'quit', icon: nativeImage.createFromPath(path.join(__dirname, './src/exit.png')) },
      ],
    },
  ]);
  

  createMainWindow();
  Menu.setApplicationMenu(TitleBarMenu);
  attachTitlebarToWindow(mainWindow);
})

function createGithubWindow() {

  const iconPath = path.join(__dirname, './src/github.png');
  const icon = nativeImage.createFromPath(iconPath);

  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      spellcheck: true,
	    webgl: true
    },
    icon: icon
  });

  newWindow.loadURL('https://github.com/RepGraphics/Loading-Productions-Application/releases');
}

function createPayPalWindow() {

  const iconPath = path.join(__dirname, './src/paypal.png');
  const icon = nativeImage.createFromPath(iconPath);

  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      spellcheck: true,
	    webgl: true
    },
    icon: icon
  });

  newWindow.loadURL('https://www.paypal.com/paypalme/repgraphics');
}

function createDiscordWindow() {

  const iconPath = path.join(__dirname, './src/discord.png');
  const icon = nativeImage.createFromPath(iconPath);

  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      spellcheck: true,
	    webgl: true
    },
    icon: icon
  });

  newWindow.loadURL('https://discord.gg');
}

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});