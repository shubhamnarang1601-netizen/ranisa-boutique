#!/usr/bin/env python3
"""
Comprehensive backend auth testing for Ranisa Boutique API
Tests admin login, auth guards, and CRUD operations
"""
import requests
import json
import sys
from io import BytesIO

# Base URL from frontend/.env
BASE_URL = "https://boutique-shop-admin.preview.emergentagent.com/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "ranisa123"

# Test results tracking
passed = 0
failed = 0
test_results = []

def log_test(name, success, details=""):
    global passed, failed
    status = "✅ PASS" if success else "❌ FAIL"
    result = f"{status}: {name}"
    if details:
        result += f" - {details}"
    print(result)
    test_results.append({"name": name, "success": success, "details": details})
    if success:
        passed += 1
    else:
        failed += 1

def test_admin_login_valid():
    """Test 1: POST /api/admin/login with valid credentials"""
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20:
                log_test("Admin login with valid credentials", True, f"Returns 200 with JWT token")
                return data["token"]
            else:
                log_test("Admin login with valid credentials", False, f"200 but missing/invalid token: {data}")
                return None
        else:
            log_test("Admin login with valid credentials", False, f"Expected 200, got {response.status_code}: {response.text}")
            return None
    except Exception as e:
        log_test("Admin login with valid credentials", False, f"Exception: {str(e)}")
        return None

