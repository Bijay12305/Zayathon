"""
Person 3: LLM Client
--------------------
Handles calling the LLM provider (Google Gemini) with grounded prompt templates,
and provides a deterministic offline fallback for local testing without an API key.
"""

import os
from typing import Any, Dict, List, Optional
from prompts import SYSTEM_INSTRUCTION, build_prompt


class LLMClient:
    """Wrapper around Gemini API with fallback mock response generation."""

    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-1.5-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name
        self._client = None
        self._init_gemini()

    def _init_gemini(self):
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._client = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=SYSTEM_INSTRUCTION
                )
            except Exception as e:
                print(f"[LLMClient] Failed to initialize Gemini client: {e}")
                self._client = None

    def generate_answer(self, question: str, chunks: List[Dict[str, Any]]) -> str:
        """Sends prompt to Gemini or generates a grounded mock response."""
        prompt_text = build_prompt(question, chunks)

        if self._client:
            try:
                response = self._client.generate_content(prompt_text)
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[LLMClient] Gemini API call failed ({e}). Falling back to mock generator.")

        # Standalone mock generator based on retrieved chunks
        return self._generate_grounded_mock_answer(question, chunks)

    @staticmethod
    def _generate_grounded_mock_answer(question: str, chunks: List[Dict[str, Any]]) -> str:
        """
        Generates an intelligent, grounded mock response referencing the actual retrieved chunks.
        Ensures Person 3 backend can be demoed and tested offline seamlessly.
        """
        if not chunks:
            return "The provided codebase snippets do not contain enough information to answer this question."

        top_chunk = chunks[0]
        file_path = top_chunk.get("file_path", "unknown")
        start = top_chunk.get("start_line", 1)
        end = top_chunk.get("end_line", 1)
        lines = [line.strip() for line in top_chunk.get("text", "").split("\n") if line.strip() and not line.strip().startswith("#") and not line.strip().startswith("//")]

        preview = lines[0] if lines else "code implementation"

        summary = f"Based on the repository code, the answer to **'{question}'** is defined in `{file_path}:{start}-{end}`.\n\n"
        summary += f"Key implementation detail:\n- In `{file_path}` (lines {start}–{end}), we observe `{preview}`.\n\n"

        if len(chunks) > 1:
            second = chunks[1]
            s_file = second.get("file_path", "unknown")
            s_start = second.get("start_line", 1)
            s_end = second.get("end_line", 1)
            summary += f"Related definitions and usage can also be found in `{s_file}:{s_start}-{s_end}`.\n\n"

        summary += f"**Citations:**\n- [`{file_path}:{start}-{end}`]({file_path})"
        if len(chunks) > 1:
            summary += f"\n- [`{s_file}:{s_start}-{s_end}`]({s_file})"

        return summary
