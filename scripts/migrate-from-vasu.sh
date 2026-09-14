#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:-/root/Vasu-Voice-Assistant}"
TARGET_DIR="${2:-$(pwd)}"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "ERROR: VASU source directory not found: $SOURCE_DIR"; exit 1
fi
if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "ERROR: TARGET_DIR is not a Git repository: $TARGET_DIR"; exit 1
fi

cd "$TARGET_DIR"

# Copy the complete existing application while preserving NOVA's .git and
# NOVA-only files. No destructive --delete is used.
rsync -a \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='dist/' \
  --exclude='.next/' \
  --exclude='.nova-backup/' \
  --exclude='scripts/migrate-from-vasu.sh' \
  "$SOURCE_DIR/" "$TARGET_DIR/"

# Rename project source paths first so imports can be migrated consistently.
find . -depth -type f -name '*Vasu*' -not -path './.git/*' -not -path './node_modules/*' -print0 |
  while IFS= read -r -d '' f; do
    nf="${f//Vasu/Nova}"
    [ "$f" = "$nf" ] || mv "$f" "$nf"
  done
find . -depth -type f -name '*vasu*' -not -path './.git/*' -not -path './node_modules/*' -print0 |
  while IFS= read -r -d '' f; do
    nf="${f//vasu/nova}"
    [ "$f" = "$nf" ] || mv "$f" "$nf"
  done

# Migrate source references and local storage keys. Binary/model assets are not
# edited by this text pass.
find . -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.json' -o -name '*.html' -o -name '*.css' -o -name '*.md' -o -name '*.xml' -o -name '*.gradle' -o -name '*.properties' \) \
  -not -path './.git/*' -not -path './node_modules/*' -print0 |
  xargs -0 -r sed -i \
    -e 's/VASU Assistant/Nova Assistant/g' \
    -e 's/VASU/NOVA/g' \
    -e 's/Vasu/Nova/g' \
    -e 's/vasu/nova/g'

if [ -f capacitor.config.ts ]; then
  sed -i \
    -e "s/com\.vasu\.assistant/com\.nova\.assistant/g" \
    -e "s/appName: '[^']*'/appName: 'Nova Assistant'/" \
    capacitor.config.ts
fi

cat > README.md <<'EOF'
# Nova Assistant

NOVA is an Android-first AI voice assistant rebuilt from the existing VASU application architecture and informed by Maya-style assistant interaction patterns.

## Product direction

- Maya-inspired feature/interaction flow with an original NOVA implementation
- Custom animated quantum orb on the Home screen
- Chat, Voice, Tools, Memory, Missions, Guardian, Permissions and Settings
- Offline-first voice architecture with online AI enhancement
- Android/Capacitor integration

Maya source code and proprietary assets are not copied.

## Development

```bash
npm install
npm run build
```
EOF

git add -A
git commit -m "chore: bootstrap Nova from VASU architecture" || true

echo "NOVA bootstrap complete. Run npm install && npm run build to verify."
