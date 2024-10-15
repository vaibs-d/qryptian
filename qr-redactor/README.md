# Qryptian Data Redaction API

This project implements a FastAPI-based web service for identifying and redacting sensitive data in text. It uses a pre-trained NER (Named Entity Recognition) model to detect sensitive information such as names, organizations, and locations.

## Features

- Identify sensitive data in text using NER
- Redact sensitive information
- Store scan results in a SQLite database
- Provide statistics on scans and sensitive data identified

## Requirements

- Python 3.9+
- FastAPI
- Uvicorn
- Pydantic
- Transformers
- PyTorch
- NumPy
- SQLAlchemy

## Installation

1. Clone the repository:
   ```
   cd qr-redactor
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Start the server:
   ```
   uvicorn app.main:app --reload
   ```

2. The API will be available at `http://localhost:8000`

3. Use the `/redact` endpoint to redact sensitive data:
   ```
   curl -X POST "http://localhost:8000/redact" -H "Content-Type: application/json" -d '{"text":"John Doe works at Acme Corp in New York."}'
   ```

4. Use the `/scan_results` endpoint to retrieve past scan results:
   ```
   curl "http://localhost:8000/scan_results"
   ```

5. Use the `/statistics` endpoint to get overall statistics:
   ```
   curl "http://localhost:8000/statistics"
   ```

## Docker

To run the application using Docker:

1. Build the Docker image:
   ```
   docker build -t sensitive-data-redaction-api .
   ```

2. Run the container:
   ```
   docker run -p 8000:8000 sensitive-data-redaction-api
   ```

## License

This project is open-source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
