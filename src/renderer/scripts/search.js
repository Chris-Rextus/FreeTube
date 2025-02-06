// src/renderer/scripts/search.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const videosGrid = document.getElementById('videos-grid');
  
    // Function to render videos in the grid
    function renderVideos(videos) {
      videosGrid.innerHTML = '';
      if (videos.length === 0) {
        videosGrid.innerHTML = '<p class="placeholder">No videos found.</p>';
        return;
      }
      videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        
        const thumbnail = document.createElement('img');
        thumbnail.className = 'video-thumbnail';
        thumbnail.src = video.thumbnail;
        
        const info = document.createElement('div');
        info.className = 'video-info';
        
        const title = document.createElement('div');
        title.className = 'video-title';
        title.textContent = video.title;
        
        const channel = document.createElement('div');
        channel.className = 'video-channel';
        channel.textContent = video.channel;
        
        const views = document.createElement('div');
        views.className = 'video-views';
        views.textContent = video.views + ' views';
        
        info.appendChild(title);
        info.appendChild(channel);
        info.appendChild(views);
        
        videoItem.appendChild(thumbnail);
        videoItem.appendChild(info);
        
        videosGrid.appendChild(videoItem);
      });
    }
  
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (!query) {
        videosGrid.innerHTML = '<p class="placeholder">Please enter a search query.</p>';
        return;
      }
      console.log('Searching for:', query);
      
      // For demonstration, create some dummy video results.
      const dummyVideos = [
        {
          title: 'Video 1 about ' + query,
          thumbnail: 'https://via.placeholder.com/220x124.png?text=Video+1',
          channel: 'Channel One',
          views: 12345
        },
        {
          title: 'Video 2 about ' + query,
          thumbnail: 'https://via.placeholder.com/220x124.png?text=Video+2',
          channel: 'Channel Two',
          views: 67890
        },
        {
          title: 'Video 3 about ' + query,
          thumbnail: 'https://via.placeholder.com/220x124.png?text=Video+3',
          channel: 'Channel Three',
          views: 23456
        }
      ];
      renderVideos(dummyVideos);
    });
  });
  