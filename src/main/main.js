// src/main/main.js

(async () => {
  try {
    // Dynamically import electron-store (ES Module)
    const { default: Store } = await import('electron-store');
    const store = new Store();

    // Set default for folders if not already set
    if (!store.get('folders')) {
      store.set('folders', []);
    }

    // Standard CommonJS requires
    const { app, BrowserWindow, ipcMain } = require('electron');
    const path = require('path');
    const { OAuth2Client } = require('google-auth-library');

    let mainWindow;

    const oauth2Client = new OAuth2Client({
      clientId: '1054354536199-emu3qnarfspi5q26fsbdm5rbpq9nq08a.apps.googleusercontent.com', // Replace with your Client ID
      clientSecret: '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', // Replace with your Client Secret
      redirectUri: 'http://localhost', // Must match the redirect URI in Google Cloud Console
    });

    function createWindow() {
      console.log('Creating main window...');
      mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
          preload: path.join(__dirname, '../preload.js'),
          contextIsolation: true,
          enableRemoteModule: false,
          sandbox: true,
        },
        icon: path.join(__dirname, '../renderer/assets/youtubelogo.png'),
      });

      const loginPagePath = path.join(__dirname, '../renderer/pages/login.html');
      console.log('Loading login page from:', loginPagePath);
      mainWindow.loadFile(loginPagePath);

      // Uncomment to open DevTools for debugging
      // mainWindow.webContents.openDevTools();

      mainWindow.on('closed', () => {
        console.log('Main window closed.');
        mainWindow = null;
      });
    }

    app.whenReady().then(createWindow).catch((err) => {
      console.error('Error during app initialization:', err);
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        console.log('All windows closed. Quitting app.');
        app.quit();
      }
    });

    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow();
      }
    });

    // Handle OAuth login
    ipcMain.handle('login-with-google', async () => {
      console.log('Login with Google requested');
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.readonly'],
      });

      const authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      });

      authWindow.loadURL(authUrl);

      authWindow.webContents.on('will-redirect', (event, url) => {
        console.log('Redirecting to:', url);
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');
        if (code) {
          authWindow.close();
          oauth2Client.getToken(code, (err, tokens) => {
            if (err) {
              console.error('Error retrieving access token', err);
              return;
            }
            oauth2Client.setCredentials(tokens);
            console.log('Login successful, tokens received:', tokens);

            // Store tokens persistently using electron-store
            store.set('authTokens', tokens);
            console.log('Tokens stored persistently.');

            // Optionally send tokens to the current page if needed
            if (mainWindow && mainWindow.webContents) {
              mainWindow.webContents.send('login-success', tokens);
            }

            // Now load the profile page
            const profilePagePath = path.join(__dirname, '../renderer/pages/profile.html');
            console.log('Loading profile page from:', profilePagePath);
            mainWindow.loadFile(profilePagePath);
          });
        }
      });
    });

    // Expose an IPC handler to retrieve stored tokens in the renderer process
    ipcMain.handle('get-tokens', () => {
      return store.get('authTokens');
    });

    // Expose IPC handlers to get and save folder data
    ipcMain.handle('get-folders', () => {
      return store.get('folders') || [];
    });

    ipcMain.handle('save-folders', (event, folders) => {
      store.set('folders', folders);
      return store.get('folders');
    });

    // Expose an IPC handler to go back to the profile screen
    ipcMain.handle('go-back', () => {
      const profilePagePath = path.join(__dirname, '../renderer/pages/profile.html');
      console.log('Go back requested: Loading profile page from:', profilePagePath);
      mainWindow.loadFile(profilePagePath);
    });
  } catch (error) {
    console.error('Error during startup:', error);
  }
})().catch((error) => {
  console.error('Unhandled error in main.js:', error);
});
