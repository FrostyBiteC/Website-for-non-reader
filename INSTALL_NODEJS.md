# Node.js Installation Instructions

To run the local server and test the account creation functionality, you need to install Node.js.

## Windows Installation

1. Go to the [Node.js download page](https://nodejs.org/en/download/)
2. Download the LTS (Long Term Support) version for Windows
3. Run the downloaded installer
4. Follow the installation wizard (keep all default settings)
5. After installation completes, open a **new terminal** (important!)
6. Verify installation by running:
   ```bash
   node --version
   npm --version
   ```

## macOS Installation

1. Go to the [Node.js download page](https://nodejs.org/en/download/)
2. Download the LTS version for macOS
3. Run the downloaded package installer
4. Follow the installation wizard
5. Verify installation by running in terminal:
   ```bash
   node --version
   npm --version
   ```

## Linux Installation (Debian/Ubuntu)

```bash
# Using package manager
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

## Once Node.js is Installed

1. Open a terminal in the project directory (`c:/Users/Public/Downloads/repo/Website-for-non-reader`)
2. Start the server:
   ```bash
   node simple_server.js
   ```
3. You should see: `Server running at http://localhost:8080/`
4. Open your browser and navigate to: `http://localhost:8080/login_signup/index.html`
5. Test the account creation functionality

## Alternative: VS Code Live Server Extension

If you prefer not to install Node.js, you can use the VS Code Live Server extension:

1. In VS Code, go to Extensions (Ctrl+Shift+X)
2. Search for "Live Server" by Ritwick Dey
3. Install the extension
4. Right-click on `login_signup/index.html` and select "Open with Live Server"
5. The page will open in your browser at `http://127.0.0.1:5500/login_signup/index.html`

Note: Live Server uses a different port (typically 5500), but it will still work for testing purposes.