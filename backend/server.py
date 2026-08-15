from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import base64
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta, timezone
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth config
JWT_SECRET = os.environ.get('JWT_SECRET', 'roshni-secret-change-me')
JWT_ALGO = 'HS256'
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'roshni123')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class LoginInput(BaseModel):
    username: str
    password: str

class ProductBase(BaseModel):
    title: str
    price: int
    compareAt: Optional[int] = None
    fabric: Optional[str] = ""
    description: Optional[str] = ""
    collections: List[str] = []
    colors: List[str] = []
    sizes: List[str] = []
    images: List[str] = []

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Helpers ----------
def slugify(text: str) -> str:
    base = ''.join(c.lower() if c.isalnum() else '-' for c in text)
    while '--' in base:
        base = base.replace('--', '-')
    return base.strip('-')[:60] or 'product'

def make_token() -> str:
    payload = {
        'sub': ADMIN_USERNAME,
        'role': 'admin',
        'exp': datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def require_admin(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Missing token')
    token = authorization.split(' ', 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail='Invalid or expired token')
    if payload.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Forbidden')
    return payload

def clean(doc: dict) -> dict:
    doc.pop('_id', None)
    return doc


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Roshni Boutique API"}

@api_router.post("/admin/login")
async def admin_login(data: LoginInput):
    if data.username == ADMIN_USERNAME and data.password == ADMIN_PASSWORD:
        return {"token": make_token(), "username": ADMIN_USERNAME}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.get("/products")
async def list_products(collection: Optional[str] = None):
    query = {}
    if collection:
        query = {"collections": {"$elemMatch": {"$regex": f"^{collection}"}}}
    docs = await db.products.find(query).sort("created_at", -1).to_list(1000)
    return [clean(d) for d in docs]

@api_router.get("/products/{slug}")
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return clean(doc)

@api_router.post("/products", dependencies=[Depends(require_admin)])
async def create_product(data: ProductCreate):
    slug = slugify(data.title)
    # ensure unique slug
    if await db.products.find_one({"slug": slug}):
        slug = f"{slug}-{str(uuid.uuid4())[:4]}"
    product = Product(slug=slug, **data.dict())
    await db.products.insert_one(product.dict())
    return clean(product.dict())

@api_router.put("/products/{product_id}", dependencies=[Depends(require_admin)])
async def update_product(product_id: str, data: ProductCreate):
    existing = await db.products.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    update = data.dict()
    await db.products.update_one({"id": product_id}, {"$set": update})
    doc = await db.products.find_one({"id": product_id})
    return clean(doc)

@api_router.delete("/products/{product_id}", dependencies=[Depends(require_admin)])
async def delete_product(product_id: str):
    res = await db.products.delete_one({"id": product_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}

@api_router.post("/upload", dependencies=[Depends(require_admin)])
async def upload_image(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image too large (max 5MB)")
    mime = file.content_type or "image/jpeg"
    b64 = base64.b64encode(content).decode("utf-8")
    return {"url": f"data:{mime};base64,{b64}"}


# ---------- Seed ----------
SEED_PRODUCTS = [
    {"slug": "glaze-cotton-western-style-frock-15396", "title": "Glaze Cotton Western Style Classy Look Floral Cut-Work Chain Accent Frock - 15396", "price": 3195, "compareAt": 3995, "collections": ["new-in", "casual-wear", "best-sellers"], "colors": ["Black", "Brown"], "sizes": ["S", "M", "L", "XL"], "fabric": "Glaze Cotton", "description": "A classy western-style frock in premium glaze cotton featuring delicate floral cut-work and a stunning chain accent at the yoke. Perfect for casual outings and day events.", "images": ["https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T122503.170.png?v=1785912951&width=1420", "https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T122515.975.png?v=1785912951&width=1420"]},
    {"slug": "floral-applique-cut-work-mul-chanderi-frock-15645", "title": "Floral Applique Cut-Work Stylish Collar Mul-Chanderi Frock - 15645", "price": 3195, "compareAt": 3895, "collections": ["new-in", "casual-wear"], "colors": ["Sea Blue", "Blue", "Brown"], "sizes": ["S", "M", "L", "XL"], "fabric": "Mul-Chanderi", "description": "An elegant ankle-length frock crafted in breathable Mul-Chanderi with floral applique cut-work and a stylish collar. Slightly lean fit for a graceful silhouette.", "images": ["https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T123015.185.png?v=1785913253&width=1420", "https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T123039.982.png?v=1785913253&width=1420"]},
    {"slug": "bushy-leaf-petals-embroidered-mul-chanderi-frock-15466", "title": "Bushy Leaf Petals Embroidered Mul-Chanderi Ankle Length Frock - 15466", "price": 2095, "compareAt": 2595, "collections": ["new-in", "casual-wear", "best-sellers"], "colors": ["Creamish Pink"], "sizes": ["S", "M", "L", "XL", "XXL"], "fabric": "Mul-Chanderi", "description": "Delicate bushy leaf petal embroidery adorns this ankle-length Mul-Chanderi frock, offering an effortlessly graceful look for festive and casual days alike.", "images": ["https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T124710.972.png?v=1785914294&width=1420", "https://roshniboutiques.com/cdn/shop/files/CopyofRoshniWebsiteImageTemplate-2026-08-05T124658.947.png?v=1785914294&width=1420"]},
    {"slug": "mandarin-collar-mul-chanderi-frock-3d-floral-applique-15421", "title": "Mandarin Collar Ankle Length Mul-Chanderi Frock with 3D Floral Applique Yoke - 15421", "price": 1995, "compareAt": 2495, "collections": ["new-in", "casual-wear"], "colors": ["Onion Pink"], "sizes": ["S", "M", "L", "XL"], "fabric": "Mul-Chanderi", "description": "A refined Mandarin collar frock with a striking 3D floral applique yoke, tailored in soft Mul-Chanderi for all-day comfort and elegance.", "images": ["https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-13T173025.200.png?v=1783944100&width=1420", "https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-13T173106.591.png?v=1783944099&width=1420"]},
    {"slug": "jewel-handwork-flared-kaftan-palazzo-crepe-15754", "title": "Jewel Handwork Over Yoke Stylish Flared Kaftan With Palazzo Bottom In Premium Crepe - 15754", "price": 10495, "compareAt": 12995, "collections": ["luxurio", "party-wear", "indo-western"], "colors": ["Blue", "Bottle Green"], "sizes": ["S", "M", "L", "XL"], "fabric": "Premium Crepe", "description": "A statement flared kaftan featuring intricate jewel handwork over the yoke, paired with flowing palazzo bottoms in premium crepe. Luxurio by Roshni.", "images": ["https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-08-12T171149.063.png?v=1786534923&width=1420", "https://roshniboutiques.com/cdn/shop/files/WhatsAppImage2026-08-12at12.28.18.jpg?v=1786518587&width=864"]},
    {"slug": "designer-neckpiece-mirror-shrug-crop-top-dhoti-skirt-15584", "title": "Designer Neckpiece Look Real Mirror Shrug Style Crop Top With Golden Prints Dhoti Skirt - 15584", "price": 9595, "compareAt": 11995, "collections": ["luxurio", "indo-western", "party-wear"], "colors": ["Light Peach", "Brown"], "sizes": ["S", "M", "L", "XL"], "fabric": "Georgette", "description": "An indo-western showstopper: a shrug-style crop top with designer neckpiece look and real mirror detailing, paired with a wavy golden-print drape dhoti skirt.", "images": ["https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_48_fe71cd17-46db-400c-9de2-b6cdeb60f8c9.png?v=1785235993&width=1420", "https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_49_68834803-44ab-4400-ace8-2e1611113c7c.png?v=1785235992&width=1420"]},
    {"slug": "mango-buti-sequin-russian-silk-outer-harem-15011", "title": "Mango-Buti Fine Sequin Detailing Russian Silk Outer With Buster & Modal Satin Harem Bottom - 15011", "price": 10795, "compareAt": 13495, "collections": ["luxurio", "party-wear"], "colors": ["Wine"], "sizes": ["S", "M", "L", "XL"], "fabric": "Russian Silk", "description": "Fine mango-buti sequin detailing on a Russian silk outer, styled with a buster and modal satin harem bottom for a regal celebration-ready look.", "images": ["https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-17T192214.957.png?v=1784296502&width=1420", "https://roshniboutiques.com/cdn/shop/files/WhatsApp_Image_2026-07-17_at_18.59.53_1.jpg?v=1784296501&width=576"]},
    {"slug": "mustard-bandhani-peplum-party-suit-mirror-work-14395", "title": "Mustard Yellow Bandhani Print Peplum Style Party Wear Full Suit Set with Mirror Work - 14395", "price": 12495, "compareAt": 14995, "collections": ["luxurio", "party-wear", "best-sellers"], "colors": ["Mustard Yellow"], "sizes": ["S", "M", "L", "XL", "XXL"], "fabric": "Silk Blend", "description": "A vibrant mustard yellow Bandhani-print peplum suit set with delicate mirror work - a festive full set that radiates celebration.", "images": ["https://roshniboutiques.com/cdn/shop/files/Copy_of_Roshni_Website_Image_Template_-_2026-07-09T125107.693.png?v=1783581758&width=1420", "https://roshniboutiques.com/cdn/shop/files/WhatsApp_Image_2026-07-09_at_11.59.05.jpg?v=1783581757&width=688"]},
]

@app.on_event("startup")
async def seed_db():
    count = await db.products.count_documents({})
    if count == 0:
        docs = []
        for p in SEED_PRODUCTS:
            product = Product(**p)
            docs.append(product.dict())
        if docs:
            await db.products.insert_many(docs)
        logging.getLogger(__name__).info(f"Seeded {len(docs)} products")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
