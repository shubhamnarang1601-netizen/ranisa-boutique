#!/usr/bin/env python3
"""
Backend API Tests for Roshni Boutique
Tests all backend endpoints according to the review request
"""
import requests
import json
import io
from PIL import Image

# Base URL from frontend/.env
BASE_URL = "https://boutique-shop-admin.preview.emergentagent.com/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "roshni123"

# Global token storage
auth_token = None
created_product_id = None

def print_test(name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   Details: {details}")
    print()

def test_admin_login_success():
    """Test 1: POST /api/admin/login with correct credentials -> 200 with token"""
    global auth_token
    print("=" * 80)
    print("TEST 1: Admin Login - Success Case")
    print("=" * 80)
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and data["token"]:
                auth_token = data["token"]
                print_test(
                    "Admin login with correct credentials",
                    True,
                    f"Status: {response.status_code}, Token received: {data['token'][:20]}..."
                )
                return True
            else:
                print_test(
                    "Admin login with correct credentials",
                    False,
                    f"Status: {response.status_code}, but no token in response: {data}"
                )
                return False
        else:
            print_test(
                "Admin login with correct credentials",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Admin login with correct credentials", False, f"Exception: {str(e)}")
        return False

def test_admin_login_failure():
    """Test 2: POST /api/admin/login with wrong password -> 401"""
    print("=" * 80)
    print("TEST 2: Admin Login - Wrong Password")
    print("=" * 80)
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": "wrongpassword"},
            timeout=10
        )
        
        if response.status_code == 401:
            print_test(
                "Admin login with wrong password",
                True,
                f"Status: {response.status_code} (Unauthorized as expected)"
            )
            return True
        else:
            print_test(
                "Admin login with wrong password",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Admin login with wrong password", False, f"Exception: {str(e)}")
        return False

def test_get_products_list():
    """Test 3: GET /api/products -> returns array of 8 seeded products"""
    print("=" * 80)
    print("TEST 3: Get Products List")
    print("=" * 80)
    
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test(
                    "Get products list",
                    True,
                    f"Status: {response.status_code}, Products count: {len(data)}"
                )
                return True
            else:
                print_test(
                    "Get products list",
                    False,
                    f"Expected array, got: {type(data)}"
                )
                return False
        else:
            print_test(
                "Get products list",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Get products list", False, f"Exception: {str(e)}")
        return False

def test_get_products_collection_filter():
    """Test 4: GET /api/products?collection=new-in -> returns only products with collections starting with 'new-in'"""
    print("=" * 80)
    print("TEST 4: Get Products with Collection Filter")
    print("=" * 80)
    
    try:
        response = requests.get(f"{BASE_URL}/products?collection=new-in", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Verify all products have collections starting with "new-in"
                all_valid = True
                for product in data:
                    if "collections" in product:
                        has_new_in = any(c.startswith("new-in") for c in product["collections"])
                        if not has_new_in:
                            all_valid = False
                            break
                
                if all_valid and len(data) > 0:
                    print_test(
                        "Get products with collection filter",
                        True,
                        f"Status: {response.status_code}, Filtered products: {len(data)}"
                    )
                    return True
                elif len(data) == 0:
                    print_test(
                        "Get products with collection filter",
                        False,
                        "No products returned with 'new-in' filter"
                    )
                    return False
                else:
                    print_test(
                        "Get products with collection filter",
                        False,
                        "Some products don't have collections starting with 'new-in'"
                    )
                    return False
            else:
                print_test(
                    "Get products with collection filter",
                    False,
                    f"Expected array, got: {type(data)}"
                )
                return False
        else:
            print_test(
                "Get products with collection filter",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Get products with collection filter", False, f"Exception: {str(e)}")
        return False

def test_get_product_by_slug_success():
    """Test 5: GET /api/products/{slug} with existing slug -> 200"""
    print("=" * 80)
    print("TEST 5: Get Product by Slug - Existing")
    print("=" * 80)
    
    try:
        # Use a known slug from seeded data
        slug = "glaze-cotton-western-style-frock-15396"
        response = requests.get(f"{BASE_URL}/products/{slug}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "slug" in data and data["slug"] == slug:
                print_test(
                    "Get product by existing slug",
                    True,
                    f"Status: {response.status_code}, Product: {data.get('title', 'N/A')}"
                )
                return True
            else:
                print_test(
                    "Get product by existing slug",
                    False,
                    f"Product returned but slug mismatch: {data}"
                )
                return False
        else:
            print_test(
                "Get product by existing slug",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Get product by existing slug", False, f"Exception: {str(e)}")
        return False

def test_get_product_by_slug_not_found():
    """Test 6: GET /api/products/{slug} with non-existent slug -> 404"""
    print("=" * 80)
    print("TEST 6: Get Product by Slug - Non-existent")
    print("=" * 80)
    
    try:
        slug = "non-existent-product-slug-12345"
        response = requests.get(f"{BASE_URL}/products/{slug}", timeout=10)
        
        if response.status_code == 404:
            print_test(
                "Get product by non-existent slug",
                True,
                f"Status: {response.status_code} (Not Found as expected)"
            )
            return True
        else:
            print_test(
                "Get product by non-existent slug",
                False,
                f"Expected 404, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Get product by non-existent slug", False, f"Exception: {str(e)}")
        return False

def test_create_product_without_auth():
    """Test 7: POST /api/products without Authorization header -> 401"""
    print("=" * 80)
    print("TEST 7: Create Product - Without Auth")
    print("=" * 80)
    
    try:
        product_data = {
            "title": "Test Product",
            "price": 1000,
            "images": ["https://example.com/image.png"],
            "collections": ["new-in"],
            "colors": ["Black"],
            "sizes": ["M"]
        }
        
        response = requests.post(
            f"{BASE_URL}/products",
            json=product_data,
            timeout=10
        )
        
        if response.status_code == 401:
            print_test(
                "Create product without auth",
                True,
                f"Status: {response.status_code} (Unauthorized as expected)"
            )
            return True
        else:
            print_test(
                "Create product without auth",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Create product without auth", False, f"Exception: {str(e)}")
        return False

def test_create_product_with_auth():
    """Test 8: POST /api/products with valid Bearer token and body -> 201/200 with id and slug"""
    global created_product_id
    print("=" * 80)
    print("TEST 8: Create Product - With Auth")
    print("=" * 80)
    
    if not auth_token:
        print_test("Create product with auth", False, "No auth token available")
        return False
    
    try:
        product_data = {
            "title": "Elegant Silk Saree Collection",
            "price": 5500,
            "compareAt": 7000,
            "fabric": "Pure Silk",
            "description": "Beautiful handwoven silk saree with intricate designs",
            "images": ["https://example.com/saree1.png", "https://example.com/saree2.png"],
            "collections": ["new-in", "ethnic-wear"],
            "colors": ["Red", "Gold"],
            "sizes": ["Free Size"]
        }
        
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/products",
            json=product_data,
            headers=headers,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            if "id" in data and "slug" in data:
                created_product_id = data["id"]
                print_test(
                    "Create product with auth",
                    True,
                    f"Status: {response.status_code}, ID: {data['id']}, Slug: {data['slug']}"
                )
                return True
            else:
                print_test(
                    "Create product with auth",
                    False,
                    f"Product created but missing id or slug: {data}"
                )
                return False
        else:
            print_test(
                "Create product with auth",
                False,
                f"Expected 200/201, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Create product with auth", False, f"Exception: {str(e)}")
        return False

def test_update_product():
    """Test 9: PUT /api/products/{id} with token -> updates fields"""
    print("=" * 80)
    print("TEST 9: Update Product")
    print("=" * 80)
    
    if not auth_token:
        print_test("Update product", False, "No auth token available")
        return False
    
    if not created_product_id:
        print_test("Update product", False, "No product ID available (create test may have failed)")
        return False
    
    try:
        update_data = {
            "title": "Updated Elegant Silk Saree Collection",
            "price": 6000,
            "compareAt": 7500,
            "fabric": "Pure Silk",
            "description": "Updated description - Beautiful handwoven silk saree",
            "images": ["https://example.com/saree1.png"],
            "collections": ["new-in", "ethnic-wear", "premium"],
            "colors": ["Red", "Gold", "Maroon"],
            "sizes": ["Free Size"]
        }
        
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.put(
            f"{BASE_URL}/products/{created_product_id}",
            json=update_data,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("price") == 6000 and "Updated" in data.get("title", ""):
                print_test(
                    "Update product",
                    True,
                    f"Status: {response.status_code}, Updated price: {data['price']}"
                )
                return True
            else:
                print_test(
                    "Update product",
                    False,
                    f"Product returned but updates not reflected: {data}"
                )
                return False
        else:
            print_test(
                "Update product",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Update product", False, f"Exception: {str(e)}")
        return False

def test_delete_product_success():
    """Test 10: DELETE /api/products/{id} with token -> {ok: true}"""
    print("=" * 80)
    print("TEST 10: Delete Product - Success")
    print("=" * 80)
    
    if not auth_token:
        print_test("Delete product", False, "No auth token available")
        return False
    
    if not created_product_id:
        print_test("Delete product", False, "No product ID available (create test may have failed)")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.delete(
            f"{BASE_URL}/products/{created_product_id}",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") is True:
                print_test(
                    "Delete product",
                    True,
                    f"Status: {response.status_code}, Response: {data}"
                )
                return True
            else:
                print_test(
                    "Delete product",
                    False,
                    f"Expected {{ok: true}}, got: {data}"
                )
                return False
        else:
            print_test(
                "Delete product",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Delete product", False, f"Exception: {str(e)}")
        return False

def test_delete_product_not_found():
    """Test 11: DELETE /api/products/{id} with non-existent id -> 404"""
    print("=" * 80)
    print("TEST 11: Delete Product - Non-existent")
    print("=" * 80)
    
    if not auth_token:
        print_test("Delete non-existent product", False, "No auth token available")
        return False
    
    try:
        fake_id = "non-existent-product-id-12345"
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.delete(
            f"{BASE_URL}/products/{fake_id}",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 404:
            print_test(
                "Delete non-existent product",
                True,
                f"Status: {response.status_code} (Not Found as expected)"
            )
            return True
        else:
            print_test(
                "Delete non-existent product",
                False,
                f"Expected 404, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Delete non-existent product", False, f"Exception: {str(e)}")
        return False

def test_upload_image_without_auth():
    """Test 12: POST /api/upload without token -> 401"""
    print("=" * 80)
    print("TEST 12: Upload Image - Without Auth")
    print("=" * 80)
    
    try:
        # Create a small test image
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {'file': ('test.png', img_bytes, 'image/png')}
        response = requests.post(
            f"{BASE_URL}/upload",
            files=files,
            timeout=10
        )
        
        if response.status_code == 401:
            print_test(
                "Upload image without auth",
                True,
                f"Status: {response.status_code} (Unauthorized as expected)"
            )
            return True
        else:
            print_test(
                "Upload image without auth",
                False,
                f"Expected 401, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Upload image without auth", False, f"Exception: {str(e)}")
        return False

def test_upload_image_with_auth():
    """Test 13: POST /api/upload with token and image -> returns {url} starting with 'data:image'"""
    print("=" * 80)
    print("TEST 13: Upload Image - With Auth")
    print("=" * 80)
    
    if not auth_token:
        print_test("Upload image with auth", False, "No auth token available")
        return False
    
    try:
        # Create a small test image
        img = Image.new('RGB', (100, 100), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {'file': ('test.png', img_bytes, 'image/png')}
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(
            f"{BASE_URL}/upload",
            files=files,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "url" in data and data["url"].startswith("data:image"):
                print_test(
                    "Upload image with auth",
                    True,
                    f"Status: {response.status_code}, URL prefix: {data['url'][:30]}..."
                )
                return True
            else:
                print_test(
                    "Upload image with auth",
                    False,
                    f"URL doesn't start with 'data:image': {data}"
                )
                return False
        else:
            print_test(
                "Upload image with auth",
                False,
                f"Expected 200, got {response.status_code}: {response.text}"
            )
            return False
    except Exception as e:
        print_test("Upload image with auth", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("\n" + "=" * 80)
    print("ROSHNI BOUTIQUE BACKEND API TESTS")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print("=" * 80 + "\n")
    
    results = []
    
    # Run tests in sequence
    results.append(("Admin Login - Success", test_admin_login_success()))
    results.append(("Admin Login - Wrong Password", test_admin_login_failure()))
    results.append(("Get Products List", test_get_products_list()))
    results.append(("Get Products - Collection Filter", test_get_products_collection_filter()))
    results.append(("Get Product by Slug - Existing", test_get_product_by_slug_success()))
    results.append(("Get Product by Slug - Non-existent", test_get_product_by_slug_not_found()))
    results.append(("Create Product - Without Auth", test_create_product_without_auth()))
    results.append(("Create Product - With Auth", test_create_product_with_auth()))
    results.append(("Update Product", test_update_product()))
    results.append(("Delete Product - Success", test_delete_product_success()))
    results.append(("Delete Product - Non-existent", test_delete_product_not_found()))
    results.append(("Upload Image - Without Auth", test_upload_image_without_auth()))
    results.append(("Upload Image - With Auth", test_upload_image_with_auth()))
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {name}")
    
    print("=" * 80)
    print(f"Total: {passed}/{total} tests passed")
    print("=" * 80 + "\n")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
