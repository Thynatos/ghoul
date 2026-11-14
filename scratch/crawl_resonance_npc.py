import urllib.request
import re

base_url = "https://ghoulapp.com"

def fetch_chunk(filename):
    url = f"{base_url}/assets/{filename}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# 1. Resonance Roller Page
try:
    res_page = fetch_chunk("ResonanceRollerPage-BWCL8XSt.js")
    print(f"Resonance page size: {len(res_page)}")
    print(res_page[:1500])
except Exception as e:
    print("Resonance err:", e)

# 2. NPC Stat Blocks
try:
    npc_page = fetch_chunk("NpcStatBlocksPage-DFZzOG8c.js")
    print(f"\nNPC page size: {len(npc_page)}")
    print(npc_page[:1500])
except Exception as e:
    print("NPC err:", e)
