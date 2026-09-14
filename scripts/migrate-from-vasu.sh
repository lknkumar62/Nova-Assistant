#!/usr/bin/env bash
set -euo pipefail

# NOVA migration bootstrap
# Run from the local VASU/NOVA workspace. This copies the existing VASU source
# into NOVA without copying the VASU .git directory, node_modules, or build output.

SOURCE_DIR="${1:-/root/Vasu-Voice-Assistant}"
TARGET_DIR="${2:-$(pwd)}"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "ERROR: VASU source directory not found: $SOURCE_DIR"
  exit 1
fi

if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "ERROR: TARGET_DIR is not a Git repository: $TARGET_DIR"
  exit 1
fi

cd "$TARGET_DIR"
mkdir -p .nova-backup

# Copy source while keeping NOVA's own Git metadata and this script.
rsync -a --delete-excluded \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='dist/' \
  --exclude='.next/' \
  --exclude='.nova-backup/' \
  --exclude='scripts/migrate-from-vasu.sh' \
  "$SOURCE_DIR/" "$TARGET_DIR/"

# Project identity migration. Do not touch binary/model files.
find . -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.json' -o -name '*.html' -o -name '*.css' -o -name '*.md' -o -name '*.xml' -o -name '*.gradle' -o -name '*.properties' \) \
  -not -path './.git/*' \
  -not -path './node_modules/*' \
  -print0 | xargs -0 -r sed -i \
  -e 's/VASU Assistant/Nova Assistant/g' \
  -e 's/VASU Assistant/NOVA Assistant/g' \
  -e 's/VASU/NOVA/g' \
  -e 's/Vasu/Vova/g' \
  -e 's/vasu/nova/g'

# Restore the intentional branding spelling where the broad replacement may differ.
find . -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.json' -o -name '*.html' -o -name '*.css' -o -name '*.md' \) \
  -not -path './.git/*' -not -path './node_modules/*' -print0 | xargs -0 -r sed -i \
  -e 's/Vova/Nova/g' \
  -e 's/nova_settings/nova_settings/g' \
  -e 's/nova_messages/nova_messages/g'

# Capacitor identity should be NOVA-specific; keep the Android package stable only
# if the user already has native code depending on the old package.
if [ -f capacitor.config.ts ]; then
  sed -i \
    -e "s/com\.vasu\.assistant/com\.nova\.assistant/g" \
    -e "s/appName: '.*'/appName: 'Nova Assistant'/" \
    capacitor.config.ts || true
fi

# Ensure a NOVA README exists.
cat > README.md <<'EOF'
# Nova Assistant

NOVA is an Android-first AI voice assistant rebuilt from the existing VASU application architecture and informed by Maya-style voice-assistant interaction patterns.

## Product direction

- Maya-inspired assistant flow and feature organization
- Original NOVA implementation; no proprietary Maya code is copied
- Custom animated quantum orb on the Home screen
- Chat, Voice, Tools, Memory, Missions, Guardian, Permissions and Settings
- Offline-first voice architecture with online AI enhancement
- Android/Capacitor integration

## Development

```bash
npm install
npm run build
```
EOF

git add -A
git commit -m "chore: bootstrap Nova from VASU architecture" || true

echo "NOVA migration completed. Review git diff, then build with npm run build."
