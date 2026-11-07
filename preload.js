const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  htmlToPdf: (html) => ipcRenderer.invoke('html-to-pdf', html),
  gtranslate: (text, tl) => ipcRenderer.invoke('gtranslate', { text, tl }),
});