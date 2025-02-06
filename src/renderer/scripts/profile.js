// src/renderer/scripts/profile.js

document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve the stored tokens using the exposed electronAPI
    const tokens = await window.electronAPI.getTokens();
    if (!tokens || !tokens.access_token) {
      console.error('No access token found.');
      document.querySelector('.profile-content').innerHTML =
        '<p>Error: Authentication tokens not found. Please log in again.</p>';
      return;
    }
  
    try {
      // Fetch the user's channel data from YouTube API
      const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('YouTube channel data:', data);
  
      // Check if we got a valid channel entry
      if (data.items && data.items.length > 0) {
        const channelSnippet = data.items[0].snippet;
        
        // Update the profile page with the channel's title and profile picture.
        const profilePicUrl = channelSnippet.thumbnails.high?.url || channelSnippet.thumbnails.default.url;
        const channelTitle = channelSnippet.title;
  
        const profilePicElement = document.querySelector('.profile-pic');
        const profileNameElement = document.querySelector('.profile-name');
  
        if (profilePicElement) {
          profilePicElement.src = profilePicUrl;
        }
        if (profileNameElement) {
          profileNameElement.textContent = channelTitle;
        }
      } else {
        console.error('No channel data found.');
        document.querySelector('.profile-content').innerHTML =
          '<p>No channel information available for this account.</p>';
      }
    } catch (error) {
      console.error('Error fetching YouTube channel data:', error);
      document.querySelector('.profile-content').innerHTML =
        '<p>Failed to load channel data. Please try again later.</p>';
    }
  
    // --- Folder Persistence and Modal Logic ---
  
    // Function to render folders from persistent storage
    async function renderFolders() {
      const folders = await window.electronAPI.getFolders();
      const foldersList = document.getElementById('folders-list');
      foldersList.innerHTML = ''; // Clear current list
  
      folders.forEach(folder => {
        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item';
        
        // Create the folder icon element (using a Unicode folder emoji)
        const folderIcon = document.createElement('div');
        folderIcon.className = 'folder-icon';
        folderIcon.textContent = '📁';
        
        // Create the folder name element
        const folderLabel = document.createElement('div');
        folderLabel.className = 'folder-name';
        folderLabel.textContent = folder.name;
        
        // Append icon and label to the new folder element
        folderItem.appendChild(folderIcon);
        folderItem.appendChild(folderLabel);
        
        // Make the folder clickable: when clicked, load the folder videos screen
        folderItem.style.cursor = 'pointer';
        folderItem.addEventListener('click', () => {
          console.log(`Folder clicked: ${folder.name} (ID: ${folder.id})`);
          // Navigate to the folder videos screen, passing folder id and name as query parameters.
          window.location.href = `../pages/folder.html?id=${folder.id}&name=${encodeURIComponent(folder.name)}`;
        });
        
        // Append the folder item to the folders list
        foldersList.appendChild(folderItem);
      });
    }
  
    // Initially render any saved folders
    renderFolders();
  
    // Elements for modal and folder creation
    const openModalBtn = document.getElementById('open-create-folder-btn');
    const createFolderModal = document.getElementById('create-folder-modal');
    const closeModalBtn = createFolderModal.querySelector('.close');
    const createFolderBtn = document.getElementById('create-folder-btn');
  
    // Open the modal when the "Create Folder" button is clicked
    openModalBtn.addEventListener('click', () => {
      createFolderModal.style.display = 'block';
    });
  
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', () => {
      createFolderModal.style.display = 'none';
    });
  
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
      if (e.target === createFolderModal) {
        createFolderModal.style.display = 'none';
      }
    });
  
    // Handle creating a new folder
    createFolderBtn.addEventListener('click', async () => {
      const folderNameInput = document.getElementById('folder-name');
      const folderName = folderNameInput.value.trim();
      if (folderName === '') {
        alert('Please enter a folder name.');
        return;
      }
      
      // Retrieve current folders, add the new folder, and save persistently
      let folders = await window.electronAPI.getFolders();
      
      const newFolder = {
        id: Date.now().toString(), // unique id
        name: folderName,
        videos: [] // to be used later for storing video data
      };
      
      folders.push(newFolder);
      
      // Save updated folders list
      await window.electronAPI.saveFolders(folders);
      
      // Log that the new folder was created
      console.log(`New folder created: ${folderName} (ID: ${newFolder.id})`);
      
      // Re-render folders
      renderFolders();
      
      // Clear the input and close the modal
      folderNameInput.value = '';
      createFolderModal.style.display = 'none';
    });
  
    // --- Profile Button Logic ---
    const profileButton = document.getElementById('profile-button');
    profileButton.addEventListener('click', () => {
      console.log('Profile button clicked');
      // If not already on the profile screen, reload it.
      window.location.href = '../pages/profile.html';
    });
  });
  