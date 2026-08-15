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
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'ranisa123')

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
    return {"message": "Ranisa Boutique API"}

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


# ---------- Startup ----------
@app.on_event("startup")
async def on_startup():
    # No seeding — the catalogue starts empty and is managed via the admin panel.
    logging.getLogger(__name__).info("Ranisa Boutique API started")


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
