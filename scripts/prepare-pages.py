"""Publish the existing static site at the configured Pages address.

Source keeps mdihni.com. Deployment metadata uses the active Pages URL until
the custom domain is connected. No DNS records or email settings are changed.
"""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from html.parser import HTMLParser
import os, re, shutil

root=Path(__file__).resolve().parents[1]
target=root/'_site'
base=os.environ.get('PAGES_BASE_URL','https://mdihni.com').rstrip('/')
if not base.startswith('https://'):raise SystemExit('Expected an HTTPS publishing address')
target.mkdir(exist_ok=True)
for folder in ('assets','nl'):
    shutil.copytree(root/folder,target/folder,dirs_exist_ok=True)
for f in list(root.glob('*.html'))+[root/'sitemap.xml',root/'robots.txt']:
    shutil.copy2(f,target/f.name)
for f in target.rglob('*'):
    if f.suffix in ('.html','.xml','.txt'):
        text=f.read_text(encoding='utf-8').replace('https://mdihni.com',base)
        if f==target/'404.html':
            # GitHub serves this file from missing paths: use absolute site URLs.
            text=re.sub(r'(href|src)="(?!https?:|mailto:|#)([^"\s]+)"',lambda m:m[1]+'="'+base+'/'+m[2]+'"',text)
        f.write_text(text,encoding='utf-8')
# Original artwork stays editable in the source, but is not served to visitors.
for f in (target/'assets').glob('*-original.png'):f.unlink()
(target/'.nojekyll').touch()

class References(HTMLParser):
    def __init__(self):super().__init__();self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        for key in ('href','src'):
            if key in a:self.links.append(a[key])
errors=[]
for f in target.rglob('*.html'):
    p=References();p.feed(f.read_text(encoding='utf-8'))
    for ref in p.links:
        u=urlsplit(ref)
        if u.scheme or u.netloc or not u.path:continue
        dest=(f.parent/unquote(u.path)).resolve()
        if not dest.is_relative_to(target.resolve()) or not dest.exists():errors.append(str(f.relative_to(target))+': '+ref)
if errors:raise SystemExit('\n'.join(errors))
print('Prepared 16 language pages at '+base+'/')
