import urllib.request
import re
import json

base_url = "https://ghoulapp.com"

def fetch_chunk(filename):
    url = f"{base_url}/assets/{filename}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# 1. Inspect Rituals
try:
    rituals_js = fetch_chunk("ritualSystems-DwVH0OW4.js")
    print(f"Rituals size: {len(rituals_js)}")
    print(rituals_js[:1000])
except Exception as e:
    print("Ritual err:", e)

# 2. Inspect Resonance
try:
    res_js = fetch_chunk("resonance-C9xla1X8.js")
    print(f"\nResonance size: {len(res_js)}")
    print(res_js[:1000])
except Exception as e:
    print("Resonance err:", e)

# 3. Inspect wikiSearchIndex
try:
    wiki_js = fetch_chunk("wikiSearchIndex-JRBN92G_.js")
    print(f"\nWiki index size: {len(wiki_js)}")
    print(wiki_js[:1000])
except Exception as e:
    print("Wiki err:", e)
