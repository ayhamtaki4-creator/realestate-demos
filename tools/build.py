#!/usr/bin/env python3
"""
Real-estate demo builder.

    python3 tools/build.py bashayer        # build one demo
    python3 tools/build.py --all           # build every folder in demos/

Each demo lives in demos/<slug>/ :
    site.json   brand, colours, contact, sections and listings
    img/*.jpg   photos (names are referenced from site.json without .jpg)

Output goes to docs/<slug>/ (GitHub Pages can serve the docs/ folder as is).
The public address of every demo is  BASE + <slug>/  where BASE is in tools/site.json.

What it writes per demo:
  * index.html, listings.html, property.html and one property-<id>.html per listing,
    each with title, description, Open Graph tags and JSON-LD (so a link pasted
    in WhatsApp / Facebook shows a photo, title and price);
  * a 1200x630 share image per page in assets/og/;
  * assets/data.js (window.SITE) from site.json, plus the shared app.js / style.css.
Every page is noindex and carries a "demo" strip; robots.txt only lets link-preview bots in.
Needs: Python 3 with Pillow. No node.
"""
import colorsys, html, json, os, re, shutil, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
BASE = json.load(open('tools/site.json'))['base'].rstrip('/') + '/'
TPL = 'template'
STATUS = {'sale': 'للبيع', 'rent': 'للإيجار', 'sold': 'تم البيع'}
STATUS_EN = {'sale': 'FOR SALE', 'rent': 'FOR RENT', 'sold': 'SOLD'}
esc = lambda s: html.escape(str(s or ''), quote=True)


# ---------- colours ----------
def hex2rgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def rgb2hex(c): return '#%02X%02X%02X' % tuple(max(0, min(255, round(x))) for x in c)
def shade(h, l_delta=0.0, s_mul=1.0):
    r, g, b = [x / 255 for x in hex2rgb(h)]
    hh, ll, ss = colorsys.rgb_to_hls(r, g, b)
    r, g, b = colorsys.hls_to_rgb(hh, max(0, min(1, ll + l_delta)), max(0, min(1, ss * s_mul)))
    return rgb2hex((r * 255, g * 255, b * 255))

def css_vars(c):
    p, a = c['primary'], c['accent']
    v = {'--navy': p, '--navy-2': shade(p, .05), '--navy-3': shade(p, .11), '--ink': p,
         '--gold': a, '--gold-ink': shade(a, -.16), '--gold-light': shade(a, .14)}
    return ':root{' + ';'.join(f'{k}:{x}' for k, x in v.items()) + '}'


# ---------- text helpers ----------
def money(n): return f"{n:,}$"
def price_text(l):
    if l['status'] == 'sold': return 'تم البيع'
    if l.get('price') is None: return l.get('priceNote') or 'السعر عند الطلب'
    return money(l['price']) + (' ' + l['priceUnit'] if l.get('priceUnit') else '')
def size_text(l):
    if not l.get('size'): return ''
    return ('~' if l.get('sizeApprox') else '') + f"{l['size']:,} م²" + (' ' + l['sizeNote'] if l.get('sizeNote') else '')
def place(l): return ' · '.join(x for x in [l.get('area'), l.get('sub')] if x)


# ---------- share images ----------
FONT_DIRS = [os.path.join(ROOT, 'tools/fonts'), '/usr/share/fonts', '/usr/local/share/fonts', os.path.expanduser('~/.fonts'), '/Library/Fonts', 'C:/Windows/Fonts']
def font(names, size):
    for d in FONT_DIRS:
        for base, _, files in os.walk(d):
            for n in names:
                if n in files: return ImageFont.truetype(os.path.join(base, n), size)
    return ImageFont.load_default()
F_AR = lambda s: font(['Amiri-Bold.ttf', 'NotoNaskhArabic-Bold.ttf', 'NotoSansArabic-Bold.ttf', 'DejaVuSans-Bold.ttf', 'arialbd.ttf'], s)
F_AR_L = lambda s: font(['Amiri-Regular.ttf', 'NotoSansArabic-Regular.ttf', 'DejaVuSans.ttf', 'arial.ttf'], s)
F_SANS = lambda s: font(['Amiri-Bold.ttf', 'Poppins-SemiBold.ttf', 'Poppins-Medium.ttf', 'DejaVuSans-Bold.ttf'], s)
F_SANS_L = lambda s: font(['Amiri-Regular.ttf', 'Poppins-Light.ttf', 'Poppins-Regular.ttf', 'DejaVuSans.ttf'], s)
RTL = dict(direction='rtl', language='ar')

