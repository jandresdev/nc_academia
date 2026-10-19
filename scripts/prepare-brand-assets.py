"""Prepara los activos de marca de NC AcademIA para el sitio.

Uso (desde web-landings/):
    python scripts/prepare-brand-assets.py "<carpeta MANUAL DE MARCA ACADEMIA_>"

Entradas (archivos oficiales de la carpeta del manual):
    LOGO ACADEMIA HORIZONTAL.png   firma horizontal en color (fondo blanco)
    LOGO ACADEMIA VERTICAL.png     firma vertical en color (fondo blanco)
    LOGO ACADEMIA BLANCO .png      firma vertical en negativo (fondo negro)
    Academia (3).jpg               firma horizontal en negativo (fondo negro)
    MANUAL DE MARCA NC ACADEMIA 2026.pdf   imágenes de GUIA y portada

Salidas en assets/brand/:
    logos/   las 4 firmas + isotipo, recortadas y con fondo transparente
    guia/    imágenes de GUIA extraídas del manual (WebP)
    favicon.png y apple-touch-icon.png (isotipo en color)

Los logos NO se redibujan ni se recolorean: solo se separa el fondo (blanco o negro) y se recorta el margen.
Respeta el manual: no deformar, no cambiar colores, no añadir brillos ni sombras.
"""
import base64
import io
import os
import re
import sys
import zlib

from PIL import Image, ImageChops

src = sys.argv[1] if len(sys.argv) > 1 else '.'
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, 'assets', 'brand')
logos_dir = os.path.join(out, 'logos')
guia_dir = os.path.join(out, 'guia')
os.makedirs(logos_dir, exist_ok=True)
os.makedirs(guia_dir, exist_ok=True)


def clamp_map(lo, hi):
    """Rampa lineal 0..255 entre lo y hi."""
    return lambda v: 0 if v <= lo else (255 if v >= hi else int((v - lo) * 255 / (hi - lo)))


def negative_to_rgba(path):
    """Blanco sobre negro -> blanco con alfa. El ruido JPEG por debajo de lo=28 se descarta."""
    gray = Image.open(path).convert('L')
    alpha = gray.point(clamp_map(28, 228))
    white = Image.new('L', gray.size, 255)
    return Image.merge('RGBA', (white, white, white, alpha))


