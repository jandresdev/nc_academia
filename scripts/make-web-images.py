"""Variantes de imagen para rendimiento y para redes sociales.

Uso (desde web-landings/):  python scripts/make-web-images.py

Genera:
  assets/media/<curso>-800.webp   versión de 800 px para móvil y tarjetas (srcset)
  assets/og/<curso>.jpg           imagen social 1200x630 (Open Graph / X / WhatsApp) con el logo de NC AcademIA
  assets/og/home.jpg              imagen social del catálogo, con GUIA

Las fotos originales no se modifican. El logo se usa tal cual (negativo, sobre fondo oscuro).
"""
import os

from PIL import Image

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
media = os.path.join(root, 'assets', 'media')
og = os.path.join(root, 'assets', 'og')
logo_path = os.path.join(root, 'assets', 'brand', 'logos', 'nc-academia-horizontal-negativo.png')
guia_path = os.path.join(root, 'assets', 'brand', 'guia', 'guia-portada-derecha.webp')
os.makedirs(og, exist_ok=True)

logo = Image.open(logo_path).convert('RGBA')
slugs = sorted(f[:-5] for f in os.listdir(media) if f.endswith('.webp') and not f.endswith('-800.webp'))


def gradient_overlay(size, strength=0.78):
    """Degradado negro de izquierda a derecha y de abajo hacia arriba para dar lectura al logo."""
    w, h = size
    ov = Image.new('RGBA', size, (0, 0, 0, 0))
    px = ov.load()
    for x in range(w):
        for y in range(h):
            a = max(0.0, 1 - x / (w * 0.85)) * strength + max(0.0, (y / h - 0.55) / 0.45) * 0.55
            px[x, y] = (0, 0, 0, min(235, int(a * 255)))
    return ov


def place_logo(canvas, height=74, margin=56):
    scale = height / logo.height
    lg = logo.resize((int(logo.width * scale), height), Image.LANCZOS)
    canvas.paste(lg, (margin, canvas.height - height - margin), lg)


for slug in slugs:
    src = Image.open(os.path.join(media, slug + '.webp')).convert('RGB')
    # Variante de 800 px para móvil
    small = src.resize((800, round(800 * src.height / src.width)), Image.LANCZOS)
    small.save(os.path.join(media, slug + '-800.webp'), quality=76, method=6)
    # Imagen social 1200x630 (recorte centrado)
    w = 1200
    h = round(w * src.height / src.width)
    big = src.resize((w, h), Image.LANCZOS)
    top = max(0, (h - 630) // 2)
    card = big.crop((0, top, w, top + 630)).convert('RGBA')
    card.alpha_composite(gradient_overlay(card.size))
    place_logo(card)
    card.convert('RGB').save(os.path.join(og, slug + '.jpg'), quality=84, optimize=True, progressive=True)
    print(slug, 'ok')

# Home: fondo negro, logo a la izquierda y GUIA a la derecha
home = Image.new('RGB', (1200, 630), (0, 0, 0))
guia = Image.open(guia_path).convert('RGB')
gh = 630
gw = round(guia.width * gh / guia.height)
home.paste(guia.resize((gw, gh), Image.LANCZOS), (1200 - gw, 0))
home = home.convert('RGBA')
home.alpha_composite(gradient_overlay(home.size, 0.9))
place_logo(home, 96, 64)
home.convert('RGB').save(os.path.join(og, 'home.jpg'), quality=84, optimize=True, progressive=True)
print('home ok')
