from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import numpy as np

class SensitiveDataIdentifier:
    def __init__(self):
        model_name = "dslim/bert-base-NER"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForTokenClassification.from_pretrained(model_name)
        self.ner_pipeline = pipeline("ner", model=self.model, tokenizer=self.tokenizer, aggregation_strategy="simple")

    def identify_sensitive_data(self, text):
        entities = self.ner_pipeline(text)
        sensitive_data = []
        for entity in entities:
            if entity['entity_group'] in ['PER', 'ORG', 'LOC']:
                sensitive_type = {
                    'PER': 'PERSON',
                    'ORG': 'ORGANIZATION',
                    'LOC': 'LOCATION'
                }.get(entity['entity_group'], entity['entity_group'])
                
                sensitive_data.append({
                    "type": sensitive_type,
                    "text": entity['word'],
                    "start": entity['start'],
                    "end": entity['end'],
                    "score": float(entity['score'])  # Convert numpy.float32 to Python float
                })
        return sensitive_data