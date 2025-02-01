// src/main/main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

let mainWindow;

const oauth2Client = new OAuth2Client({
  clientId: 'YOUR_CLIENT_ID', // Replace with your Client ID
  clientSecret: 'YOUR_CLIENT_SECRET', // Replace with your Client Secret
  redirectUri: 'http://localhost', // Must match the redirect URI in Google Cloud Console
});

function createWindow() {
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
  console.log('Loading login page from:', loginPagePath); // Debugging log
  mainWindow.loadFile(loginPagePath);

  // Open DevTools (optional, for development)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
  console.log('Login with Google requested'); // Add this line
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
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
    console.log('Redirecting to:', url); // Add this line
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
        mainWindow.webContents.send('login-success', tokens);
      });
    }
  });
});