def og_image(S, photo, out, price=None, status=None, area=None):
    W, H, PW = 1200, 630, 470
    PRI, ACC = hex2rgb(S['colors']['primary']), hex2rgb(S['colors']['accent'])
    SOFT, LINE = hex2rgb(shade(S['colors']['accent'], .28, .5)), hex2rgb(shade(S['colors']['primary'], .1))
    im = Image.new('RGB', (W, H), PRI)
    d = ImageDraw.Draw(im)
    if photo and os.path.exists(photo):
        im.paste(ImageOps.fit(Image.open(photo).convert('RGB'), (W - PW, H), Image.LANCZOS), (PW, 0))
    else:                                        # no photos yet: brand panel instead of a borrowed picture
        d.rectangle([PW, 0, W, H], fill=hex2rgb(shade(S['colors']['primary'], .06)))
        cx = PW + (W - PW) // 2
        d.rectangle([cx - 70, 200, cx + 70, 340], outline=hex2rgb(S['colors']['accent']), width=3)
        d.text((cx, 266), S['brand']['mark'], font=F_AR(80), fill=hex2rgb(S['colors']['accent']), anchor='mm', **RTL)
        d.text((cx, 400), 'الصور عند الطلب', font=F_AR_L(30), fill=hex2rgb(shade(S['colors']['accent'], .28, .5)), anchor='mm', **RTL)
    d.rectangle([PW - 4, 0, PW - 1, H], fill=ACC)
    R = PW - 56                                  # right edge of the text column (Arabic reads from here)
    def fit(txt, mk, size, maxw, **kw):
        while size > 14:
            f = mk(size)
            if d.textlength(txt, font=f, **kw) <= maxw: return f
            size -= 2
        return mk(size)
    B = S['brand']
    d.rectangle([R - 76, 56, R, 132], outline=ACC, width=2)
    d.text((R - 38, 92), B['mark'], font=F_AR(40), fill=(255, 255, 255), anchor='mm', **RTL)
    d.text((R, 170), B['name'], font=fit(B['name'], F_AR, 34, R - 56, **RTL), fill=(255, 255, 255), anchor='ra', **RTL)
    d.text((R, 218), B['sub'], font=F_AR_L(20), fill=SOFT, anchor='ra', **RTL)
    if status: d.text((56, 330), status, font=F_SANS(22), fill=ACC)
    if price:
        is_ar = bool(re.search('[\u0600-\u06FF]', price))
        kw = RTL if is_ar else {}
        mk = F_AR if is_ar else F_SANS
        d.text((R if is_ar else 56, 362), price, font=fit(price, mk, 60, R - 56, **kw), fill=(255, 255, 255), anchor='ra' if is_ar else 'la', **kw)
    if area: d.text((R, 512), area, font=fit(area, F_AR, 28, R - 56, **RTL), fill=SOFT, anchor='ra', **RTL)
    d.line([56, 568, R, 568], fill=LINE, width=2)
    d.text((56, 582), S['phoneDisplay'], font=F_SANS_L(20), fill=SOFT)
    im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)


# ---------- meta ----------
def meta(S, title, desc, url, image, kind='website', extra=''):
    return ('<!--OG-->\n'
            f'<meta name="description" content="{esc(desc)}">\n'
            f'<link rel="canonical" href="{esc(url)}">\n'
            f'<meta property="og:type" content="{kind}">\n'
            f'<meta property="og:site_name" content="{esc(S["brand"]["name"])}">\n'
            '<meta property="og:locale" content="ar_SY">\n'
            f'<meta property="og:title" content="{esc(title)}">\n'
            f'<meta property="og:description" content="{esc(desc)}">\n'
            f'<meta property="og:url" content="{esc(url)}">\n'
            f'<meta property="og:image" content="{esc(image)}">\n'
            '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
            f'<meta property="og:image:alt" content="{esc(title)}">\n'
            '<meta name="twitter:card" content="summary_large_image">\n'
            f'<meta name="twitter:title" content="{esc(title)}">\n'
            f'<meta name="twitter:description" content="{esc(desc)}">\n'
            f'<meta name="twitter:image" content="{esc(image)}">\n'
            f'{extra}<!--/OG-->')

