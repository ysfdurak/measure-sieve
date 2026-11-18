#!/usr/bin/env bash
# Xpress9 çözücüsünü düz JavaScript'e derler → web/js/xpress9.js
# PBIX içindeki model (DataModel) Microsoft'un Xpress9 sıkıştırmasıyla saklanır.
# Kaynak: Microsoft'un MIT lisanslı Xpress9 kodu, https://github.com/Hugoberry/xpress9-python içinde.
# Gerekenler: clang (wasm32 hedefi), wasm-ld, binaryen (wasm2js)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"; root="$here/../.."
work="$(mktemp -d)"
git clone -q https://github.com/Hugoberry/xpress9-python "$work/src"
git -C "$work/src" checkout -q ff81bd9f93601650243a2695d1ad5940c7fbadd0
clang --target=wasm32 -O2 -nostdlib -ffreestanding -fno-builtin -I"$here" -I"$work/src/include" -Wno-everything \
  -Wl,--no-entry -Wl,--export=init -Wl,--export=decompress -Wl,--export=alloc -Wl,--export=reset_heap \
  -o "$work/x9.wasm" "$here/x9wasm.c" "$here/rt.c" \
  "$work/src/src/Xpress9DecHuffman.c" "$work/src/src/Xpress9DecLz77.c" "$work/src/src/Xpress9Misc.c"
npx --yes binaryen@123.0.0 wasm2js "$work/x9.wasm" -O3 -o "$work/x9.js" 2>/dev/null || wasm2js "$work/x9.wasm" -O3 -o "$work/x9.js"
{ echo '// Xpress9 çözücüsü (yalnızca açma). tools/xpress9/build.sh ile üretilmiştir; elle düzenlemeyin.'
  echo '// Kaynak: Copyright (c) Microsoft Corporation, MIT License. https://github.com/Hugoberry/xpress9-python'
  cat "$work/x9.js"; } > "$root/web/js/xpress9.js"
rm -rf "$work"
echo "web/js/xpress9.js güncellendi"
