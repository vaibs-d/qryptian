def redact_text(text, sensitive_data):
    redacted_text = list(text)
    for item in sorted(sensitive_data, key=lambda x: x['start'], reverse=True):
        start, end = item['start'], item['end']
        redacted_text[start:end] = '*' * (end - start)
    return ''.join(redacted_text)