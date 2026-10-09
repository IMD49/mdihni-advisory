"""Publish the existing static site at the configured Pages address.

Source keeps mdihni.com. Deployment metadata uses the active Pages URL until
the custom domain is connected. No DNS records or email settings are changed.
"""
from pathlib import Path
from urllib.parse import urlsplit, unquote, urlunsplit
from html.parser import HTMLParser
from html import escape
import json, os, posixpath, re, shutil

root=Path(__file__).resolve().parents[1]
target=root/'_site'
base=os.environ.get('PAGES_BASE_URL','https://mdihni.com').rstrip('/')
# Pages reports HTTP for a newly connected domain until SSL is provisioned.
# Keep our verified custom domain's metadata on its intended HTTPS address.
if base=='http://mdihni.com':base='https://mdihni.com'
if not base.startswith('https://'):raise SystemExit('Expected an HTTPS publishing address')
prefix=urlsplit(base).path.rstrip('/')
names=('index','services','approach','about','contact','privacy','disclaimer','404')
slugs={'index':'home','services':'diensten','approach':'werkwijze','about':'over-ons'}
routes={name+'.html':('home' if name=='index' else name)+'/' for name in names}
routes.update({'nl/'+name+'.html':'nl/'+slugs.get(name,name)+'/' for name in names})

# Remove only this script's generated directory, never editable source assets.
if target.resolve()!=root.resolve()/'_site' or target.is_symlink():
    raise SystemExit('Unsafe output directory')
if target.exists():shutil.rmtree(target)
target.mkdir()
shutil.copytree(root/'assets',target/'assets')

absolute={'https://mdihni.com/'+old:base+'/'+new for old,new in routes.items()}
absolute.update({'https://mdihni.com/nl/':base+'/nl/home/',
                 'https://mdihni.com/':base+'/home/'})
# Match complete page URLs; leave absolute /assets URLs and external URLs intact.
absolute_pattern=re.compile(r'https://mdihni\.com/(?:nl/)?(?:[a-z0-9-]+\.html)?(?=["<\s])')
def metadata(text):
    text=absolute_pattern.sub(lambda m:absolute.get(m[0],m[0]),text)
    return text.replace('https://mdihni.com',base)

def page_text(old):
    text=metadata((root/old).read_text(encoding='utf-8'))
    def ref(match):
        attr,value=match.groups(); u=urlsplit(value)
        if u.scheme or u.netloc or not u.path:return match[0]
        path=posixpath.normpath(posixpath.join(posixpath.dirname(old),unquote(u.path)))
        path=routes.get(path,path)
        return attr+'="'+urlunsplit(('', '', prefix+'/'+path,u.query,u.fragment))+'"'
    return re.sub(r'(href|src)="([^"\s]+)"',ref,text)

def redirect(destination,lang):
    url=prefix+'/'+destination; canonical=base+'/'+destination
    label='Verder naar de website' if lang=='nl' else 'Continue to the website'
    return ('<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Mdihni Advisory</title><link rel="canonical" href="'+escape(canonical)+'">'
            '<script>location.replace('+json.dumps(url)+'+location.search+location.hash);</script>'
            '<meta http-equiv="refresh" content="0;url='+escape(url)+'">'
            '</head><body><p><a href="'+escape(url)+'">'+label+'</a></p></body></html>')

for old,new in routes.items():
    dest=target/new/'index.html'; dest.parent.mkdir(parents=True,exist_ok=True)
    text=page_text(old); dest.write_text(text,encoding='utf-8')
    legacy=target/old; legacy.parent.mkdir(parents=True,exist_ok=True)
    # GitHub uses the root 404.html at arbitrary missing URLs: keep its full page.
    legacy.write_text(text if old=='404.html' else redirect(new,'nl' if old.startswith('nl/') else 'en'),encoding='utf-8')
for name in ('sitemap.xml','robots.txt'):
    (target/name).write_text(metadata((root/name).read_text(encoding='utf-8')),encoding='utf-8')
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
        if u.path.startswith('/'):
            if prefix and not u.path.startswith(prefix+'/'):errors.append('Invalid base path: '+ref);continue
            dest=(target/unquote(u.path[len(prefix):]).lstrip('/')).resolve()
        else:dest=(f.parent/unquote(u.path)).resolve()
        if dest.is_dir():dest=dest/'index.html'
        if not dest.is_relative_to(target.resolve()) or not dest.exists():errors.append(str(f.relative_to(target))+': '+ref)
if errors:raise SystemExit('\n'.join(errors))
print('Prepared 16 clean language routes with legacy redirects at '+base+'/')
