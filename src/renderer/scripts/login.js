// Get references to DOM elements

console.log('login.js script loaded'); // This will execute as soon as the script is loaded

const loginButton = document.getElementById('login-button');
const userInfo = document.getElementById('user-info');
const loginForm = document.getElementById('login-form');

// Handle "Login with Google" button click
loginButton.addEventListener('click', async () => {
  console.log('Login button clicked'); // Debugging log
  try {
    // Trigger the OAuth flow in the main process
    await window.electronAPI.loginWithGoogle();
  } catch (error) {
    console.error('Error during login:', error); // Debugging log
    userInfo.textContent = 'Login failed. Please try again.';
  }
});

// Handle successful login
window.electronAPI.onLoginSuccess((event, tokens) => {
  console.log('Login successful, tokens received:', tokens); // Debugging log
  // Update the UI to show login success
  userInfo.innerHTML = `
    <p>Login successful! Fetching user data...</p>
  `;

  // Fetch and display user data
  fetchUserData(tokens);
});

// Fetch user data from YouTube API
async function fetchUserData(tokens) {
  try {
    console.log('Fetching user data...'); // Debugging log
    // Fetch the user's YouTube channel information
    const response = await fetch('https://www.googleapis.com/youtube/v3/channels', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
      params: {
        part: 'snippet',
        mine: true,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    console.log('User data received:', data); // Debugging log
    const channel = data.items[0];

    // Display the user's channel information
    userInfo.innerHTML = `
      <h2>Welcome, ${channel.snippet.title}!</h2>
      <img src="${channel.snippet.thumbnails.default.url}" alt="Profile Picture">
      <p>You are now logged in.</p>
    `;
  } catch (error) {
    console.error('Error fetching user data:', error); // Debugging log
    userInfo.textContent = 'Failed to fetch user data. Please try again.';
  }
}