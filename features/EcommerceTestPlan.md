# Rahul Shetty E-commerce Test Plan

## Application Overview

Detailed test plan for the Rahul Shetty e-commerce application covering authentication, dashboard, filters, product actions, cart, checkout, orders, and edge cases.

## Test Scenarios

### 1. Authentication and Navigation

**Seed:** `tests/seed.spec.js`

#### 1.1. Login with valid credentials

**File:** `tests/generated/login-valid.spec.ts`

**Steps:**
  1. Open the login page and enter the provided email and password
    - expect: The user is successfully logged in and redirected to the dashboard

#### 1.2. Login with invalid credentials

**File:** `tests/generated/login-invalid.spec.ts`

**Steps:**
  1. Enter an invalid password and submit the form
    - expect: An authentication error is shown and the user remains on the login page

#### 1.3. Logout

**File:** `tests/generated/logout.spec.ts`

**Steps:**
  1. Click Sign Out from the authenticated dashboard
    - expect: The user is returned to the login page

### 2. Dashboard and Filters

**Seed:** `tests/seed.spec.js`

#### 2.1. Browse products and verify catalog cards

**File:** `tests/generated/catalog.spec.ts`

**Steps:**
  1. Open the dashboard and inspect the product grid
    - expect: Product cards are visible with name, price, and action buttons

#### 2.2. Search for products

**File:** `tests/generated/search.spec.ts`

**Steps:**
  1. Use the search box with a known product name and a non-existing term
    - expect: Matching results appear for valid searches and an empty/none state appears for invalid searches

#### 2.3. Apply category and subcategory filters

**File:** `tests/generated/filters.spec.ts`

**Steps:**
  1. Select category and subcategory filters and apply them
    - expect: The visible product list updates to match the selected filters

#### 2.4. Apply price range filters

**File:** `tests/generated/price-filters.spec.ts`

**Steps:**
  1. Enter min and max price values and apply the filter
    - expect: Only products within the selected price range remain visible

### 3. Product Details and Cart

**Seed:** `tests/seed.spec.js`

#### 3.1. Open product details

**File:** `tests/generated/product-details.spec.ts`

**Steps:**
  1. Open a product from the catalog using the View button
    - expect: The product detail view displays the product information

#### 3.2. Add product to cart from catalog

**File:** `tests/generated/add-to-cart-catalog.spec.ts`

**Steps:**
  1. Add a product to the cart from the catalog
    - expect: The cart count increases and the product appears in the cart

#### 3.3. Add product to cart from detail page

**File:** `tests/generated/add-to-cart-detail.spec.ts`

**Steps:**
  1. Add a product to the cart from the detail page
    - expect: The selected product is added successfully to the cart

#### 3.4. Remove product from cart

**File:** `tests/generated/remove-from-cart.spec.ts`

**Steps:**
  1. Remove a product from the cart
    - expect: The cart updates and the item disappears from the list

### 4. Checkout and Orders

**Seed:** `tests/seed.spec.js`

#### 4.1. Proceed to checkout

**File:** `tests/generated/checkout.spec.ts`

**Steps:**
  1. Open the cart and click Checkout
    - expect: The checkout flow opens with the order summary and payment fields

#### 4.2. Place an order

**File:** `tests/generated/place-order.spec.ts`

**Steps:**
  1. Fill payment details, select a country, and submit the order
    - expect: The order is placed successfully and a confirmation state appears

#### 4.3. View order history

**File:** `tests/generated/orders.spec.ts`

**Steps:**
  1. Navigate to the Orders page
    - expect: Existing orders are visible in the orders table

#### 4.4. Delete an order

**File:** `tests/generated/delete-order.spec.ts`

**Steps:**
  1. Delete an existing order from the orders table
    - expect: The order is removed from the list

### 5. Edge Cases and Validation

**Seed:** `tests/seed.spec.js`

#### 5.1. Empty cart and checkout

**File:** `tests/generated/empty-cart.spec.ts`

**Steps:**
  1. Open the cart with no items and attempt to checkout
    - expect: The application handles the empty cart state correctly

#### 5.2. Invalid input handling

**File:** `tests/generated/validation.spec.ts`

**Steps:**
  1. Enter incomplete or invalid checkout data
    - expect: The form prevents invalid submission and shows the expected feedback

#### 5.3. Session and navigation resilience

**File:** `tests/generated/navigation-resilience.spec.ts`

**Steps:**
  1. Refresh and navigate through dashboard, cart, orders, and checkout
    - expect: The app remains consistent and the current session behaves correctly
