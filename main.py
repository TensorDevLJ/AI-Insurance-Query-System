"""
FastAPI PDF QA System - Optimized for Render deployment
Memory efficient with proper error handling
"""
import os
import time
import gc
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional
import uvicorn
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="PDF QA System",
    description="Optimized RAG system for document Q&A",
    version="1.0.0"
)

# Security
security = HTTPBearer()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global components - initialized lazily
vector_store = None
llm_client = None
pdf_processor = None
text_chunker = None

def get_components():
    """Lazy initialization of components to save memory"""
    global vector_store, llm_client, pdf_processor, text_chunker
    
    if vector_store is None:
        from vector import VectorStore
        from llm import LLMClient
        from utils import PDFProcessor, TextChunker
        
        vector_store = VectorStore()
        llm_client = LLMClient()
        pdf_processor = PDFProcessor()
        text_chunker = TextChunker(chunk_size=600, overlap=100)  # Smaller chunks for memory
    
    return vector_store, llm_client, pdf_processor, text_chunker

class PDFQARequest(BaseModel):
    pdf_url: HttpUrl = Field(..., description="PDF document URL")
    questions: List[str] = Field(..., max_items=5, description="Maximum 5 questions")

class PDFQAResponse(BaseModel):
    answers: List[str]
    metadata: dict = Field(default_factory=dict)
    explainability: dict = Field(default_factory=dict)

def verify_bearer_token(token: str):
    """Verify bearer token"""
    expected_token = os.getenv("BEARER_TOKEN")
    if not expected_token or token != expected_token:
        raise HTTPException(status_code=401, detail="Invalid bearer token")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "PDF QA System API",
        "status": "healthy",
        "endpoints": {
            "main": "/hackrx/run",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Simple health check"""
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/hackrx/run", response_model=PDFQAResponse)
async def process_pdf_qa(
    request: PDFQARequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Main endpoint for PDF QA processing"""
    start_time = time.time()
    
    # Verify authentication
    verify_bearer_token(credentials.credentials)
    
    # Limit questions to prevent memory issues
    if len(request.questions) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 questions allowed")
    
    try:
        # Get components
        vs, llm, pdf_proc, chunker = get_components()
        
        logger.info(f"Processing PDF: {request.pdf_url}")
        
        # Step 1: Extract text from PDF
        pdf_text, pdf_title = await pdf_proc.extract_text_from_url(str(request.pdf_url))
        
        if not pdf_text or len(pdf_text.strip()) < 100:
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from PDF")
        
        # Step 2: Split text into chunks (smaller chunks for memory efficiency)
        chunks = chunker.split_text_optimized(pdf_text)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="No text chunks generated from PDF")
        
        # Limit chunks to prevent memory issues
        if len(chunks) > 50:
            chunks = chunks[:50]
            logger.warning(f"Limited chunks to 50 for memory efficiency")
        
        # Step 3: Store chunks in vector database
        doc_id = await vs.store_document_chunks_optimized(chunks, pdf_title)
        
        # Step 4: Process questions
        answers = []
        explainability_data = {}
        
        for i, question in enumerate(request.questions):
            try:
                # Query relevant chunks (limit to 3 for memory)
                relevant_chunks, chunk_scores = await vs.query_similar_chunks_with_scores(
                    question, top_k=3
                )
                
                if not relevant_chunks:
                    answer = "I cannot find sufficient information to answer this question."
                    reasoning = "No relevant content found in the document."
                else:
                    # Generate answer
                    answer, reasoning = await llm.generate_answer_optimized(
                        question, relevant_chunks
                    )
                    
                    # Clean answer
                    if answer and answer.strip().lower().startswith("answer:"):
                        answer = answer.split("ANSWER:", 1)[-1].strip()
                    
                    if not answer or len(answer.strip()) < 5:
                        answer = "I cannot find sufficient information to answer this question."
                    
                    # Limit answer length
                    if len(answer) > 500:
                        answer = answer[:500] + "..."
                
                answers.append(answer)
                
                explainability_data[question] = {
                    "relevant_chunks": len(relevant_chunks),
                    "chunk_scores": chunk_scores[:3] if chunk_scores else [],
                    "reasoning": reasoning[:200] if reasoning else "No reasoning provided",
                    "confidence": "high" if chunk_scores and max(chunk_scores) > 0.8 else "medium"
                }
                
                # Force garbage collection between questions
                if i % 2 == 0:
                    gc.collect()
                
            except Exception as e:
                logger.error(f"Error processing question '{question}': {str(e)}")
                answers.append("I cannot find sufficient information to answer this question.")
                explainability_data[question] = {
                    "error": str(e)[:100],
                    "confidence": "error"
                }
        
        processing_time = time.time() - start_time
        
        # Clean up memory
        del chunks, pdf_text
        gc.collect()
        
        return PDFQAResponse(
            answers=answers,
            metadata={
                "pdf_title": pdf_title,
                "chunks_processed": len(chunks) if 'chunks' in locals() else 0,
                "processing_time_seconds": round(processing_time, 2),
                "questions_processed": len(request.questions)
            },
            explainability=explainability_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )