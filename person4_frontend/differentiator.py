"""
Person 4: The Differentiator Feature
------------------------------------
Answers: "What would break if I change this function?"

Given a function/symbol name:
1. Scans repo for definition locations (def foo, function foo, class foo)
2. Scans repo for call sites, import statements, and usages (regex/text scan)
3. Computes blast radius / impact analysis score and affected files list.
"""

import os
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List, Set


@dataclass
class UsageReference:
    file_path: str
    line_number: int
    line_content: str
    usage_type: str  # "definition", "import", "call", "reference"


@dataclass
class ImpactReport:
    symbol_name: str
    total_usages: int
    impact_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    definitions: List[Dict[str, Any]]
    imports: List[Dict[str, Any]]
    call_sites: List[Dict[str, Any]]
    affected_files: List[str]
    breakage_warning: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class CodebaseDifferentiator:
    """Scans repository files to analyze blast radius and dependencies of a symbol."""

    def __init__(self, root_dir: str = "."):
        self.root_dir = Path(root_dir).resolve()
        self.ignored_dirs = {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"}
        self.allowed_extensions = {".py", ".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".json"}

    def analyze_impact(self, symbol_name: str) -> ImpactReport:
        """Finds definitions, imports, and calls of symbol_name across repo."""
        symbol = symbol_name.strip()
        if not symbol:
            raise ValueError("Symbol name cannot be empty")

        # Compile regexes
        # Word boundary pattern for symbol
        sym_pattern = re.compile(r'\b' + re.escape(symbol) + r'\b')
        def_pattern_py = re.compile(r'^\s*(def|class|async\s+def)\s+' + re.escape(symbol) + r'\b')
        def_pattern_js = re.compile(r'^\s*(function|const|let|var|class)\s+' + re.escape(symbol) + r'\b')
        import_pattern = re.compile(r'^\s*(from|import|require|include)\s+.*?\b' + re.escape(symbol) + r'\b')
        call_pattern = re.compile(r'\b' + re.escape(symbol) + r'\s*\(')

        definitions = []
        imports = []
        calls = []
        affected_files: Set[str] = set()

        for dirpath, dirnames, filenames in os.walk(self.root_dir):
            dirnames[:] = [d for d in dirnames if d not in self.ignored_dirs and not d.startswith(".")]

            for fname in filenames:
                fpath = Path(dirpath) / fname
                if fpath.suffix.lower() not in self.allowed_extensions:
                    continue

                try:
                    rel_path = fpath.relative_to(self.root_dir).as_posix()
                    try:
                        lines = fpath.read_text(encoding="utf-8").splitlines()
                    except UnicodeDecodeError:
                        lines = fpath.read_text(encoding="latin-1").splitlines()

                    for line_idx, line in enumerate(lines, 1):
                        if not sym_pattern.search(line):
                            continue

                        affected_files.add(rel_path)
                        trimmed = line.strip()

                        if def_pattern_py.search(line) or def_pattern_js.search(line):
                            definitions.append(UsageReference(rel_path, line_idx, trimmed, "definition"))
                        elif import_pattern.search(line):
                            imports.append(UsageReference(rel_path, line_idx, trimmed, "import"))
                        elif call_pattern.search(line):
                            calls.append(UsageReference(rel_path, line_idx, trimmed, "call"))
                        else:
                            calls.append(UsageReference(rel_path, line_idx, trimmed, "reference"))
                except Exception:
                    continue

        total = len(definitions) + len(imports) + len(calls)
        num_files = len(affected_files)

        # Determine impact level
        if num_files >= 5 or total >= 15:
            impact_level = "CRITICAL"
            warning = f"Modifying `{symbol}` will affect {num_files} files across {total} call sites. High risk of regression!"
        elif num_files >= 3 or total >= 6:
            impact_level = "HIGH"
            warning = f"Modifying `{symbol}` touches {num_files} files. Ensure all {len(calls)} call sites are updated."
        elif num_files >= 2 or total >= 2:
            impact_level = "MEDIUM"
            warning = f"Modifying `{symbol}` will affect {num_files} files."
        else:
            impact_level = "LOW"
            warning = f"Modifying `{symbol}` is relatively isolated ({num_files} file touched)."

        return ImpactReport(
            symbol_name=symbol,
            total_usages=total,
            impact_level=impact_level,
            definitions=[asdict(d) for d in definitions],
            imports=[asdict(i) for i in imports],
            call_sites=[asdict(c) for c in calls],
            affected_files=sorted(list(affected_files)),
            breakage_warning=warning
        )


if __name__ == "__main__":
    import sys
    sym = sys.argv[1] if len(sys.argv) > 1 else "verify_token"
    diff = CodebaseDifferentiator()
    report = diff.analyze_impact(sym)
    print(f"Symbol: {report.symbol_name}")
    print(f"Impact Level: {report.impact_level} ({report.total_usages} usages in {len(report.affected_files)} files)")
    print(f"Warning: {report.breakage_warning}")
