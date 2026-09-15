"""
Person 1: Repository Scanner
----------------------------
Recursively scans repository folders while ignoring binary files,
virtual environments, git internals, and cache artifacts.
"""

import os
from pathlib import Path
from typing import Generator, List, Set, Tuple


DEFAULT_IGNORED_DIRS: Set[str] = {
    ".git", ".svn", ".hg", "__pycache__", ".pytest_cache",
    ".venv", "venv", "env", "node_modules", "dist", "build",
    ".idea", ".vscode", ".next", ".gemini", "coverage", ".tox"
}

DEFAULT_IGNORED_EXTENSIONS: Set[str] = {
    ".pyc", ".pyo", ".pyd", ".db", ".sqlite", ".sqlite3",
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp",
    ".pdf", ".zip", ".tar", ".gz", ".7z", ".exe", ".dll",
    ".so", ".dylib", ".woff", ".woff2", ".ttf", ".eot",
    ".lock", ".log"
}

DEFAULT_INCLUDED_EXTENSIONS: Set[str] = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".html", ".css",
    ".json", ".md", ".yaml", ".yml", ".sql", ".sh", ".rs",
    ".go", ".java", ".c", ".cpp", ".h", ".hpp", ".rb", ".php"
}


class RepoScanner:
    """Recursively walks a codebase directory and yields readable source files."""

    def __init__(
        self,
        ignored_dirs: Set[str] = DEFAULT_IGNORED_DIRS,
        ignored_extensions: Set[str] = DEFAULT_IGNORED_EXTENSIONS,
        allowed_extensions: Set[str] = DEFAULT_INCLUDED_EXTENSIONS
    ):
        self.ignored_dirs = ignored_dirs
        self.ignored_extensions = ignored_extensions
        self.allowed_extensions = allowed_extensions

    def is_text_file(self, file_path: Path) -> bool:
        """Determines if a file is an eligible text code file."""
        if file_path.suffix.lower() in self.ignored_extensions:
            return False
        if self.allowed_extensions and file_path.suffix.lower() not in self.allowed_extensions:
            return False
        return True

    def scan(self, root_dir: str) -> Generator[Tuple[str, str], None, None]:
        """
        Recursively scans root_dir.
        Yields (relative_file_path, file_content_str).
        """
        root_path = Path(root_dir).resolve()

        for dirpath, dirnames, filenames in os.walk(root_path):
            # Prune ignored directories in-place
            dirnames[:] = [d for d in dirnames if d not in self.ignored_dirs and not d.startswith(".")]

            for fname in filenames:
                file_path = Path(dirpath) / fname
                if not self.is_text_file(file_path):
                    continue

                try:
                    rel_path = file_path.relative_to(root_path).as_posix()
                    # Safe reading with utf-8 fallback to latin-1
                    try:
                        content = file_path.read_text(encoding="utf-8")
                    except UnicodeDecodeError:
                        content = file_path.read_text(encoding="latin-1")

                    yield rel_path, content
                except Exception as e:
                    print(f"[Scanner] Warning: Skipped reading {file_path}: {e}")
