# Qryptian

Qryptian is a comprehensive project that ensures that you do not leak any sensitive data when interacting with Large Language Models(LLMs) on chat interfaces. It combines a Chrome extension for capturing user messages and a backend service for redacting sensitive information. Both of these can be deployed locally and used for redaction straightaway.

![Demo](<demo.gif>)

## Project Structure

The project consists of two main components:

1. **qr-extension**: A Chrome extension for capturing and streaming user messages.
2. **qr-redactor**: A backend service for identifying and redacting sensitive data.

### qr-extension

The Chrome extension is responsible for capturing user messages from web pages and streaming them to the background script.

Key files:
- `public/content.js`: Content script that runs on web pages
- `public/manifest.json`: Extension manifest file
- `src/`: Source TypeScript files

### qr-redactor

The backend service processes the captured messages, identifies sensitive information, and performs redaction.

Key files:
- `app/main.py`: FastAPI application entry point
- `app/model.py`: Sensitive data identification model
- `app/redactor.py`: Text redaction logic
- `Dockerfile`: Container configuration for the backend service

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/vaibs-d/qryptian.git
   ```

2. Set up the Chrome extension:
   - Navigate to `chrome://extensions/` in Chrome
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `qr-extension/public` directory

3. Set up the backend service:
   - Navigate to the `qr-redactor` directory
   - Build and run the Docker container:
     ```
     docker build -t qr-redactor .
     docker run -p 8000:8000 qr-redactor
     ```

## Usage

1. Use the Chrome extension to capture and stream user messages from web pages.
2. The backend service will process the streamed messages, identify sensitive information, and perform redaction.

## Development

- For the Chrome extension, modify the TypeScript files in `qr-extension/src/`, then compile them to JavaScript.
- For the backend service, modify the Python files in `qr-redactor/app/`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the MIT License. See the LICENSE file in each submodule for details.
