import json
import os
import re
import fitz  # ← Add this line with no indentation
from typing import List, Dict, Any
import logging



logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        """Initialize document processor"""
        self.supported_formats = ['.pdf', '.docx', '.txt', '.json']
        
    def process_document(self, file_path: str) -> Dict[str, Any]:
        """Process a document and extract structured information"""
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Document not found: {file_path}")
            
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension == '.json':
                return self._process_json(file_path)
            elif file_extension == '.txt':
                return self._process_text(file_path)
            elif file_extension == '.pdf':
                return self._process_pdf(file_path)
            elif file_extension == '.docx':
                return self._process_docx(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
                
        except Exception as e:
            logger.error(f"Error processing document {file_path}: {e}")
            raise
    
    def _process_json(self, file_path: str) -> Dict[str, Any]:
        """Process JSON policy document"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Validate required fields
            required_fields = ['name', 'provider', 'clauses']
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Process clauses
            processed_clauses = []
            for i, clause in enumerate(data.get('clauses', [])):
                processed_clause = {
                    'clause_id': clause.get('clause_id', f"CLAUSE-{i+1}"),
                    'text': clause.get('text', '').strip(),
                    'category': clause.get('category', 'general'),
                    'keywords': self._extract_keywords(clause.get('text', ''))
                }
                processed_clauses.append(processed_clause)
            
            return {
                'name': data['name'],
                'provider': data['provider'],
                'uin': data.get('uin', ''),
                'clauses': processed_clauses,
                'metadata': {
                    'source_file': file_path,
                    'total_clauses': len(processed_clauses),
                    'processed_at': self._get_timestamp()
                }
            }
            
        except Exception as e:
            logger.error(f"Error processing JSON file: {e}")
            raise
    
    def _process_text(self, file_path: str) -> Dict[str, Any]:
        """Process plain text policy document"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract basic information
            lines = content.split('\n')
            name = self._extract_policy_name(content)
            provider = self._extract_provider(content)
            
            # Split content into clauses (simple approach)
            clauses = self._split_into_clauses(content)
            
            processed_clauses = []
            for i, clause_text in enumerate(clauses):
                if clause_text.strip():
                    processed_clause = {
                        'clause_id': f"TXT-{i+1:03d}",
                        'text': clause_text.strip(),
                        'category': self._categorize_clause(clause_text),
                        'keywords': self._extract_keywords(clause_text)
                    }
                    processed_clauses.append(processed_clause)
            
            return {
                'name': name or os.path.basename(file_path),
                'provider': provider or 'Unknown',
                'uin': '',
                'clauses': processed_clauses,
                'metadata': {
                    'source_file': file_path,
                    'total_clauses': len(processed_clauses),
                    'processed_at': self._get_timestamp()
                }
            }
            
        except Exception as e:
            logger.error(f"Error processing text file: {e}")
            raise
    
    # Add this at the top if not already

    def _process_pdf(self, file_path: str) -> Dict[str, Any]:
        """Process PDF policy document"""
        import fitz  # PyMuPDF
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()

            name = self._extract_policy_name(text)
            provider = self._extract_provider(text)
            clauses = self._split_into_clauses(text)

            processed_clauses = []
            for i, clause_text in enumerate(clauses):
                if clause_text.strip():
                    processed_clause = {
                        'clause_id': f"PDF-{i+1:03d}",
                        'text': clause_text.strip(),
                        'category': self._categorize_clause(clause_text),
                        'keywords': self._extract_keywords(clause_text)
                    }
                    processed_clauses.append(processed_clause)

            return {
                'name': name or os.path.basename(file_path),
                'provider': provider or 'Unknown',
                'uin': '',
                'clauses': processed_clauses,
                'metadata': {
                    'source_file': file_path,
                    'total_clauses': len(processed_clauses),
                    'processed_at': self._get_timestamp()
                }
            }

        except Exception as e:
            logger.error(f"Error processing PDF file: {e}")
            raise


    
    def _process_docx(self, file_path: str) -> Dict[str, Any]:
        """Process Word document"""
        try:
            # This would require python-docx library
            # For now, return a placeholder
            logger.warning("DOCX processing not implemented, returning placeholder")
            return {
                'name': os.path.basename(file_path),
                'provider': 'Unknown',
                'uin': '',
                'clauses': [],
                'metadata': {
                    'source_file': file_path,
                    'total_clauses': 0,
                    'processed_at': self._get_timestamp(),
                    'note': 'DOCX processing not implemented'
                }
            }
        except Exception as e:
            logger.error(f"Error processing DOCX file: {e}")
            raise
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from clause text"""
        # Simple keyword extraction
        keywords = []
        
        # Medical terms
        medical_terms = [
            'surgery', 'treatment', 'hospital', 'doctor', 'medical', 'illness',
            'disease', 'injury', 'accident', 'emergency', 'care', 'therapy'
        ]
        
        # Insurance terms
        insurance_terms = [
            'coverage', 'premium', 'deductible', 'claim', 'benefit', 'policy',
            'insured', 'insurer', 'exclusion', 'waiting', 'period'
        ]
        
        text_lower = text.lower()
        for term in medical_terms + insurance_terms:
            if term in text_lower:
                keywords.append(term)
        
        return list(set(keywords))  # Remove duplicates
    
    def _extract_policy_name(self, content: str) -> str:
        """Extract policy name from content"""
        # Look for common patterns
        patterns = [
            r'Policy:\s*(.+)',
            r'Policy Name:\s*(.+)',
            r'Product:\s*(.+)',
            r'Plan:\s*(.+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def _extract_provider(self, content: str) -> str:
        """Extract insurance provider from content"""
        # Look for common patterns
        patterns = [
            r'Insurer:\s*(.+)',
            r'Insurance Company:\s*(.+)',
            r'Provider:\s*(.+)',
            r'Company:\s*(.+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        return None
    
    def _split_into_clauses(self, content: str) -> List[str]:
        """Split content into individual clauses"""
        # Simple approach: split by bullet points, numbers, or double newlines
        clauses = []
        
        # Split by common clause separators
        separators = [r'\n\d+\.', r'\n[a-z]\)', r'\n-', r'\n\n']
        
        current_text = content
        for separator in separators:
            parts = re.split(separator, current_text)
            if len(parts) > 1:
                clauses.extend([part.strip() for part in parts if part.strip()])
                break
        
        if not clauses:
            # Fallback: split by paragraphs
            clauses = [p.strip() for p in content.split('\n\n') if p.strip()]
        
        return clauses
    
    def _categorize_clause(self, text: str) -> str:
        """Categorize clause based on content"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['define', 'means', 'definition']):
            return 'definitions'
        elif any(word in text_lower for word in ['cover', 'benefit', 'include']):
            return 'coverage'
        elif any(word in text_lower for word in ['exclude', 'not cover', 'limitation']):
            return 'exclusions'
        elif any(word in text_lower for word in ['eligible', 'qualify', 'requirement']):
            return 'eligibility'
        elif any(word in text_lower for word in ['claim', 'procedure', 'process']):
            return 'claims'
        else:
            return 'general'
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def batch_process(self, directory_path: str) -> List[Dict[str, Any]]:
        """Process multiple documents in a directory"""
        try:
            if not os.path.exists(directory_path):
                raise FileNotFoundError(f"Directory not found: {directory_path}")
            
            processed_documents = []
            
            for filename in os.listdir(directory_path):
                file_path = os.path.join(directory_path, filename)
                
                if os.path.isfile(file_path):
                    file_extension = os.path.splitext(filename)[1].lower()
                    
                    if file_extension in self.supported_formats:
                        try:
                            document = self.process_document(file_path)
                            processed_documents.append(document)
                            logger.info(f"Successfully processed: {filename}")
                        except Exception as e:
                            logger.error(f"Failed to process {filename}: {e}")
                            continue
            
            logger.info(f"Processed {len(processed_documents)} documents from {directory_path}")
            return processed_documents
            
        except Exception as e:
            logger.error(f"Error in batch processing: {e}")
            raise