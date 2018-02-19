import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
} from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import child_process from 'child_process';
import path from 'path';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// const isDevMode = process.execPath.match(/[\\/]electron/);
const isDevMode = false;

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on('show-open-dialog', (event) => {
    const selectedFiles = dialog.showOpenDialog({
      message: 'Select files to ZIP',
      properties: [
        'openFile',
        'multiSelections',
        'showHiddenFiles',
      ],
    });
    event.sender.send('files-selected', selectedFiles);
  });

  ipcMain.on('write-zip-file', (event, args) => {
    const date = (new Date())
      .toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(/([\/\s])/g, '-').replace(/:/g, '');
    const zipFileName = date + '-files.zip';
    const zipFilePath = path.join(__dirname, zipFileName);
    const { password, selectedFiles } = args;
    let command = path.join(__dirname, 'createEncryptedZipFile.exp') + ' ' +
      zipFilePath + ' ' + password + ' ' + selectedFiles.join(' ');
    child_process.execSync(command);
    child_process.execSync('mv ' + zipFilePath + ' ~/Desktop/');
    event.sender.send('zip-file-written', zipFileName);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
