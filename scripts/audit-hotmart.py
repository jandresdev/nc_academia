"""Read the public Hotmart checkout's server-rendered product and USD amounts."""
import json
import re
import urllib.request
from pathlib import Path

OFFERS = json.loads((Path(__file__).resolve().parent.parent / 'assets' / 'payment-links.json').read_text(encoding='utf-8'))

for slug, offer in OFFERS.items():
    url = offer['url']
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=25) as response:
        html = response.read().decode('utf-8')
        final_url = response.url
    match = re.search(r'<script type="application/json" data-nuxt-data[^>]*>(.*?)</script>', html, re.S)
    if not match:
        print(json.dumps({'slug': slug, 'url': url, 'error': 'Nuxt data unavailable'}))
        continue
    data = json.loads(match.group(1))
    product = data[data[data[8]['products']][0]]
    methods = data[data[product['offer']]['paymentMethods']]
    amounts = []
    for ref in methods:
        method = data[ref]
        if not isinstance(method, dict) or 'amount' not in method:
            continue
        value = data[method['amount']]
        if not isinstance(value, dict):
            continue
        amounts.append({'method': data[method['type']], 'value': data[value['value']], 'currency': data[value['currency']]})
    usd_prices = sorted({item['value'] for item in amounts if item['currency'] == 'USD'})
    print(json.dumps({'slug': slug, 'url': url, 'final_url': final_url,
                      'product_name': data[product['name']], 'offer_key': data[data[product['offer']]['key']],
                      'expectedUSD': offer['priceUSD'], 'checkoutUSD': usd_prices,
                      'matches': usd_prices == [offer['priceUSD']], 'amounts': amounts}, ensure_ascii=False))
