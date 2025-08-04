"""
Optimized vector operations with memory efficiency for Render
"""
import os
import hashlib
import gc
from typing import List, Dict, Any, Tuple, Optional
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logger = logging.getLogger(__name__)

class VectorStore:
    def __init__(self):
        """Initialize with memory-optimized settings"""
        self.model_name = "all-MiniLM-L6-v2"  # Smaller, faster model
        self.embedding_dimension = 384  # Smaller dimension
        
        # Initialize embedding model with memory optimization
        try:
            self.embedding_model = SentenceTransformer(self.model_name)
            # Clear cache to save memory
            self.embedding_model.max_seq_length = 256  # Limit sequence length
        except Exception as e:
            logger.error(f"Error loading embedding model: {e}")
            raise
        
        # Pinecone setup
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "pdf-qa-index")
        api_key = os.getenv("PINECONE_API_KEY")
        
        if not api_key:
            raise ValueError("PINECONE_API_KEY not found in environment variables")
        
        self.pinecone = Pinecone(api_key=api_key)
        
        # Create index if it doesn't exist
        try:
            existing_indexes = [idx.name for idx in self.pinecone.list_indexes()]
            if self.index_name not in existing_indexes:
                self.pinecone.create_index(
                    name=self.index_name,
                    dimension=self.embedding_dimension,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud=os.getenv("PINECONE_CLOUD", "aws"),
                        region=os.getenv("PINECONE_REGION", "us-east-1")
                    )
                )
                logger.info(f"Created new Pinecone index: {self.index_name}")
        except Exception as e:
            logger.warning(f"Could not create/check index: {e}")
        
        self.index = self.pinecone.Index(self.index_name)
        self._embedding_cache = {}  # Small cache for frequently used embeddings
    
    def _generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings with memory optimization"""
        try:
            if not texts:
                return []
            
            # Process in smaller batches to save memory
            batch_size = 8
            all_embeddings = []
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                
                # Generate embeddings for batch
                embeddings = self.embedding_model.encode(
                    batch, 
                    convert_to_tensor=False,
                    show_progress_bar=False,
                    batch_size=batch_size
                )
                
                if isinstance(embeddings, np.ndarray):
                    embeddings = embeddings.tolist()
                
                all_embeddings.extend(embeddings)
                
                # Force garbage collection between batches
                if i % (batch_size * 2) == 0:
                    gc.collect()
            
            return all_embeddings
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise Exception(f"Error generating embeddings: {str(e)}")
    
    def _create_chunk_id(self, doc_id: str, chunk_index: int) -> str:
        """Create unique chunk ID"""
        return f"{doc_id}_chunk_{chunk_index}"
    
    async def store_document_chunks_optimized(self, chunks: List[str], doc_title: str) -> str:
        """Store document chunks with memory optimization"""
        try:
            # Create document ID
            doc_id = hashlib.md5(doc_title.encode()).hexdigest()[:12]
            
            logger.info(f"Storing {len(chunks)} chunks for: {doc_title}")
            
            # Generate embeddings in batches
            embeddings = self._generate_embeddings(chunks)
            
            # Prepare vectors for upsert
            vectors = []
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                chunk_id = self._create_chunk_id(doc_id, i)
                
                vectors.append({
                    "id": chunk_id,
                    "values": embedding,
                    "metadata": {
                        "doc_id": doc_id,
                        "doc_title": doc_title[:100],  # Limit title length
                        "chunk_index": i,
                        "text": chunk[:1000],  # Limit text length in metadata
                        "chunk_length": len(chunk)
                    }
                })
            
            # Upsert in smaller batches
            batch_size = 25
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i + batch_size]
                try:
                    self.index.upsert(vectors=batch)
                    logger.info(f"Upserted batch {i//batch_size + 1}/{(len(vectors)-1)//batch_size + 1}")
                except Exception as e:
                    logger.error(f"Error upserting batch: {e}")
                    raise
                
                # Small delay and cleanup between batches
                gc.collect()
            
            logger.info(f"Successfully stored document: {doc_title}")
            return doc_id
            
        except Exception as e:
            logger.error(f"Error storing document chunks: {e}")
            raise Exception(f"Error storing document chunks: {str(e)}")
    
    async def query_similar_chunks_with_scores(self, query: str, top_k: int = 3) -> Tuple[List[str], List[float]]:
        """Query similar chunks with scores"""
        try:
            # Generate query embedding
            query_embedding = self._generate_embeddings([query])[0]
            
            # Query Pinecone
            response = self.index.query(
                vector=query_embedding,
                top_k=min(top_k, 5),  # Limit results
                include_metadata=True,
                include_values=False
            )
            
            relevant_chunks = []
            similarity_scores = []
            
            for match in response.matches:
                if 'text' in match.metadata:
                    relevant_chunks.append(match.metadata['text'])
                    similarity_scores.append(float(match.score))
            
            logger.info(f"Found {len(relevant_chunks)} relevant chunks")
            return relevant_chunks, similarity_scores
            
        except Exception as e:
            logger.error(f"Error querying chunks: {e}")
            return [], []
    
    async def test_connection(self) -> bool:
        """Test Pinecone connection"""
        try:
            self.index.describe_index_stats()
            return True
        except Exception as e:
            logger.error(f"Pinecone connection test failed: {e}")
            return False