def color_to_rgba(path):
    """Rojo y negro sobre blanco -> rojo/negro con alfa (el alfa sale de la oscuridad del píxel)."""
    rgb = Image.open(path).convert('RGB')
    r, g, b = rgb.split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)
    alpha = darkest.point(lambda v: clamp_map(10, 245)(255 - v))
    # Rojo medido en los píxeles sólidos del propio logo; el resto es negro.
    reds = ImageChops.subtract(r, g).point(lambda v: 255 if v > 25 else 0)
    solid = [rgb.getpixel((x, y)) for y in range(0, rgb.height, 3) for x in range(0, rgb.width, 3)]
    solid_red = [p for p in solid if p[0] - p[1] > 150]
    red = tuple(sorted(c)[len(c) // 2] for c in zip(*solid_red)) if solid_red else (243, 2, 6)
    layer = Image.new('RGB', rgb.size, (0, 0, 0))
    layer.paste(Image.new('RGB', rgb.size, red), mask=reds)
    layer.putalpha(alpha)
    print('rojo medido en el logo:', red)
    return layer


def crop_pad(im, pad_ratio=0.06):
    box = im.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
    im = im.crop(box)
    pad = int(max(im.size) * pad_ratio)
    canvas = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    return canvas


def symbol_only(im):
    """Primera banda de filas con contenido (el isotipo) de una firma vertical."""
    alpha = im.getchannel('A').point(lambda v: 255 if v > 10 else 0)
    rows = [alpha.crop((0, y, im.width, y + 1)).getbbox() is not None for y in range(im.height)]
    start = rows.index(True)
    end = start
    while end < len(rows) and rows[end]:
        end += 1
    return crop_pad(im.crop((0, start, im.width, end)), 0.04)


def find(name):
    for f in os.listdir(src):
        if f.lower() == name.lower():
            return os.path.join(src, f)
    raise SystemExit(f'No encontré {name} en {src}')


horizontal_color = crop_pad(color_to_rgba(find('LOGO ACADEMIA HORIZONTAL.png')))
vertical_color = crop_pad(color_to_rgba(find('LOGO ACADEMIA VERTICAL.png')))
vertical_negative = crop_pad(negative_to_rgba(find('LOGO ACADEMIA BLANCO .png')))
horizontal_negative = crop_pad(negative_to_rgba(find('Academia (3).jpg')))
symbol_color = symbol_only(vertical_color)
symbol_negative = symbol_only(vertical_negative)

for name, im in {
    'nc-academia-horizontal-color': horizontal_color,
    'nc-academia-vertical-color': vertical_color,
    'nc-academia-horizontal-negativo': horizontal_negative,
    'nc-academia-vertical-negativo': vertical_negative,
    'nc-academia-isotipo-color': symbol_color,
    'nc-academia-isotipo-negativo': symbol_negative,
}.items():
    im.save(os.path.join(logos_dir, name + '.png'), optimize=True)
    print('logo', name, im.size)


# Logo de la empresa matriz (Negocios Creativos), solo para el home. Versión blanca original (HB) del manual NC,
# ubicada en Data/ (dos niveles arriba de la carpeta del manual de NC AcademIA). Solo se recorta y se reduce.
parent_path = os.path.join(src, '..', '..', 'Negocios Creativos HB.png')
if os.path.exists(parent_path):
    parent = crop_pad(Image.open(parent_path).convert('RGBA'), 0.0)
    parent = parent.resize((400, round(400 * parent.height / parent.width)), Image.LANCZOS)  # se muestra a ~117 px: 400 px cubre pantallas 3x
    parent.save(os.path.join(logos_dir, 'negocios-creativos-horizontal-blanco.png'), optimize=True)
    print('logo negocios-creativos-horizontal-blanco', parent.size)


def square(im, size):
    side = max(im.size)
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


# ---- Favicon: isotipo en color sobre fondo transparente (se ve bien en pestañas claras y oscuras) ----
square(symbol_color, 64).save(os.path.join(out, 'favicon.png'), optimize=True)
# favicon.ico clásico con 16, 32 y 48 px: es el que los navegadores piden en la raíz del sitio.
square(symbol_color, 256).save(os.path.join(out, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
square(symbol_color, 192).save(os.path.join(out, 'icon-192.png'), optimize=True)


def on_black(im, size, ratio=0.62):
    """Icono para iOS/Android: isotipo rojo sobre negro de marca, con margen (el sistema redondea las esquinas)."""
    canvas = Image.new('RGB', (size, size), (0, 0, 0))
    mark = square(im, int(size * ratio))
    canvas.paste(mark, ((size - mark.width) // 2, (size - mark.height) // 2), mark)
    return canvas


on_black(symbol_color, 180).save(os.path.join(out, 'apple-touch-icon.png'), optimize=True)

# ---- GUIA e imágenes del manual (extraídas del PDF) ----
pdf = open(find('MANUAL DE MARCA NC ACADEMIA 2026.pdf'), 'rb').read()
pat = re.compile(rb'(?:^|\n)(\d+) 0 obj\s*(<<(?:(?!endobj).)*?>>)\s*stream\r?\n', re.S)


def pdf_image(number):
    for m in pat.finditer(pdf):
        if int(m.group(1)) != number:
            continue
        head = m.group(2)
        w = int(re.search(rb'/Width\s+(\d+)', head).group(1))
        h = int(re.search(rb'/Height\s+(\d+)', head).group(1))
        length = int(re.search(rb'/Length\s+(\d+)', head).group(1))
        raw = pdf[m.end():m.end() + length]
        if b'ASCII85Decode' in head:
            raw = base64.a85decode(raw.strip().removesuffix(b'~>'))
        buf = zlib.decompress(raw)
        bpp = len(buf) // (w * h)
        return Image.frombytes({1: 'L', 3: 'RGB', 4: 'RGBA'}[bpp], (w, h), buf[:w * h * bpp]).convert('RGB')
    raise SystemExit(f'Objeto {number} no encontrado en el PDF')


# Objetos del manual 2026: 62 = GUIA ejecutivo 16:9, 44 = GUIA ejecutivo 4:3, 5 = portada (GUIA a la derecha).
pdf_image(62).save(os.path.join(guia_dir, 'guia-ejecutivo-16x9.webp'), quality=84, method=6)
pdf_image(44).save(os.path.join(guia_dir, 'guia-ejecutivo-4x3.webp'), quality=84, method=6)
cover = pdf_image(5)
right = cover.crop((int(cover.width * 0.5), 0, cover.width, cover.height))  # mitad derecha: sin el título
right = right.resize((1000, int(1000 * right.height / right.width)), Image.LANCZOS)  # 1000 px: suficiente para el hero y más liviana
right.save(os.path.join(guia_dir, 'guia-portada-derecha.webp'), quality=72, method=6)
# Variante de 720 px para móvil (el hero ocupa todo el ancho y la imagen va bajo un degradado oscuro)
right.resize((720, int(720 * right.height / right.width)), Image.LANCZOS).save(os.path.join(guia_dir, 'guia-portada-derecha-720.webp'), quality=66, method=6)
print('guia', os.listdir(guia_dir))
