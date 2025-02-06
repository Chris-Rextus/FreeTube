// src/renderer/scripts/folder.js

document.addEventListener('DOMContentLoaded', async () => {
  // Parse the query parameters from the URL
  const params = new URLSearchParams(window.location.search);
  const folderId = params.get('id');
  const folderName = params.get('name');

  // Update the header with the folder's name (if provided)
  const folderHeader = document.getElementById('folder-name-header');
  if (folderName && folderHeader) {
    folderHeader.textContent = decodeURIComponent(folderName);
  }

  // Retrieve the stored folders from persistent storage
  const folders = await window.electronAPI.getFolders();
  // Find the folder that matches the folderId from the URL
  const folder = folders.find(f => f.id === folderId);

  const videosGrid = document.querySelector('.videos-grid');
  videosGrid.innerHTML = ''; // Clear any existing content

  if (!folder) {
    videosGrid.innerHTML = '<p>Error: Folder not found.</p>';
  } else if (!folder.videos || folder.videos.length === 0) {
    // Display a message if there are no videos in the folder
    videosGrid.innerHTML = '<p class="placeholder">No videos added yet.</p>';
  } else {
    // Render each video into the grid
    folder.videos.forEach(video => {
      const videoItem = document.createElement('div');
      videoItem.className = 'video-item';
      
      // Create the thumbnail element
      const thumbnail = document.createElement('img');
      thumbnail.className = 'video-thumbnail';
      thumbnail.src = video.thumbnail || 'default-thumbnail.png'; // Fallback thumbnail
      
      // Create a container for video information
      const videoInfo = document.createElement('div');
      videoInfo.className = 'video-info';
      
      // Video title
      const title = document.createElement('div');
      title.className = 'video-title';
      title.textContent = video.title;
      
      // Video channel
      const channel = document.createElement('div');
      channel.className = 'video-channel';
      channel.textContent = video.channel;
      
      // Video views
      const views = document.createElement('div');
      views.className = 'video-views';
      views.textContent = video.views ? `${video.views} views` : '';
      
      // Assemble the video info and item
      videoInfo.appendChild(title);
      videoInfo.appendChild(channel);
      videoInfo.appendChild(views);
      videoItem.appendChild(thumbnail);
      videoItem.appendChild(videoInfo);
      
      // Append the video item to the grid
      videosGrid.appendChild(videoItem);
    });
  }

  // Handle the "Go Back" button to return to the profile screen
  const goBackBtn = document.getElementById('go-back-btn');
  goBackBtn.addEventListener('click', async () => {
    console.log("Go Back button clicked");
    await window.electronAPI.goBack();
  });
});