def test_admin_login_invalid():
    """Test 2: POST /api/admin/login with invalid credentials"""
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": "wrongpassword"},
            timeout=10
        )
        if response.status_code == 401:
            log_test("Admin login with invalid credentials", True, "Returns 401 Unauthorized")
        else:
            log_test("Admin login with invalid credentials", False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Admin login with invalid credentials", False, f"Exception: {str(e)}")

def test_protected_endpoint_no_auth(endpoint, method="POST"):
    """Test 3a: Protected endpoint without Authorization header"""
    try:
        if method == "POST":
            response = requests.post(f"{BASE_URL}{endpoint}", json={}, timeout=10)
        elif method == "PUT":
            response = requests.put(f"{BASE_URL}{endpoint}", json={}, timeout=10)
        elif method == "DELETE":
            response = requests.delete(f"{BASE_URL}{endpoint}", timeout=10)
        
        if response.status_code == 401:
            log_test(f"{method} {endpoint} without auth", True, "Returns 401")
        else:
            log_test(f"{method} {endpoint} without auth", False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test(f"{method} {endpoint} without auth", False, f"Exception: {str(e)}")

def test_protected_endpoint_malformed_token(endpoint, method="POST"):
    """Test 3b: Protected endpoint with malformed/garbage Bearer token"""
    try:
        headers = {"Authorization": "Bearer abc.def.ghi"}
        if method == "POST":
            response = requests.post(f"{BASE_URL}{endpoint}", json={}, headers=headers, timeout=10)
        elif method == "PUT":
            response = requests.put(f"{BASE_URL}{endpoint}", json={}, headers=headers, timeout=10)
        elif method == "DELETE":
            response = requests.delete(f"{BASE_URL}{endpoint}", headers=headers, timeout=10)
        
        if response.status_code == 401:
            log_test(f"{method} {endpoint} with malformed token", True, "Returns 401 (not 500)")
        elif response.status_code == 500:
            log_test(f"{method} {endpoint} with malformed token", False, f"CRITICAL: Returns 500 (should be 401): {response.text}")
        else:
            log_test(f"{method} {endpoint} with malformed token", False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test(f"{method} {endpoint} with malformed token", False, f"Exception: {str(e)}")

def test_public_get_products():
    """Test 4a: Public GET /api/products"""
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("GET /api/products (public)", True, f"Returns 200 with {len(data)} products")
        else:
            log_test("GET /api/products (public)", False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("GET /api/products (public)", False, f"Exception: {str(e)}")

def test_public_get_products_with_collection():
    """Test 4b: Public GET /api/products?collection=casual-wear"""
    try:
        response = requests.get(f"{BASE_URL}/products?collection=casual-wear", timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("GET /api/products?collection=casual-wear (public)", True, f"Returns 200 with {len(data)} products")
        else:
            log_test("GET /api/products?collection=casual-wear (public)", False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("GET /api/products?collection=casual-wear (public)", False, f"Exception: {str(e)}")

def test_public_get_product_by_slug_existing():
    """Test 4c: Public GET /api/products/{slug} for existing product"""
    # First, create a test product to ensure we have something to fetch
    token = test_admin_login_valid()
    if not token:
        log_test("GET /api/products/{slug} existing (public)", False, "Cannot test - no admin token")
        return None
    
    # Create a test product
    test_product = {
        "title": "Test Product for Slug Fetch",
        "price": 1999,
        "fabric": "Cotton",
        "description": "Test product",
        "collections": ["test-collection"],
        "colors": ["Red"],
        "sizes": ["M"],
        "images": []
    }
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        create_response = requests.post(f"{BASE_URL}/products", json=test_product, headers=headers, timeout=10)
        if create_response.status_code == 200:
            created = create_response.json()
            slug = created.get("slug")
            
            # Now test public GET by slug
            response = requests.get(f"{BASE_URL}/products/{slug}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                log_test(f"GET /api/products/{slug} existing (public)", True, f"Returns 200 with product data")
                return slug
            else:
                log_test(f"GET /api/products/{slug} existing (public)", False, f"Expected 200, got {response.status_code}: {response.text}")
                return slug
        else:
            log_test("GET /api/products/{slug} existing (public)", False, f"Cannot create test product: {create_response.status_code}")
            return None
    except Exception as e:
        log_test("GET /api/products/{slug} existing (public)", False, f"Exception: {str(e)}")
        return None

def test_public_get_product_by_slug_nonexistent():
    """Test 4d: Public GET /api/products/{slug} for non-existent product"""
    try:
        response = requests.get(f"{BASE_URL}/products/boutique-shop-admin-nonexistent-slug-12345", timeout=10)
        if response.status_code == 404:
            log_test("GET /api/products/{slug} non-existent (public)", True, "Returns 404")
        else:
            log_test("GET /api/products/{slug} non-existent (public)", False, f"Expected 404, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("GET /api/products/{slug} non-existent (public)", False, f"Exception: {str(e)}")

def test_full_crud_sanity(token):
    """Test 5: Full CRUD sanity - create, fetch, update, delete"""
    if not token:
        log_test("Full CRUD sanity test", False, "No admin token available")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 1: Create a product
    test_product = {
        "title": "CRUD Test Product",
        "price": 2999,
        "compareAt": 3999,
        "fabric": "Silk",
        "description": "Full CRUD test product",
        "collections": ["test-crud"],
        "colors": ["Blue", "Green"],
        "sizes": ["S", "M", "L"],
        "images": []
    }
    
    try:
        # CREATE
        create_response = requests.post(f"{BASE_URL}/products", json=test_product, headers=headers, timeout=10)
        if create_response.status_code != 200:
            log_test("CRUD: Create product with valid token", False, f"Expected 200, got {create_response.status_code}: {create_response.text}")
            return
        
        created = create_response.json()
        product_id = created.get("id")
        slug = created.get("slug")
        
        if not product_id or not slug:
            log_test("CRUD: Create product with valid token", False, f"Missing id or slug in response: {created}")
            return
        
        log_test("CRUD: Create product with valid token", True, f"Created product with id={product_id}, slug={slug}")
        
        # FETCH by slug (public)
        fetch_response = requests.get(f"{BASE_URL}/products/{slug}", timeout=10)
        if fetch_response.status_code == 200:
            fetched = fetch_response.json()
            if fetched.get("title") == test_product["title"]:
                log_test("CRUD: Fetch product by slug", True, f"Fetched product matches created data")
            else:
                log_test("CRUD: Fetch product by slug", False, f"Fetched product data mismatch")
        else:
            log_test("CRUD: Fetch product by slug", False, f"Expected 200, got {fetch_response.status_code}")
        
        # UPDATE
        update_data = {
            "title": "CRUD Test Product UPDATED",
            "price": 3499,
            "compareAt": 4499,
            "fabric": "Premium Silk",
            "description": "Updated description",
            "collections": ["test-crud", "updated"],
            "colors": ["Blue", "Green", "Yellow"],
            "sizes": ["S", "M", "L", "XL"],
            "images": []
        }
        
        update_response = requests.put(f"{BASE_URL}/products/{product_id}", json=update_data, headers=headers, timeout=10)
        if update_response.status_code == 200:
            updated = update_response.json()
            if updated.get("title") == "CRUD Test Product UPDATED" and updated.get("price") == 3499:
                log_test("CRUD: Update product with valid token", True, f"Product updated successfully")
            else:
                log_test("CRUD: Update product with valid token", False, f"Update data mismatch: {updated}")
        else:
            log_test("CRUD: Update product with valid token", False, f"Expected 200, got {update_response.status_code}: {update_response.text}")
        
        # DELETE
        delete_response = requests.delete(f"{BASE_URL}/products/{product_id}", headers=headers, timeout=10)
        if delete_response.status_code == 200:
            delete_data = delete_response.json()
            if delete_data.get("ok") == True:
                log_test("CRUD: Delete product with valid token", True, f"Product deleted successfully")
            else:
                log_test("CRUD: Delete product with valid token", False, f"Delete response unexpected: {delete_data}")
        else:
            log_test("CRUD: Delete product with valid token", False, f"Expected 200, got {delete_response.status_code}: {delete_response.text}")
        
        # Verify deletion (should return 404)
        verify_response = requests.get(f"{BASE_URL}/products/{slug}", timeout=10)
        if verify_response.status_code == 404:
            log_test("CRUD: Verify product deleted", True, "Product no longer exists (404)")
        else:
            log_test("CRUD: Verify product deleted", False, f"Expected 404, got {verify_response.status_code}")
            
    except Exception as e:
        log_test("Full CRUD sanity test", False, f"Exception: {str(e)}")

def test_upload_no_auth():
    """Test 6a: POST /api/upload without auth"""
    try:
        # Create a small test image (1x1 PNG)
        test_image = BytesIO(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')
        files = {"file": ("test.png", test_image, "image/png")}
        
        response = requests.post(f"{BASE_URL}/upload", files=files, timeout=10)
        if response.status_code == 401:
            log_test("POST /api/upload without auth", True, "Returns 401")
        else:
            log_test("POST /api/upload without auth", False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("POST /api/upload without auth", False, f"Exception: {str(e)}")

def test_upload_malformed_token():
    """Test 6b: POST /api/upload with malformed token"""
    try:
        test_image = BytesIO(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')
        files = {"file": ("test.png", test_image, "image/png")}
        headers = {"Authorization": "Bearer xyz.abc.123"}
        
        response = requests.post(f"{BASE_URL}/upload", files=files, headers=headers, timeout=10)
        if response.status_code == 401:
            log_test("POST /api/upload with malformed token", True, "Returns 401 (not 500)")
        elif response.status_code == 500:
            log_test("POST /api/upload with malformed token", False, f"CRITICAL: Returns 500 (should be 401): {response.text}")
        else:
            log_test("POST /api/upload with malformed token", False, f"Expected 401, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("POST /api/upload with malformed token", False, f"Exception: {str(e)}")

def test_upload_valid_token(token):
    """Test 6c: POST /api/upload with valid token"""
    if not token:
        log_test("POST /api/upload with valid token", False, "No admin token available")
        return
    
    try:
        test_image = BytesIO(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')
        files = {"file": ("test.png", test_image, "image/png")}
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/upload", files=files, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "url" in data and data["url"].startswith("data:image"):
                log_test("POST /api/upload with valid token", True, f"Returns 200 with base64 data URI")
            else:
                log_test("POST /api/upload with valid token", False, f"200 but invalid response: {data}")
        else:
            log_test("POST /api/upload with valid token", False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("POST /api/upload with valid token", False, f"Exception: {str(e)}")

def main():
    print("=" * 80)
    print("RANISA BOUTIQUE BACKEND AUTH TESTING")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin credentials: {ADMIN_USERNAME} / {ADMIN_PASSWORD}")
    print("=" * 80)
    print()
    
    # Test 1 & 2: Admin login
    print("--- ADMIN LOGIN TESTS ---")
    admin_token = test_admin_login_valid()
    test_admin_login_invalid()
    print()
    
    # Test 3: Auth guards on protected endpoints
    print("--- AUTH GUARD TESTS (No Auth) ---")
    test_protected_endpoint_no_auth("/products", "POST")
    test_protected_endpoint_no_auth("/upload", "POST")
    print()
    
    print("--- AUTH GUARD TESTS (Malformed Token) ---")
    test_protected_endpoint_malformed_token("/products", "POST")
    test_protected_endpoint_malformed_token("/upload", "POST")
    print()
    
    # Test 4: Public GET endpoints
    print("--- PUBLIC GET TESTS ---")
    test_public_get_products()
    test_public_get_products_with_collection()
    test_slug = test_public_get_product_by_slug_existing()
    test_public_get_product_by_slug_nonexistent()
    print()
    
    # Test 5: Full CRUD sanity
    print("--- FULL CRUD SANITY TEST ---")
    test_full_crud_sanity(admin_token)
    print()
    
    # Test 6: Upload endpoint
    print("--- UPLOAD ENDPOINT TESTS ---")
    test_upload_no_auth()
    test_upload_malformed_token()
    test_upload_valid_token(admin_token)
    print()
    
    # Summary
    print("=" * 80)
    print(f"TEST SUMMARY: {passed} passed, {failed} failed out of {passed + failed} total")
    print("=" * 80)
    
    if failed > 0:
        print("\n❌ FAILED TESTS:")
        for result in test_results:
            if not result["success"]:
                print(f"  - {result['name']}: {result['details']}")
        sys.exit(1)
    else:
        print("\n✅ ALL TESTS PASSED!")
        sys.exit(0)

if __name__ == "__main__":
    main()
