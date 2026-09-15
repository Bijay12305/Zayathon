"""
Person 3: Prompt Construction & Grounded Citations
--------------------------------------------------
Constructs the strict grounding prompt requiring the LLM to only answer
from provided code snippets and cite specific file paths and line numbers.
"""

from typing import Any, Dict, List


SYSTEM_INSTRUCTION = """You are a precise Codebase Intelligence Assistant.
Your job is to answer questions about a software repository using ONLY the provided code snippets.

CRITICAL RULES:
1. Ground every statement in the snippets provided. Do not invent files, functions, or lines.
2. For every fact or claim in your answer, explicitly cite the source in the format: `[filepath:start_line-end_line]`.
3. If the provided snippets do not contain enough information to answer the question, clearly state: "The provided codebase snippets do not contain enough information to answer this question."
4. Be concise, direct, and developer-friendly. Use markdown code formatting.
"""


def build_prompt(question: str, chunks: List[Dict[str, Any]]) -> str:
    """
    Builds the user prompt containing question and numbered code context snippets.
    """
    if not chunks:
        context_str = "No relevant code snippets were found in the index."
    else:
        snippets = []
        for i, chunk in enumerate(chunks, 1):
            file_path = chunk.get("file_path", "unknown")
            start = chunk.get("start_line", 1)
            end = chunk.get("end_line", 1)
            text = chunk.get("text", "").strip()

            snippet_block = (
                f"--- SNIPPET {i} ---\n"
                f"File: {file_path}\n"
                f"Lines: {start}-{end}\n"
                f"Code:\n```\n{text}\n```"
            )
            snippets.append(snippet_block)
        context_str = "\n\n".join(snippets)

    prompt = f"""QUESTION:
{question}

CODEBASE SNIPPETS:
{context_str}

INSTRUCTIONS:
Answer the question using only the snippets above. Always cite exact files and line ranges (e.g. `path/to/file.py:10-25`) whenever referencing code.
"""
    return prompt
