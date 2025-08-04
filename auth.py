"""
Simple authentication module
"""
import os
from fastapi import HTTPException

def verify_bearer_token(token: str):
    """Verify bearer token against environment variable"""
    expected_token = os.getenv("BEARER_TOKEN")
    if not expected_token:
        raise HTTPException(status_code=500, detail="Bearer token not configured")
    
    if token != expected_token:
        raise HTTPException(status_code=401, detail="Invalid bearer token")
    
    return True