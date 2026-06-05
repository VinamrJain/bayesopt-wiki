#!/bin/sh
# Install repo-tracked git hooks by pointing git at scripts/hooks/.
# Run once per clone: sh scripts/hooks/install.sh
set -e
git config core.hooksPath scripts/hooks
chmod +x scripts/hooks/pre-commit
echo "git hooks installed (core.hooksPath = scripts/hooks)"
