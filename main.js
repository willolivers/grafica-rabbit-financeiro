const { app, BrowserWindow, shell, dialog } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let updateCheckStarted = false;
let updatePromptOpen = false;

function createWindow() {
  mainWindow = new BrowserWindow({
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

  mainWindow.loadFile(path.join(__dirname, 'grafica_rabbit_financeiro.html'));

  // Mantém o app dentro da janela; links externos abrem no navegador padrão.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const localFile = path.resolve(__dirname, 'grafica_rabbit_financeiro.html');
    if (url.startsWith('http://') || url.startsWith('https://') || !url.startsWith('file://')) {
      event.preventDefault();
      if (url.startsWith('http://') || url.startsWith('https://')) shell.openExternal(url);
      return;
    }
    try {
      const target = decodeURIComponent(new URL(url).pathname);
      if (path.resolve(target) !== localFile) event.preventDefault();
    } catch { event.preventDefault(); }
  });

  mainWindow.webContents.on('render-process-gone', async (_event, details) => {
    console.error('A janela do aplicativo foi encerrada inesperadamente:', details);
    await dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Gráfica Rabbit Financeiro',
      message: 'O aplicativo encontrou um problema.',
      detail: 'Reabra o programa. Mantenha seus backups JSON em local seguro.'
    });
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

function configureAutoUpdates() {
  // Builds de desenvolvimento não devem consultar nem instalar releases.
  if (!app.isPackaged || updateCheckStarted) return;
  updateCheckStarted = true;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on('error', (error) => {
    console.error('Erro ao verificar/baixar atualização:', error);
    // Não interrompe a abertura do sistema se o servidor estiver indisponível.
  });

  autoUpdater.on('update-available', async (info) => {
    if (updatePromptOpen || !mainWindow) return;
    updatePromptOpen = true;
    try {
      const result = await dialog.showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['Baixar atualização', 'Agora não'],
        defaultId: 0,
        cancelId: 1,
        title: 'Atualização disponível',
        message: `A versão ${info.version} do Gráfica Rabbit Financeiro está disponível.`,
        detail: 'Seus dados financeiros devem permanecer no computador. Por segurança, faça um backup antes de atualizar.'
      });
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    } finally {
      updatePromptOpen = false;
    }
  });

  autoUpdater.on('update-not-available', () => {
    console.log('O aplicativo já está na versão mais recente.');
  });

  autoUpdater.on('download-progress', (progress) => {
    console.log(`Download da atualização: ${Math.round(progress.percent)}%`);
  });

  autoUpdater.on('update-downloaded', async (info) => {
    if (!mainWindow) return;
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: ['Reiniciar e atualizar', 'Depois'],
      defaultId: 0,
      cancelId: 1,
      title: 'Atualização pronta',
      message: `A versão ${info.version} foi baixada.`,
      detail: 'Salve qualquer informação que esteja preenchendo antes de reiniciar.'
    });
    if (result.response === 0) autoUpdater.quitAndInstall();
  });

  // Falhas de atualização não devem impedir o uso normal do programa.
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((error) => {
      console.error('Não foi possível verificar atualizações:', error);
    });
  }, 5000);
}

app.whenReady().then(() => {
  app.setAppUserModelId('br.com.graficarabbit.financeiro');
  createWindow();
  configureAutoUpdates();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
