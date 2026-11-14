import urllib.request
import re

base_url = "https://ghoulapp.com"

def fetch_chunk(filename):
    url = f"{base_url}/assets/{filename}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# Crawl bloodSigilsReference
try:
    sigils = fetch_chunk("bloodSigilsReference-BcR5e0qe.js")
    print("Sigils len:", len(sigils))
    print(sigils[:1000])
except Exception as e:
    print(e)
