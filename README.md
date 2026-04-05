# GitHub Repo Creation Date Extension

A browser extension for browsers that displays the creation date of any GitHub repository.

## Installation

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
3. Formats the date and injects it into the repository header
