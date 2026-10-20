"""Read-only public contract checks; never creates orders or shipments."""
import json, re, urllib.request, urllib.error
from pathlib import Path
source = Path("app/src/main/java/in/co/ranisaboutique/app/GoogleAuth.java").read_text()
base = re.search(r'BASE="([^"]+)"', source).group(1)
key = re.search(r'KEY="([^"]+)"', source).group(1)
def get(path):
    req = urllib.request.Request(base + path, headers={"apikey":key})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)
settings = get("/auth/v1/settings")
assert settings.get("external",{}).get("google") is True, "Google provider is not enabled"
catalogue = get("/rest/v1/ranisa_products?select=id,available_sizes,gallery_images&limit=1")
assert isinstance(catalogue,list), "Public catalogue contract failed"
try:
    orders = get("/rest/v1/ranisa_orders?select=id&limit=1")
    assert orders == [], "Anonymous order reads must not return customer records"
except urllib.error.HTTPError as error:
    assert error.code in (401, 403), "Unexpected anonymous-order response"
request = urllib.request.Request(base+"/functions/v1/ranisa-mobile",data=b'{"action":"create-order"}',headers={"Content-Type":"application/json"},method="POST")
try:
    urllib.request.urlopen(request,timeout=25)
    raise AssertionError("Unauthenticated checkout must be denied")
except urllib.error.HTTPError as error:
    assert error.code == 401, "Unexpected unauthorized-checkout response"
print("Google provider, shared catalogue, anonymous order isolation and checkout authentication passed.")