def put(text, block): return re.sub(r'<!--OG-->.*?<!--/OG-->', lambda m: block, text, count=1, flags=re.S)

def fill(text, S, title):
    rep = {'{{TITLE}}': esc(title), '{{THEME}}': S['colors']['primary'], '{{CSSVARS}}': css_vars(S['colors']),
           '{{BRAND}}': esc(S['brand']['name']), '{{HERO_IMG}}': S['hero']['img'],
           '{{HERO_KICKER}}': esc(S['hero']['kicker']), '{{HERO_LEAD}}': esc(S['hero']['lead']),
           '{{HERO_TITLE}}': '<br>'.join(esc(x) for x in S['hero']['title'].split('<br>'))}
    for k, v in rep.items(): text = text.replace(k, v)
    left = re.findall(r'\{\{[A-Z_]+\}\}', text)
    if left: sys.exit(f'unfilled tokens: {left}')
    return text


# ---------- checks ----------
def check(S, src):
    need = ['slug', 'brand', 'colors', 'city', 'region', 'phone', 'phoneDisplay', 'whatsapp', 'map', 'hero', 'areas', 'listings']
    miss = [k for k in need if k not in S]
    if miss: sys.exit(f'{src}: missing keys {miss}')
    ids = [str(l['id']) for l in S['listings']]
    if len(ids) != len(set(ids)): sys.exit(f'{src}: duplicate listing ids')
    imgs = {S['hero']['img'], (S.get('sell') or {}).get('img') or S['hero']['img']} | {a['img'] for a in S['areas'].values()}
    for l in S['listings']:
        imgs |= set(l.get('photos') or [])
        if l['status'] not in STATUS: sys.exit(f"{src}: listing {l['id']} has bad status {l['status']}")
    missing = [i for i in sorted(imgs) if not os.path.exists(f'demos/{S["slug"]}/img/{i}.jpg')]
    if missing: sys.exit(f'{src}: missing photos {missing}')


