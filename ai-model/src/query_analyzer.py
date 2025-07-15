import re
import spacy
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

class QueryAnalyzer:
    def __init__(self):
        """Initialize the query analyzer with spaCy model"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.warning("spaCy model not found, downloading...")
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")
        
        # Medical procedure patterns
        self.medical_patterns = {
            'knee_surgery': ['knee surgery', 'knee operation', 'knee replacement'],
            'heart_surgery': ['heart surgery', 'cardiac surgery', 'cabg', 'bypass'],
            'cancer': ['cancer', 'tumor', 'oncology', 'chemotherapy'],
            'eye_surgery': ['eye surgery', 'cataract', 'lasik'],
            'day_care': ['day care', 'daycare', 'outpatient']
        }
        
        # Indian cities for location extraction
        self.indian_cities = [
            'mumbai', 'delhi', 'bangalore', 'pune', 'chennai', 'kolkata', 
            'hyderabad', 'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur'
        ]
    
    def extract_entities(self, query: str) -> Dict:
        """Extract structured entities from natural language query"""
        try:
            doc = self.nlp(query.lower())
            
            entities = {
                "age": None,
                "gender": None,
                "procedure": None,
                "location": None,
                "policy_duration": None,
                "amount": None
            }
            
            # Extract age and gender
            age_gender_match = re.search(r'(\d+)([MF])', query, re.IGNORECASE)
            if age_gender_match:
                entities["age"] = int(age_gender_match.group(1))
                entities["gender"] = "Male" if age_gender_match.group(2).upper() == 'M' else "Female"
            
            # Extract policy duration
            duration_patterns = [
                r'(\d+)[\s]*[-]?[\s]*(month|year)s?',
                r'(\d+)[\s]*[-]?[\s]*(m|y)(?:\s|$)',
            ]
            
            for pattern in duration_patterns:
                duration_match = re.search(pattern, query, re.IGNORECASE)
                if duration_match:
                    value = int(duration_match.group(1))
                    unit = duration_match.group(2).lower()
                    
                    # Normalize unit
                    if unit in ['m', 'month']:
                        unit = 'month'
                    elif unit in ['y', 'year']:
                        unit = 'year'
                    
                    entities["policy_duration"] = {
                        "value": value,
                        "unit": unit
                    }
                    break
            
            # Extract medical procedure
            query_lower = query.lower()
            for procedure_type, patterns in self.medical_patterns.items():
                for pattern in patterns:
                    if pattern in query_lower:
                        entities["procedure"] = pattern
                        break
                if entities["procedure"]:
                    break
            
            # Extract location (Indian cities)
            for city in self.indian_cities:
                if city in query_lower:
                    entities["location"] = city.title()
                    break
            
            # Extract amount if mentioned
            amount_patterns = [
                r'₹\s*(\d+(?:,\d+)*)',
                r'rs\.?\s*(\d+(?:,\d+)*)',
                r'rupees?\s*(\d+(?:,\d+)*)',
                r'(\d+(?:,\d+)*)\s*rupees?'
            ]
            
            for pattern in amount_patterns:
                amount_match = re.search(pattern, query, re.IGNORECASE)
                if amount_match:
                    amount_str = amount_match.group(1).replace(',', '')
                    entities["amount"] = int(amount_str)
                    break
            
            logger.info(f"Extracted entities: {entities}")
            return entities
            
        except Exception as e:
            logger.error(f"Error extracting entities: {e}")
            return {
                "age": None,
                "gender": None,
                "procedure": None,
                "location": None,
                "policy_duration": None,
                "amount": None
            }