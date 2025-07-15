import numpy as np
import faiss
import json
import os
from sentence_transformers import SentenceTransformer
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self):
        """Initialize the vector store with sentence transformer model"""
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.index = None
            self.clauses = []
            self.dimension = 384  # Dimension for all-MiniLM-L6-v2
            logger.info("Vector store initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize vector store: {e}")
            raise
        
    def load_embeddings(self):
        """Load pre-computed embeddings or create new ones"""
        try:
            if os.path.exists('models/embeddings.index') and os.path.exists('models/clauses.json'):
                self.index = faiss.read_index('models/embeddings.index')
                with open('models/clauses.json', 'r') as f:
                    self.clauses = json.load(f)
                logger.info(f"Loaded {len(self.clauses)} clauses from existing embeddings")
            else:
                logger.info("Creating new embeddings...")
                self.create_embeddings()
        except Exception as e:
            logger.error(f"Error loading embeddings: {e}")
            self.create_embeddings()
    
    def create_embeddings(self):
        """Create embeddings for all policy clauses"""
        try:
            # Load policy documents
            policy_data = self.load_policy_documents()
            
            # Extract all clauses
            all_clauses = []
            for policy in policy_data:
                for clause in policy.get('clauses', []):
                    all_clauses.append({
                        'clause_id': clause.get('clause_id'),
                        'text': clause.get('text'),
                        'policy_name': policy.get('name'),
                        'category': clause.get('category'),
                        'provider': policy.get('provider')
                    })
            
            if not all_clauses:
                logger.warning("No clauses found to create embeddings")
                return
            
            # Generate embeddings
            texts = [clause['text'] for clause in all_clauses]
            logger.info(f"Generating embeddings for {len(texts)} clauses...")
            embeddings = self.model.encode(texts, show_progress_bar=True)
            
            # Create FAISS index
            self.index = faiss.IndexFlatIP(self.dimension)  # Inner product for cosine similarity
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings.astype('float32'))
            self.index.add(embeddings.astype('float32'))
            
            # Save embeddings and clauses
            os.makedirs('models', exist_ok=True)
            faiss.write_index(self.index, 'models/embeddings.index')
            with open('models/clauses.json', 'w') as f:
                json.dump(all_clauses, f, indent=2)
            
            self.clauses = all_clauses
            logger.info(f"Created and saved embeddings for {len(all_clauses)} clauses")
            
        except Exception as e:
            logger.error(f"Error creating embeddings: {e}")
            raise
    
    def load_policy_documents(self) -> List[Dict]:
        """Load policy documents from data directory or create sample data"""
        try:
            # Try to load from files first
            policies = []
            data_dir = 'data/policies'
            
            if os.path.exists(data_dir):
                for filename in os.listdir(data_dir):
                    if filename.endswith('.json'):
                        with open(os.path.join(data_dir, filename), 'r') as f:
                            policy = json.load(f)
                            policies.append(policy)
            
            # If no files found, create sample data
            if not policies:
                policies = self.create_sample_policy_data()
            
            logger.info(f"Loaded {len(policies)} policy documents")
            return policies
            
        except Exception as e:
            logger.error(f"Error loading policy documents: {e}")
            return self.create_sample_policy_data()
    
    def create_sample_policy_data(self) -> List[Dict]:
        """Create sample policy data based on the provided summaries"""
        
        # Bajaj Allianz Policy
        bajaj_policy = {
            "name": "Bajaj Allianz Global Health Care",
            "provider": "Bajaj Allianz General Insurance Co. Ltd",
            "uin": "BAJHLIP23020V012223",
            "clauses": [
                {
                    "clause_id": "BAJ-001",
                    "text": "Accident means sudden, external, violent, and visible event causing bodily injury",
                    "category": "definitions"
                },
                {
                    "clause_id": "BAJ-002",
                    "text": "Any one illness includes relapse within 45 days of previous treatment",
                    "category": "definitions"
                },
                {
                    "clause_id": "BAJ-003",
                    "text": "Day care procedures covered where treatment is less than 24 hours due to technological advancement",
                    "category": "coverage"
                },
                {
                    "clause_id": "BAJ-004",
                    "text": "Pre-hospitalization expenses covered up to 60 days, post-hospitalization up to 90 days",
                    "category": "coverage"
                },
                {
                    "clause_id": "BAJ-005",
                    "text": "Hospital must have minimum 10-15 beds, qualified nursing staff, and operation theater",
                    "category": "eligibility"
                },
                {
                    "clause_id": "BAJ-006",
                    "text": "Cashless facility available where insurer directly pays hospital bills",
                    "category": "benefits"
                },
                {
                    "clause_id": "BAJ-007",
                    "text": "Co-payment is cost-sharing between insured and insurer, does not reduce sum insured",
                    "category": "terms"
                },
                {
                    "clause_id": "BAJ-008",
                    "text": "Congenital anomalies include both internal and external birth defects",
                    "category": "definitions"
                },
                {
                    "clause_id": "BAJ-009",
                    "text": "OPD treatments not covered as day care procedures",
                    "category": "exclusions"
                },
                {
                    "clause_id": "BAJ-010",
                    "text": "Deductible is amount insured must bear before policy coverage applies",
                    "category": "terms"
                }
            ]
        }
        
        # HDFC Ergo Policy
        hdfc_policy = {
            "name": "HDFC Ergo Easy Health",
            "provider": "HDFC ERGO General Insurance Co. Ltd",
            "uin": "HDFHLIP23024V072223",
            "clauses": [
                {
                    "clause_id": "HDFC-001",
                    "text": "Critical illness coverage includes cancer, CABG, heart attack, stroke, kidney failure with no waiting period",
                    "category": "coverage"
                },
                {
                    "clause_id": "HDFC-002",
                    "text": "Cumulative bonus increases sum insured without premium increase for claim-free years",
                    "category": "benefits"
                },
                {
                    "clause_id": "HDFC-003",
                    "text": "Day care treatment means less than 24 hours hospitalization due to technological advancement",
                    "category": "definitions"
                },
                {
                    "clause_id": "HDFC-004",
                    "text": "Domiciliary care covered when hospital treatment not available or patient unfit to move",
                    "category": "coverage"
                },
                {
                    "clause_id": "HDFC-005",
                    "text": "Hospitalization means admission for more than 24 hours unless day care procedure",
                    "category": "definitions"
                },
                {
                    "clause_id": "HDFC-006",
                    "text": "Medical expenses must be reasonable, medically necessary, and verified by medical practitioner",
                    "category": "eligibility"
                },
                {
                    "clause_id": "HDFC-007",
                    "text": "AYUSH hospitals must meet government standards same as allopathic hospitals",
                    "category": "eligibility"
                },
                {
                    "clause_id": "HDFC-008",
                    "text": "Co-payment means insured bears part of medical expenses as per policy terms",
                    "category": "terms"
                },
                {
                    "clause_id": "HDFC-009",
                    "text": "Deductible amount applies before claim payment is processed",
                    "category": "terms"
                },
                {
                    "clause_id": "HDFC-010",
                    "text": "Accident means sudden, external, visible, violent event causing bodily injury",
                    "category": "definitions"
                }
            ]
        }
        
        return [bajaj_policy, hdfc_policy]
    
    def search_similar_clauses(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for similar clauses using semantic similarity"""
        try:
            if not self.index or not self.clauses:
                logger.warning("No embeddings loaded, returning empty results")
                return []
            
            # Generate query embedding
            query_embedding = self.model.encode([query])
            
            # Normalize for cosine similarity
            faiss.normalize_L2(query_embedding.astype('float32'))
            
            # Search for similar clauses
            similarities, indices = self.index.search(query_embedding.astype('float32'), min(top_k, len(self.clauses)))
            
            results = []
            for i, (similarity, idx) in enumerate(zip(similarities[0], indices[0])):
                if idx < len(self.clauses) and similarity > 0.3:  # Minimum similarity threshold
                    clause = self.clauses[idx].copy()
                    clause['similarity'] = float(similarity)
                    results.append(clause)
            
            logger.info(f"Found {len(results)} similar clauses for query: {query}")
            return results
            
        except Exception as e:
            logger.error(f"Error searching similar clauses: {e}")
            return []