# ---------- build ----------
def build(slug):
    src = f'demos/{slug}/site.json'
    S = json.load(open(src, encoding='utf-8'))
    S['slug'] = slug
    check(S, src)
    out = f'docs/{slug}'
    site = f'{BASE}{slug}/'
    if os.path.isdir(out): shutil.rmtree(out)
    os.makedirs(f'{out}/assets/og')
    shutil.copytree(f'demos/{slug}/img', f'{out}/assets/img')
    for f in ['app.js', 'style.css']: shutil.copy(f'{TPL}/assets/{f}', f'{out}/assets/{f}')
    shutil.copytree(f'{TPL}/assets/fonts', f'{out}/assets/fonts')
    open(f'{out}/assets/data.js', 'w', encoding='utf-8').write(
        f'/* {S["brand"]["name"]} – generated from demos/{slug}/site.json, edit that file instead. */\n'
        'window.SITE = ' + json.dumps(S, ensure_ascii=False, indent=1) + ';\n')

    B, city = S['brand'], S['city']
    img = lambda n: f'{out}/assets/img/{n}.jpg'
    v = lambda p: site + p

    og_image(S, img(S['hero']['img']), f'{out}/assets/og/home.jpg', status='REAL ESTATE',
             price='بيع · شراء · إيجار', area=S['region'])
    home_desc = S.get('about') or f'عقارات للبيع والإيجار في {S["region"]}.'
    for f, title in [('index.html', f'{B["name"]} | عقارات {S["region"]}'),
                     ('listings.html', f'عقارات للبيع والإيجار في {city} | {B["name"]}')]:
        t = fill(open(f'{TPL}/{f}', encoding='utf-8').read(), S, title)
        open(f'{out}/{f}', 'w', encoding='utf-8').write(put(t, meta(S, title, home_desc, v('' if f == 'index.html' else f), v('assets/og/home.jpg'))))

    tpl = fill(open(f'{TPL}/property.html', encoding='utf-8').read(), S, 'عقار')
    open(f'{out}/property.html', 'w', encoding='utf-8').write(tpl)
    for l in S['listings']:
        pid = str(l['id']); url = v(f'property-{pid}.html'); pt = price_text(l)
        ph = img(l['photos'][0]) if l.get('photos') else None
        p_en = 'SOLD' if l['status'] == 'sold' else (money(l['price']) if l.get('price') else 'اسأل عن السعر')
        og_image(S, ph, f'{out}/assets/og/{pid}.jpg', price=p_en, status=STATUS_EN[l['status']], area=place(l))
        title = f"{l['title']} – {pt}"
        bits = [STATUS[l['status']], size_text(l), place(l) + ('، ' + city if l['area'] != city else '')]
        desc = ' · '.join(b for b in bits if b) + '. ' + ((l.get('desc') or [''])[0][:150])
        ld = {'@context': 'https://schema.org', '@type': 'RealEstateListing', 'name': l['title'], 'url': url,
              'description': ' '.join(l.get('desc') or []) or l['title'],
              'image': [v(f"assets/img/{p}.jpg") for p in l.get('photos', [])] or [v('assets/og/home.jpg')],
              'offers': {'@type': 'Offer', 'priceCurrency': 'USD',
                         'availability': 'https://schema.org/SoldOut' if l['status'] == 'sold' else 'https://schema.org/InStock',
                         **({'price': l['price']} if l.get('price') and l['status'] != 'sold' else {})},
              'address': {'@type': 'PostalAddress', 'addressLocality': city, 'addressRegion': l['area'], 'addressCountry': 'SY'}}
        extra = '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>\n'
        page = put(tpl, meta(S, title, desc, url, v(f'assets/og/{pid}.jpg'), 'article', extra))
        page = page.replace(f'<title>عقار | {esc(B["name"])}</title>', f'<title>{esc(title)} | {esc(B["name"])}</title>', 1)
        page = page.replace('<!--ID-->', f'<script>window.PAGE_ID = {json.dumps(pid)};</script>', 1)
        first = f'<img src="assets/img/{l["photos"][0]}.jpg" alt="{esc(l["title"])}" style="width:100%;max-height:60vh;object-fit:cover">' if l.get('photos') else ''
        fallback = (f'<main id="main">{first}<div class="container" style="padding:24px 20px">'
                    f'<p>{esc(STATUS[l["status"]])} · {esc(place(l))}</p><h1 class="pd-title">{esc(l["title"])}</h1>'
                    f'<p class="pd-price"><b>{esc(pt)}</b></p>' + ''.join(f'<p>{esc(p)}</p>' for p in l.get('desc') or []) + '</div></main>')
        page = page.replace('<main id="main"></main>', fallback, 1)
        open(f'{out}/property-{pid}.html', 'w', encoding='utf-8').write(page)
    print(f'{slug}: {len(S["listings"])} listings -> {out}/  ({site})')


def site_files():
    os.makedirs('docs', exist_ok=True)
    open('docs/.nojekyll', 'w').close()
    open('docs/robots.txt', 'w').write(
        '# Demos: hidden from search engines, link previews allowed\n'
        + ''.join(f'User-agent: {b}\nAllow: /\n\n' for b in ['facebookexternalhit', 'Facebot', 'WhatsApp', 'TelegramBot', 'Twitterbot'])
        + 'User-agent: *\nDisallow: /\n')
    open('docs/index.html', 'w', encoding='utf-8').write(
        '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow">'
        '<meta name="viewport" content="width=device-width, initial-scale=1"><title>Demos</title></head>'
        '<body style="font-family:system-ui;padding:40px;color:#555">نماذج تجريبية خاصة.</body></html>\n')


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args: sys.exit(__doc__)
    slugs = sorted(d for d in os.listdir('demos') if os.path.exists(f'demos/{d}/site.json')) if args == ['--all'] else args
    site_files()
    for s in slugs: build(s)
