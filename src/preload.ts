// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen'),
  setValue: (key: string, value: any) => ipcRenderer.invoke('set-value', key, value),
  getValue: async (key: string) => ipcRenderer.invoke('get-value', key)
})
