"""
Regenerates the web fonts in public/assets/fonts from the sources in scripts/fonts-src:

- Space_Grotesk.woff2: the variable text font, converted to WOFF2
- Noto_Color_Emoji_Subset.woff2: only the emojis used in src/ (the full emoji font is 24 MB)
- Space_Grotesk_Bold_Title.json: only the glyphs of the 3D title (MUSZARSKI PORTFOLIO)

Run it after adding a new emoji or changing the 3D title:

    pip install fonttools brotli lxml
    python scripts/subset-fonts.py
"""

import glob
import json
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sources = os.path.join(root, "scripts", "fonts-src")
fonts = os.path.join(root, "public", "assets", "fonts")
title_text = "MUSZARSKI PORTFOLIO"

sys.stdout.reconfigure(encoding="utf-8")

# 1) Text font
text_font = TTFont(os.path.join(sources, "Space_Grotesk.ttf"))
text_cmap = set(text_font.getBestCmap().keys())
text_font.flavor = "woff2"
text_font.save(os.path.join(fonts, "Space_Grotesk.woff2"))

# 2) Emoji font: every character used in the sources that the text font doesn't have
codepoints = set()
for pattern in ["src/**/*.ts", "src/**/*.tsx", "src/**/*.po", "index.html"]:
    for path in glob.glob(os.path.join(root, pattern), recursive=True):
        for character in open(path, encoding="utf-8").read():
            codepoint = ord(character)
            if codepoint >= 0x2000 and codepoint not in text_cmap:
                codepoints.add(codepoint)
# Joiners and variation selectors used by emoji sequences
codepoints |= {0x200D, 0xFE0F, 0x20E3}

emoji_font = TTFont(os.path.join(sources, "Noto_Color_Emoji_Regular.ttf"))
emoji_cmap = set(emoji_font.getBestCmap().keys())
used_codepoints = sorted(codepoint for codepoint in codepoints if codepoint in emoji_cmap)

options = subset.Options()
options.layout_features = ["*"]  # keeps the ligatures of flags and other sequences
options.flavor = "woff2"
options.name_IDs = ["*"]
options.notdef_outline = False
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=used_codepoints)
subsetter.subset(emoji_font)
emoji_font.flavor = "woff2"
emoji_font.save(os.path.join(fonts, "Noto_Color_Emoji_Subset.woff2"))

# 3) Typeface JSON of the 3D title
typeface = json.load(open(os.path.join(sources, "Space_Grotesk_Bold.json"), encoding="utf-8"))
typeface["glyphs"] = {
    glyph: data for glyph, data in typeface["glyphs"].items() if glyph in set(title_text)
}
json.dump(
    typeface,
    open(os.path.join(fonts, "Space_Grotesk_Bold_Title.json"), "w", encoding="utf-8"),
    separators=(",", ":"),
)

print("Emojis:", "".join(chr(codepoint) for codepoint in used_codepoints if codepoint > 0x2100))
for name in ["Space_Grotesk.woff2", "Noto_Color_Emoji_Subset.woff2", "Space_Grotesk_Bold_Title.json"]:
    print(f"{name}: {os.path.getsize(os.path.join(fonts, name)) // 1024} KB")
