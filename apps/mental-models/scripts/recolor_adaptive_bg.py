"""
Replace the flat gray background of assets/adaptive-icon.png with the studio
adaptiveIcon.backgroundColor (#0E1014) using a soft distance-based blend so
that anti-aliased prism edges don't break.

Source gray sampled from corners: (98, 98, 98).
"""
import math
import shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "adaptive-icon.png"
BACKUP = ROOT / "assets" / "adaptive-icon.gray.png"

SOURCE_BG = (98, 98, 98)
TARGET_BG = (14, 16, 20)
HARD_DIST = 30.0
SOFT_DIST = 55.0


def blend(orig, dist):
    if dist <= HARD_DIST:
        return TARGET_BG
    if dist >= SOFT_DIST:
        return orig[:3]
    t = (dist - HARD_DIST) / (SOFT_DIST - HARD_DIST)
    return tuple(int(round(TARGET_BG[i] * (1 - t) + orig[i] * t)) for i in range(3))


def main():
    if not BACKUP.exists():
        shutil.copy2(SRC, BACKUP)

    im = Image.open(SRC).convert("RGBA")
    px = im.load()
    w, h = im.size
    sx, sy, sz = SOURCE_BG

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            dist = math.sqrt((r - sx) ** 2 + (g - sy) ** 2 + (b - sz) ** 2)
            nr, ng, nb = blend((r, g, b), dist)
            px[x, y] = (nr, ng, nb, a)

    im.save(SRC, format="PNG")
    print(f"Wrote {SRC.name} ({w}x{h}); backup at {BACKUP.name}")


if __name__ == "__main__":
    main()
