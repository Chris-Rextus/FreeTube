# FreeTube

The application provide efficient and distraction-proof use for YouTube, enhancing daily performance and time management.

# Initial Project Structure

freetube/
├── src/
│   ├── main/                  # Electron main process files
│   │   ├── main.js            # Main process entry point
│   │   ├── api.js             # Handles YouTube API requests
│   │   ├── storage.js         # Manages local storage (folders, metadata)
│   │   └── utils.js           # Utility functions (e.g., file operations)
│   ├── renderer/              # Electron renderer process files
│   │   ├── index.html         # Main HTML file for the UI
│   │   ├── styles.css         # CSS for styling the application
│   │   ├── scripts.js         # JavaScript for dynamic UI functionality
│   │   └── player.js          # Handles YouTube IFrame API and video playback
│   └── preload.js             # Preload script for secure IPC communication
├── assets/                    # Static assets (icons, images, etc.)
│   └── icons/
│       ├── icon.png           # Application icon
│       └── logo.svg           # Application logo
├── dist/                      # Build output directory (created during build process)
├── .gitignore                 # Specifies files to ignore in Git
├── package.json               # Project metadata and dependencies
├── README.md                  # Project documentation
└── electron-builder.json      # Configuration for Electron Builder