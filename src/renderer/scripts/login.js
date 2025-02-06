document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const userInfo = document.getElementById('user-info');

  if (!loginButton) {
    console.error('LoginButton not found in the DOM');
    return;
  }

  // Handle "Login with Google" button click
  loginButton.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent form submission
    console.log('Login button clicked'); // Debugging log
    try {
      // Trigger the OAuth flow in the main process
      await window.electronAPI.loginWithGoogle();
    } catch (error) {
      console.error('Error during login:', error); // Debugging log
      if (userInfo) {
        userInfo.textContent = 'Login failed. Please try again.';
      }
    }
  });

  // Handle successful login
  window.electronAPI.onLoginSuccess((event, tokens) => {
    console.log('Login successful, tokens received:', tokens); // Debugging log
    // Update the UI to show login success
    if (userInfo) {
      userInfo.innerHTML = `
        <p>Login successful! Fetching user data...</p>
      `;

      // Fetch and display user data
      fetchUserData(tokens);
    }
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
      if (userInfo) {
        userInfo.innerHTML = `
          <h2>Welcome, ${channel.snippet.title}!</h2>
          <img src="${channel.snippet.thumbnails.default.url}" alt="Profile Picture">
          <p>You are now logged in.</p>
        `;
      }
    } catch (error) {
      console.error('Error fetching user data:', error); // Debugging log
      if (userInfo) {
        userInfo.textContent = 'Failed to fetch user data. Please try again.';
      }
    }
  }
});