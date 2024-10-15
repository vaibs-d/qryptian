# Qryptian Chrome Extension

This Chrome extension is a submodule of the Qryptian project. It captures and streams user messages from web pages to the background script.

## Features

- Runs a content script on web pages to capture user messages
- Streams captured messages to the background script
- Provides a popup interface to toggle streaming on/off

## Files

- `background.ts`: Background script that receives messages from the content script
- `content.ts`: Content script that runs on web pages to capture user messages
- `popup.ts`: Script for the extension's popup interface

## Installation

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable "Developer mode" in the top right corner

3. Click "Load unpacked" and select the directory containing this extension

## Usage

1. Click on the extension icon in Chrome to open the popup
2. Use the toggle button to start or stop streaming
3. User messages will be captured and sent to the background script when streaming is active

## Development

To make changes to the extension:

1. Modify the TypeScript files as needed
2. Compile the TypeScript files to JavaScript
3. Reload the extension in Chrome to see your changes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the MIT License.
