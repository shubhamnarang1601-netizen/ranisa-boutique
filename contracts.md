# Roshni Boutique — API Contracts & Integration Plan

## Goal
Backend (FastAPI + MongoDB) so the Admin panel can CREATE / MANAGE / DELETE products & photos
that render live on the storefront. Reference site used for inspiration only.

## Auth (JWT)
- POST /api/admin/login  body: { username, password } -> { token }
  - Default admin creds via env: ADMIN_USERNAME=admin, ADMIN_PASSWORD=roshni123
- Protected routes require header: Authorization: Bearer <token>

## Product model (Mongo collection: products)
{ id (uuid), slug, title, price:int, compareAt:int|null, fabric, description,
  collections:[str], colors:[str], sizes:[str], images:[str], created_at }
- images can be remote URLs OR base64 data URIs (uploaded photos are stored as data URIs).

## Endpoints
- GET  /api/products?collection=<handle>        -> [product]  (public)
- GET  /api/products/{slug}                      -> product   (public)
- POST /api/products            (auth)           -> product   (create)
- PUT  /api/products/{id}       (auth)           -> product   (update)
- DELETE /api/products/{id}     (auth)           -> { ok }
- POST /api/upload              (auth)           -> { url }    (multipart file -> base64 data URI)

## Seeding
- On startup, if products empty -> seed 8 products (currently in frontend mock.js PRODUCTS).

## Frontend integration
- New api client: src/lib/api.js (uses REACT_APP_BACKEND_URL + /api).
- Replace PRODUCTS import in Home/Collection/ProductDetail with API fetch.
- Static content (hero, banners, reviews, instagram, features) stays in mock.js.
- Admin.jsx: real login -> store JWT in localStorage; table + form call CRUD;
  photo upload via <input type=file> -> POST /api/upload -> returned url added to images.
- Remove localStorage mock store for admin products.
