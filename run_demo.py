"""
HB-26 Hack Battle — Team Build Plan Master Orchestrator
Track 3: Developer Tooling — Codebase Intelligence & Navigation

Runs and verifies the full 4-role pipeline end-to-end:
  Person 1 (Ingest) -> Person 2 (Retrieve) -> Person 3 (Backend) -> Person 4 (Differentiator)
"""

import os
import subprocess
import sys
import time

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT_DIR)

from person1_ingestion.chunker import CodeChunker
from person1_ingestion.scanner import RepoScanner
from person1_ingestion.ingest import IngestionPipeline
from person2_retrieval.retrieval import init_retriever, search
from person3_backend.prompts import build_prompt
from person3_backend.llm_client import LLMClient
from person4_frontend.differentiator import CodebaseDifferentiator


def run_full_pipeline_verification():
    print("=" * 80)
    print(" 🚀 HB-26 HACK BATTLE: TRACK 3 FULL PIPELINE VERIFICATION")
    print("=" * 80)

    # 1. Person 1: Ingestion & Chunking
    print("\n[STEP 1: PERSON 1 - Ingestion & Chunking]")
    chunks_out = os.path.join(ROOT_DIR, "person2_retrieval", "generated_chunks.json")
    pipeline = IngestionPipeline(window_size=50, overlap=10)
    chunks = pipeline.process_repository(
        repo_dir=os.path.join(ROOT_DIR, "person2_retrieval"),
        output_path=chunks_out
    )
    print(f"  ✓ Person 1 successfully ingested and created {len(chunks)} chunks.")

    # 2. Person 2: Retrieval & Cosine Similarity Storage
    print("\n[STEP 2: PERSON 2 - Retrieval & Storage]")
    retriever = init_retriever(chunks_out)
    test_query = "where is cosine similarity or search function defined?"
    print(f"  Querying: '{test_query}'")
    top_chunks = search(test_query, top_k=3)
    print(f"  ✓ Person 2 retrieved {len(top_chunks)} top matching chunks:")
    for i, c in enumerate(top_chunks, 1):
        print(f"    {i}. {c['file_path']}:{c['start_line']}-{c['end_line']} (score: {c['similarity_score']})")

    # 3. Person 3: Backend & LLM Grounded Answer Layer
    print("\n[STEP 3: PERSON 3 - Backend + LLM Answer Layer]")
    llm = LLMClient()
    answer = llm.generate_answer(test_query, top_chunks)
    print("  ✓ Person 3 generated cited answer:")
    print("  " + "-" * 60)
    for line in answer.split("\n"):
        print(f"    {line}")
    print("  " + "-" * 60)

    # 4. Person 4: Differentiator ("What would break if I change this?")
    print("\n[STEP 4: PERSON 4 - Differentiator Impact Analysis]")
    diff = CodebaseDifferentiator(root_dir=ROOT_DIR)
    symbol_to_test = "verify_token"
    report = diff.analyze_impact(symbol_to_test)
    print(f"  Symbol: '{report.symbol_name}'")
    print(f"  Impact Rating: {report.impact_level}")
    print(f"  Total Usages: {report.total_usages} across {len(report.affected_files)} files")
    print(f"  Warning: {report.breakage_warning}")
    print(f"  Affected Files: {', '.join(report.affected_files)}")

    print("\n" + "=" * 80)
    print(" 🎉 ALL 4 ROLES COMPLETED & INTEGRATED SUCCESSFULLY!")
    print("=" * 80)


if __name__ == "__main__":
    run_full_pipeline_verification()
