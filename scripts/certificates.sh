#!/usr/bin/env bash
# Prépare les certificats de src/assets/ctf/ pour le site :
#  - un PDF reçoit un aperçu WebP de sa première page (même nom, extension .webp) ;
#  - une image PNG/JPG est convertie en WebP (c'est le WebP qu'on référence dans proofs.ts).
# Requiert poppler-utils (pdftoppm) et ImageMagick (magick). Usage : npm run certificates
set -euo pipefail
dir="$(dirname "$0")/../src/assets/ctf"
width=1600
quality=80
shopt -s nullglob nocaseglob
for pdf in "$dir"/*.pdf; do
  out="${pdf%.*}.webp"
  [[ -e "$out" && "$out" -nt "$pdf" ]] && continue
  pdftoppm -f 1 -l 1 -r 200 -png -singlefile "$pdf" "${pdf%.*}.tmp"
  magick "${pdf%.*}.tmp.png" -resize "${width}x>" -quality "$quality" "$out"
  rm "${pdf%.*}.tmp.png"
  echo "aperçu : $(basename "$out")"
done
for image in "$dir"/*.png "$dir"/*.jpg "$dir"/*.jpeg; do
  out="${image%.*}.webp"
  [[ -e "$out" && "$out" -nt "$image" ]] && continue
  magick "$image" -resize "${width}x>" -quality "$quality" "$out"
  echo "converti : $(basename "$out")"
done
