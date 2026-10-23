"""Trae los datos comerciales y las imágenes de tarjeta de cada curso desde la página oficial de cursos.

Uso (desde web-landings/):  python scripts/fetch-products.py

Fuente: https://www.negocioscreativos.net/ncacademia/cursos (página pública de Negocios Creativos).
Los datos de esta página sirven para la descripción, horas, cupo e imágenes de las landings. Los precios USD
publicados y sus enlaces se toman de assets/payment-links.json (checkouts Hotmart recibidos del cliente).
El campo priceUSD de commerce.json es una conversión histórica del precio de la tienda y no se muestra en las landings.

Escribe:
  assets/commerce.json            datos por curso (id de producto, precio COP y USD, horas, cupo, descripción, imagen)
  assets/media/card-<curso>.webp  imagen de la tarjeta (900 px de ancho) y card-<curso>-480.webp (480 px)

Vuelve a ejecutarlo cuando cambien horas, cupos o imágenes en la página de origen. No sobrescribe payment-links.json.
"""
import io
import json
import os
import re
import urllib.request

from PIL import Image

URL = 'https://www.negocioscreativos.net/ncacademia/cursos'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
media = os.path.join(root, 'assets', 'media')
BS, Q = chr(92), chr(34)

# Título del producto en la tienda -> slug de la landing
SLUGS = {
    'IA fácil para todos': 'ia-facil-para-todos',
    'Diseño Creativo con IA': 'diseno-creativo-con-ia',
    'Marketing Total': 'marketing-total-con-ia',
    'Publicidad Digital para ADS': 'publicidad-digital-ads',
    'IA para comerciales': 'ia-para-comerciales',
    'IA Para Gerentes': 'ia-para-gerentes',
    'IA 360': 'ia-360-para-empresas',
    'Automatización y agentes de IA': 'automatizacion-y-agentes-ia',
    'IA para Administrativos': 'ia-para-administrativos',
    'IA para finanzas': 'ia-para-finanzas',
}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()


html = get(URL).decode('utf8')
# El contenido de la página viaja en fragmentos self.__next_f.push([1,"..."]); se concatenan y se decodifican como JSON.
payload = ''
for m in re.finditer(r'self\.__next_f\.push\(\[1,' + Q + r'((?:[^' + Q + BS + BS + r']|' + BS + BS + r'.)*)' + Q + r'\]\)', html):
    try:
        payload += json.loads(Q + m.group(1) + Q)
    except Exception:
        pass


def balanced(text, start):
    depth, instr, esc, j = 0, False, False, start
    while j < len(text):
        c = text[j]
        if instr:
            if esc: esc = False
            elif c == BS: esc = True
            elif c == Q: instr = False
        elif c == Q: instr = True
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: return text[start:j + 1]
        j += 1
    return None


products = {}
for m in re.finditer(r'\{"id":"([0-9a-f-]{36})","title":"', payload):
    raw = balanced(payload, m.start())
    try:
        d = json.loads(raw)
    except Exception:
        continue
    if d.get('category') == 'CURSOS':
        products[d['id']] = d

USD_RATE = 3100  # la tienda usa 1 USD = 3.100 COP (1.300.000 COP = 419,35 USD)
out = {}
for d in products.values():
    slug = next((s for t, s in SLUGS.items() if d['title'].startswith(t)), None)
    if not slug:
        continue
    out[slug] = {
        'productId': d['id'], 'title': d['title'], 'subtitle': d.get('subtitle', ''), 'description': d.get('description', ''),
        'priceCOP': d['price'], 'priceUSD': round(d['price'] / USD_RATE, 2), 'level': d.get('level', ''),
        'hoursLabel': d.get('hoursLabel', ''), 'studentsLabel': d.get('studentsLabel', ''), 'imageUrl': d.get('imageUrl', ''),
    }
missing = [s for s in SLUGS.values() if s not in out]
if missing:
    raise SystemExit('Faltan cursos en la página de origen: ' + ', '.join(missing))

for slug, p in out.items():
    img = Image.open(io.BytesIO(get(p['imageUrl']))).convert('RGB')
    w = 900
    big = img.resize((w, round(w * img.height / img.width)), Image.LANCZOS) if img.width > w else img
    big.save(os.path.join(media, f'card-{slug}.webp'), quality=82, method=6)
    small = big.resize((480, round(480 * big.height / big.width)), Image.LANCZOS)
    small.save(os.path.join(media, f'card-{slug}-480.webp'), quality=78, method=6)
    p['imageSize'] = [big.width, big.height]
    print(slug, big.size)

with open(os.path.join(root, 'assets', 'commerce.json'), 'w', encoding='utf8') as f:
    json.dump({'source': URL, 'usdRate': USD_RATE, 'products': out}, f, ensure_ascii=False, indent=1)
print('commerce.json:', len(out), 'cursos')
