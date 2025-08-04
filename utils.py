"""
Optimized utility functions for memory efficiency
"""
import os
import requests
import fitz  # PyMuPDF
from typing import List, Tuple
import tempfile
from urllib.parse import urlparse
import re
import logging
import gc

logger = logging.getLogger(__name__)

class PDFProcessor:
    def __init__(self):
        self.max_file_size = 20 * 1024 * 1024  # 20MB limit for Render
        self.timeout = 25  # Reduced timeout
    
    async def extract_text_from_url(self, pdf_url: str) -> Tuple[str, str]:
        """Extract text from PDF URL with memory optimization"""
        try:
            # Validate URL
            parsed_url = urlparse(pdf_url)
            if not parsed_url.scheme or not parsed_url.netloc:
                raise ValueError("Invalid PDF URL")
            
            # Download with memory-efficient streaming
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(
                pdf_url, 
                headers=headers, 
                timeout=self.timeout,
                stream=True
            )
            response.raise_for_status()
            
            # Check content length
            content_length = response.headers.get('content-length')
            if content_length and int(content_length) > self.max_file_size:
                raise ValueError(f"PDF too large: {content_length} bytes")
            
            # Download in chunks to manage memory
            content = b""
            for chunk in response.iter_content(chunk_size=8192):
                content += chunk
                if len(content) > self.max_file_size:
                    raise ValueError("PDF file too large")
            
            # Process PDF
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(content)
                temp_path = temp_file.name
            
            try:
                text_content, pdf_title = self._extract_text_from_file(temp_path)
                return text_content, pdf_title
            finally:
                # Cleanup
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                del content
                gc.collect()
                
        except requests.RequestException as e:
            raise Exception(f"Error downloading PDF: {str(e)}")
        except Exception as e:
            raise Exception(f"Error processing PDF: {str(e)}")
    
    def _extract_text_from_file(self, file_path: str) -> Tuple[str, str]:
        """Extract text from PDF file"""
        try:
            doc = fitz.open(file_path)
            text_content = ""
            pdf_title = "Unknown Document"
            
            # Get title from metadata
            metadata = doc.metadata
            if metadata and metadata.get('title'):
                pdf_title = metadata['title'][:100]  # Limit title length
            
            # Extract text with page limit for memory
            max_pages = 50  # Limit pages to prevent memory issues
            page_count = min(len(doc), max_pages)
            
            for page_num in range(page_count):
                page = doc[page_num]
                text = page.get_text()
                
                if text.strip():
                    text_content += f"\n--- Page {page_num + 1} ---\n{text}"
                
                # Memory management
                if page_num % 10 == 0:
                    gc.collect()
            
            doc.close()
            
            if not text_content.strip():
                raise ValueError("No text content found in PDF")
            
            # Clean and limit text length
            text_content = self._clean_text(text_content)
            if len(text_content) > 100000:  # Limit to ~100KB
                text_content = text_content[:100000] + "\n[Content truncated for memory efficiency]"
            
            return text_content, pdf_title
            
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def _clean_text(self, text: str) -> str:
        """Clean extracted text"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Fix common PDF issues
        text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
        text = re.sub(r'(\.)([A-Z])', r'\1 \2', text)
        
        return text.strip()

class TextChunker:
    def __init__(self, chunk_size: int = 600, overlap: int = 100):
        """Initialize with memory-efficient settings"""
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def split_text_optimized(self, text: str) -> List[str]:
        """Split text into optimized chunks"""
        try:
            if not text or len(text.strip()) < 50:
                return []
            
            # Preprocess text
            text = self._preprocess_text(text)
            
            chunks = []
            start = 0
            max_chunks = 40  # Limit chunks for memory
            
            while start < len(text) and len(chunks) < max_chunks:
                end = start + self.chunk_size
                
                # Find good boundary
                if end < len(text):
                    # Look for sentence boundary
                    for i in range(end, max(start + self.chunk_size // 2, end - 100), -1):
                        if text[i] in '.!?':
                            end = i + 1
                            break
                
                chunk = text[start:end].strip()
                
                if chunk and len(chunk) > 50:
                    chunks.append(chunk)
                
                start = end - self.overlap if end > self.overlap else end
                
                if start >= len(text):
                    break
            
            logger.info(f"Created {len(chunks)} chunks")
            return chunks
            
        except Exception as e:
            logger.error(f"Error splitting text: {e}")
            return []
    
    def _preprocess_text(self, text: str) -> str:
        """Preprocess text for better chunking"""
        # Basic cleanup
        text = re.sub(r' +', ' ', text)
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        
        return text.strip()