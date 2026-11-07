const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');

let win;
app.commandLine.appendSwitch('enable-features', 'FileSystemAccessAPI');

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 900, minHeight: 600,
    title: 'Ders Programı',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('DersProgrami.html');
  win.setMenuBarVisibility(false);
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
});

ipcMain.handle('html-to-pdf', async (_e, html) => {
  const w = new BrowserWindow({ show: false, webPreferences: { offscreen: true, sandbox: true } });
  try {
    await w.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    await new Promise(r => setTimeout(r, 400));
    return await w.webContents.printToPDF({ landscape: true, pageSize: 'A4', printBackground: true });
  } finally { w.destroy(); }
});

ipcMain.handle('gtranslate', async (_e, { text, tl }) => {
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
              encodeURIComponent(tl) + '&dt=t&q=' + encodeURIComponent(text);
  try { const r = await fetch(url); if (!r.ok) return null; return await r.json(); }
  catch { return null; }
});

app.on('window-all-closed', () => app.quit());