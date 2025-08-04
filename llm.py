"""
Optimized LLM client with memory efficiency
"""
import os
from typing import List, Tuple
import requests
import logging
import json

logger = logging.getLogger(__name__)

class LLMClient:
    def __init__(self):
        """Initialize Groq client with optimized settings"""
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama3-8b-8192"
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def _create_optimized_prompt(self, question: str, context_chunks: List[str]) -> str:
        """Create memory-efficient prompt"""
        # Limit context length to prevent memory issues
        max_context_length = 2000
        context_parts = []
        current_length = 0
        
        for i, chunk in enumerate(context_chunks[:3]):  # Max 3 chunks
            if current_length + len(chunk) > max_context_length:
                break
            context_parts.append(f"Context {i+1}: {chunk}")
            current_length += len(chunk)
        
        context = "\n\n".join(context_parts)
        
        prompt = f"""Based on the provided context, answer the question directly and concisely.

Context:
{context}

Question: {question}

Instructions:
- Use only the provided context
- Be direct and specific
- If information is insufficient, state clearly
- Keep answer under 200 words

ANSWER: [Your answer here]
REASONING: [Brief explanation]"""
        
        return prompt
    
    async def generate_answer_optimized(self, question: str, context_chunks: List[str]) -> Tuple[str, str]:
        """Generate answer with reasoning"""
        try:
            if not context_chunks:
                return "I cannot find sufficient information to answer this question.", "No relevant context found"
            
            prompt = self._create_optimized_prompt(question, context_chunks)
            
            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 300,  # Reduced for memory efficiency
                "top_p": 0.9
            }
            
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=payload,
                timeout=25
            )
            
            if response.status_code != 200:
                logger.error(f"Groq API error: {response.status_code}")
                return "Error generating response", "API error"
            
            response_data = response.json()
            
            if 'choices' in response_data and response_data['choices']:
                content = response_data['choices'][0]['message']['content'].strip()
                
                # Parse answer and reasoning
                if "ANSWER:" in content and "REASONING:" in content:
                    parts = content.split("REASONING:")
                    answer = parts[0].replace("ANSWER:", "").strip()
                    reasoning = parts[1].strip()
                else:
                    answer = content
                    reasoning = "Generated response without explicit reasoning"
                
                return answer, reasoning
            else:
                return "No response generated", "Empty API response"
                
        except requests.RequestException as e:
            logger.error(f"Network error: {e}")
            return "Network error occurred", "Connection issue"
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return "Error generating answer", "Processing error"
    
    def test_connection(self) -> bool:
        """Test Groq API connection"""
        try:
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": "Test"}],
                "max_tokens": 5
            }
            
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=payload,
                timeout=10
            )
            
            return response.status_code == 200
        except Exception:
            return False