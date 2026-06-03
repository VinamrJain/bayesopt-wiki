#!/usr/bin/env python3
"""
fetch_arxiv_sources.py
----------------------
Download LaTeX source (.tar.gz) from arXiv and extract into organized folders.

Usage:
    python fetch_arxiv_sources.py <id> [<id> ...]  [--out DIR] [--name id:folder_name ...]

Examples:
    # Download a single paper (folder named by arXiv ID)
    python fetch_arxiv_sources.py 1807.02811

    # Download multiple papers with custom folder names
    python fetch_arxiv_sources.py \\
        1807.02811 1206.2944 2003.10870 2111.06537 2507.12453 2106.06079 \\
        --name 1807.02811:frazier_2018_tutorial_bo \\
        --name 1206.2944:snoek_2012_practical_bo \\
        --name 2003.10870:lee_2020_cost_aware_bo \\
        --name 2111.06537:astudillo_2021_multi_step_budgeted_bo \\
        --name 2507.12453:2025_cost_aware_stopping_bo \\
        --name 2106.06079:lee_2021_nonmyopic_cost_constrained_bo \\
        --out raw/

    # Pipe IDs from a file
    python fetch_arxiv_sources.py $(cat ids.txt) --out raw/
"""

import argparse
import io
import os
import sys
import tarfile
import time
import urllib.request
import urllib.error
import gzip
import shutil


ARXIV_SRC = "https://arxiv.org/src/{id}"
DELAY_BETWEEN = 3  # seconds, to be polite to arXiv


def fetch_source(arxiv_id: str, dest_dir: str) -> bool:
    url = ARXIV_SRC.format(id=arxiv_id)
    print(f"  Fetching {url} ...", end=" ", flush=True)

    req = urllib.request.Request(url, headers={"User-Agent": "fetch_arxiv_sources/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
    except urllib.error.HTTPError as e:
        print(f"FAILED (HTTP {e.code})")
        return False
    except Exception as e:
        print(f"FAILED ({e})")
        return False

    print(f"{len(data) / 1024:.1f} KB received")

    os.makedirs(dest_dir, exist_ok=True)

    # arXiv returns either a .tar.gz (multi-file) or a bare .gz (single .tex)
    # Detect by trying to open as tar first
    try:
        with tarfile.open(fileobj=io.BytesIO(data), mode="r:gz") as tar:
            tar.extractall(dest_dir)
            members = tar.getnames()
        print(f"  Extracted {len(members)} file(s) -> {dest_dir}/")
        return True
    except tarfile.TarError:
        pass

    # Single .gz file — decompress to a .tex
    try:
        tex_data = gzip.decompress(data)
        out_path = os.path.join(dest_dir, f"{arxiv_id}.tex")
        with open(out_path, "wb") as f:
            f.write(tex_data)
        print(f"  Single .tex extracted -> {out_path}")
        return True
    except Exception as e:
        print(f"  Could not decompress: {e}")
        # Save raw bytes for manual inspection
        raw_path = os.path.join(dest_dir, "source.bin")
        with open(raw_path, "wb") as f:
            f.write(data)
        print(f"  Raw bytes saved -> {raw_path}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Download and extract arXiv LaTeX sources."
    )
    parser.add_argument("ids", nargs="+", help="arXiv paper IDs (e.g. 1807.02811)")
    parser.add_argument(
        "--out", default="raw", help="Output base directory (default: raw/)"
    )
    parser.add_argument(
        "--name",
        action="append",
        metavar="ID:FOLDER",
        default=[],
        help="Override folder name for a given ID, e.g. 1807.02811:frazier_2018",
    )
    args = parser.parse_args()

    name_map = {}
    for entry in args.name:
        if ":" not in entry:
            print(f"Warning: --name value '{entry}' missing colon, skipping.")
            continue
        arxiv_id, folder = entry.split(":", 1)
        name_map[arxiv_id.strip()] = folder.strip()

    results = {}
    for i, arxiv_id in enumerate(args.ids):
        folder_name = name_map.get(arxiv_id, arxiv_id)
        dest = os.path.join(args.out, folder_name)
        print(f"[{i+1}/{len(args.ids)}] {arxiv_id} -> {dest}/")
        ok = fetch_source(arxiv_id, dest)
        results[arxiv_id] = ok
        if i < len(args.ids) - 1:
            time.sleep(DELAY_BETWEEN)

    print("\n--- Summary ---")
    for arxiv_id, ok in results.items():
        status = "OK" if ok else "FAILED"
        print(f"  {arxiv_id}: {status}")

    failed = [k for k, v in results.items() if not v]
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
