
const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('node:path');
const { fileURLToPath } = require('node:url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 980,
    minHeight: 680,
    title: 'Gráfica Rabbit | Financeiro',
    backgroundColor: '#f4f6fa',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: false
    }
  });

  win.loadFile(path.join(__dirname, 'grafica_rabbit_financeiro.html'));

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      event.preventDefault();
      shell.openExternal(url);
      return;
    }

    if (!url.startsWith('file://')) {
      event.preventDefault();
      return;
    }

    try {
      const target = path.resolve(fileURLToPath(url));
      const localFile = path.resolve(
        path.join(__dirname, 'grafica_rabbit_financeiro.html')
      );

      if (target !== localFile) {
        event.preventDefault();
      }
    } catch {
      event.preventDefault();
    }
  });

  win.webContents.on('render-process-gone', async (_event, details) => {
    console.error(
      'A janela do aplicativo foi encerrada inesperadamente:',
      details
    );

    if (win.isDestroyed()) return;

    await dialog.showMessageBox(win, {
      type: 'error',
      title: 'Gráfica Rabbit Financeiro',
      message: 'O aplicativo encontrou um problema.',
      detail:
        'Reabra o programa. Mantenha seus backups JSON em local seguro.'
    });
  });
}

app.whenReady().then(() => {
  app.setAppUserModelId('br.com.graficarabbit.financeiro');

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
