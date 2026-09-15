"""
Person 1: Chunker Module
------------------------
Splits source code files into fixed line windows (~50 lines)
with configurable line overlap (default 10 lines).
Preserves accurate file paths, start lines, and end lines.
"""

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class RawChunk:
    chunk_id: str
    file_path: str
    start_line: int
    end_line: int
    text: str
    total_file_lines: int


class CodeChunker:
    """
    Fixed-window code chunker with overlapping boundaries.
    """

    def __init__(self, window_size: int = 50, overlap: int = 10):
        if overlap >= window_size:
            raise ValueError("Overlap must be strictly smaller than window_size")
        self.window_size = window_size
        self.overlap = overlap
        self.step = window_size - overlap

    def chunk_file_content(self, file_path: str, content: str) -> List[RawChunk]:
        """
        Splits file content into overlapping line-based chunks.
        """
        lines = content.splitlines(keepends=True)
        total_lines = len(lines)

        if total_lines == 0:
            return []

        # If file is smaller than window size, return as a single chunk
        if total_lines <= self.window_size:
            return [
                RawChunk(
                    chunk_id=f"{file_path}#L1-L{total_lines}",
                    file_path=file_path,
                    start_line=1,
                    end_line=total_lines,
                    text="".join(lines),
                    total_file_lines=total_lines
                )
            ]

        chunks = []
        start_idx = 0
        chunk_num = 1

        while start_idx < total_lines:
            end_idx = min(start_idx + self.window_size, total_lines)
            chunk_lines = lines[start_idx:end_idx]
            start_line_num = start_idx + 1
            end_line_num = end_idx

            chunk_text = "".join(chunk_lines)
            chunks.append(
                RawChunk(
                    chunk_id=f"{file_path}#L{start_line_num}-L{end_line_num}",
                    file_path=file_path,
                    start_line=start_line_num,
                    end_line=end_line_num,
                    text=chunk_text,
                    total_file_lines=total_lines
                )
            )

            chunk_num += 1
            if end_idx >= total_lines:
                break
            start_idx += self.step

        return chunks
