#!/usr/bin/env bash
# Build the WordPress theme from index.html.
#
# Output: dist/<slug>/ (theme folder) and dist/<slug>.zip (uploadable via
# Appearance > Themes > Add New > Upload Theme).
#
# index.html stays the single source of truth; index.php is generated from it
# with the WordPress hooks (wp_head, wp_body_open, wp_footer) inserted.
set -euo pipefail

SLUG="${THEME_SLUG:-mission-specialty}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist/$SLUG"

if grep -q '<?' "$ROOT/index.html"; then
  echo "index.html contains '<?', which PHP would interpret. Remove it before building." >&2
  exit 1
fi

for marker in '<html lang="en">' '<body>' '</head>' '</body>'; do
  if [ "$(grep -cF "$marker" "$ROOT/index.html")" -ne 1 ]; then
    echo "Expected exactly one '$marker' in index.html." >&2
    exit 1
  fi
done

rm -rf "$ROOT/dist"
mkdir -p "$OUT"
cp -R "$ROOT/theme/." "$OUT/"

{
  echo "<?php defined( 'ABSPATH' ) || exit; ?>"
  sed \
    -e 's|<html lang="en">|<html <?php language_attributes(); ?>>|' \
    -e 's|</head>|<?php wp_head(); ?>\n</head>|' \
    -e 's|<body>|<body <?php body_class(); ?>>\n<?php wp_body_open(); ?>|' \
    -e 's|</body>|<?php wp_footer(); ?>\n</body>|' \
    "$ROOT/index.html"
} > "$OUT/index.php"

if command -v php >/dev/null 2>&1; then
  for f in "$OUT"/*.php; do php -l "$f" >/dev/null; done
  echo "PHP lint passed."
fi

(cd "$ROOT/dist" && rm -f "$SLUG.zip" && zip -qr "$SLUG.zip" "$SLUG")
echo "Built $OUT and dist/$SLUG.zip"
