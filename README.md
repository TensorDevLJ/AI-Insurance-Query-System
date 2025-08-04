# PDF QA System Backend

Optimized FastAPI backend for PDF question-answering using RAG (Retrieval Augmented Generation).

## Features

- Memory-optimized for Render deployment
- PDF text extraction and processing
- Vector embeddings with Pinecone
- LLM integration with Groq
- Bearer token authentication
- CORS enabled for frontend integration

## Setup

1. **Environment Variables**
   ```bash
   cp .env.example .env
   # Fill in your API keys
   ```

2. **Required API Keys**
   - `GROQ_API_KEY`: Get from [Groq Console](https://console.groq.com/)
   - `PINECONE_API_KEY`: Get from [Pinecone Console](https://app.pinecone.io/)
   - `BEARER_TOKEN`: Set your own secure token

3. **Local Development**
   ```bash
   pip install -r requirements.txt
   python main.py
   ```

## API Endpoints

### POST /hackrx/run
Process PDF and answer questions.

**Request:**
```json
{
  "pdf_url": "https://example.com/document.pdf",
  "questions": [
    "What is the main topic?",
    "Who are the authors?"
  ]
}
```

**Response:**
```json
{
  "answers": [
    "The main topic is...",
    "The authors are..."
  ],
  "metadata": {
    "pdf_title": "Document Title",
    "chunks_processed": 25,
    "processing_time_seconds": 12.5,
    "questions_processed": 2
  },
  "explainability": {
    "What is the main topic?": {
      "relevant_chunks": 3,
      "chunk_scores": [0.85, 0.72, 0.68],
      "reasoning": "Based on the introduction and abstract...",
      "confidence": "high"
    }
  }
}
```

### GET /health
Health check endpoint.

### GET /
API information and available endpoints.

## Memory Optimizations

- Smaller embedding model (all-MiniLM-L6-v2)
- Limited chunk sizes and counts
- Batch processing with garbage collection
- Streaming PDF downloads
- Request size limits

## Deployment on Render

1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy using the included `render.yaml` configuration

## Error Handling

- Invalid PDF URLs
- Large file size limits (20MB)
- API rate limiting
- Memory management
- Authentication errors

## Security

- Bearer token authentication
- Input validation
- File size limits
- Timeout protection