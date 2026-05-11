"""
Compose Play Store Feature Graphic (1024x500) from a generated raw banner.

Workflow:
  1. Save the AI-generated banner to `assets/feature-graphic-raw.png`
  2. Run this script — it will:
       - center-crop the source to 1024x500 aspect, resize, RGB-flatten
       - draw "Senik" (Prata-Regular) + "MENTAL MODELS · DAILY"
         (JetBrainsMono-Medium, uppercase, letter-spaced, accent teal)
         on the left third of the canvas
       - save to `assets/feature-graphic.png` as 24-bit no-alpha
         (Play Console requires JPG or 24-bit PNG)

Re-runnable. Reads brand colors from category_palettes.json so future
palette tweaks propagate automatically.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
FONTS = ASSETS / "fonts"
PALETTES = ROOT.parent.parent / "design" / "category_palettes.json"

SRC = ASSETS / "feature-graphic-raw.png"
OUT = ASSETS / "feature-graphic.png"

CANVAS_W, CANVAS_H = 1024, 500
TEXT_X = 64
TEXT_TOP = 56  # anchor text near top — below this is rays
TITLE_SIZE = 108
TAGLINE_SIZE = 17
LETTER_SPACING = 4
GAP_BETWEEN = 22

TITLE_TEXT = "Senik"
TAGLINE_TEXT = "MENTAL MODELS  ·  DAILY"


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def load_palette():
    data = json.loads(PALETTES.read_text(encoding="utf-8"))
    p = data["mental_models"]
    return {
        "text": hex_to_rgb(p["text"]),
        "accent": hex_to_rgb(p["accent"]),
        "bg": hex_to_rgb(p["bg"]),
    }


def cover_resize(im, target_w, target_h):
    src_w, src_h = im.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h
    if src_ratio > target_ratio:
        new_w = int(round(src_h * target_ratio))
        left = (src_w - new_w) // 2
        im = im.crop((left, 0, left + new_w, src_h))
    else:
        new_h = int(round(src_w / target_ratio))
        top = (src_h - new_h) // 2
        im = im.crop((0, top, src_w, top + new_h))
    return im.resize((target_w, target_h), Image.LANCZOS)


def add_left_scrim(im, bg_color, width=560, max_alpha=185):
    """Dark gradient on the left for text legibility. Quadratic falloff
    so the right side stays untouched."""
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    h = im.size[1]
    for x in range(width):
        t = x / width
        alpha = int(max_alpha * (1 - t) ** 2)
        draw.line([(x, 0), (x, h)], fill=(*bg_color, alpha))
    base = im.convert("RGBA")
    return Image.alpha_composite(base, overlay).convert("RGB")


def draw_spaced(draw, x, y, text, font, fill, spacing):
    cursor = x
    for ch in text:
        draw.text((cursor, y), ch, font=font, fill=fill)
        bbox = font.getbbox(ch)
        ch_w = bbox[2] - bbox[0]
        cursor += ch_w + spacing
    return cursor


def main():
    if not SRC.exists():
        raise SystemExit(f"Source not found: {SRC}\nSave the generated banner there first.")

    palette = load_palette()

    im = Image.open(SRC).convert("RGB")
    im = cover_resize(im, CANVAS_W, CANVAS_H)
    im = add_left_scrim(im, palette["bg"])

    draw = ImageDraw.Draw(im)
    title_font = ImageFont.truetype(str(FONTS / "Prata-Regular.ttf"), TITLE_SIZE)
    tagline_font = ImageFont.truetype(str(FONTS / "JetBrainsMono-Medium.ttf"), TAGLINE_SIZE)

    title_bbox = title_font.getbbox(TITLE_TEXT)
    title_top_offset = -title_bbox[1]
    title_visible_h = title_bbox[3] - title_bbox[1]

    title_y = TEXT_TOP + title_top_offset
    draw.text((TEXT_X, title_y), TITLE_TEXT, font=title_font, fill=palette["text"])

    tagline_y = TEXT_TOP + title_visible_h + GAP_BETWEEN
    draw_spaced(draw, TEXT_X + 4, tagline_y, TAGLINE_TEXT,
                tagline_font, palette["accent"], LETTER_SPACING)

    im.save(OUT, format="PNG", optimize=True)
    print(f"Wrote {OUT.relative_to(ROOT)} ({CANVAS_W}x{CANVAS_H}, RGB)")


if __name__ == "__main__":
    main()
