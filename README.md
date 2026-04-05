# <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/b2c63202-0f20-49df-9559-15b757856640" /> GitHub Repo Creation Date Extension

A browser extension that displays the creation date of any GitHub repository.

## Links

- Chrome: https://chromewebstore.google.com/detail/github-repo-creation-date/pdhoihimginoiikkbbmbdpfclbbmpiae
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/github-repo-creation-date/

## Local Installation

### Chrome / Edge / Brave
1. Open your browser and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the folder where you saved this extension.

### Firefox
1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file in the extension folder.

## How it Works
The extension injects a small content script that:
1. Locates the JSON metadata embedded by GitHub in a `<script>` tag.
2. Recursively searches for the `createdAt` property within the repository object.
3. Formats the date and injects it into the repository about area.
