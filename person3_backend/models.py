"""
Person 3: Data Models & API Schemas
-----------------------------------
Agreed sync point with Person 4 (Frontend).
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    """Incoming request from frontend."""
    question: str = Field(..., description="Plain English question about the codebase", example="where is auth handled?")
    top_k: Optional[int] = Field(default=5, description="Number of context chunks to retrieve", ge=1, le=20)


class CitationItem(BaseModel):
    """File and line citations supporting the LLM answer."""
    file_path: str = Field(..., description="File path relative to repository root", example="src/auth/jwt.py")
    start_line: int = Field(..., description="Start line of referenced snippet", example=1)
    end_line: int = Field(..., description="End line of referenced snippet", example=28)
    snippet: Optional[str] = Field(None, description="Relevant code snippet excerpt")
    similarity_score: Optional[float] = Field(None, description="Retrieval similarity score")


class AskResponse(BaseModel):
    """Standard response shape delivered to Person 4 frontend."""
    question: str
    answer: str
    citations: List[CitationItem]
    chunks_retrieved: int


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
