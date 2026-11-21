Feature: Ecommerce user journeys

  Scenario: A valid login displays the product catalog
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    Then the product catalog is displayed

  Scenario: Invalid credentials are rejected
    When I attempt to login with "invalid-user@example.com" and "invalid-password"
    Then an authentication error is displayed

  Scenario: A user can sign out
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I sign out
    Then I am returned to the login page

  Scenario: A product can be added to the cart
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When Add "ZARA COAT 3" to the cart
    Then "ZARA COAT 3" is visible in the cart

  @Regression
  Scenario Outline: Placing the order
    Given a login to Ecommerce application with "<email>" and "<password>"
    When Add "<productName>" to the cart
    When Proceed to checkout and fill the details with "<cardNumber>","<cvv>","<country>"
    Then Verify the order is placed successfully

    Examples:
      | email                     | password      | productName | cardNumber          | cvv | country |
      | ganeshplaywright@gmail.com | 9731@Ganesh   | ZARA COAT 3 | 4542 9931 9292 2293 | 123 | India   |

  Scenario: Product cards show catalog details and actions
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    Then each catalog product shows its name, price, and actions

  Scenario: Search finds products and displays an empty state
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I search the catalog for "ZARA COAT 3"
    Then only "ZARA COAT 3" is shown in the catalog
    When I search the catalog for "no-product-match-xyz"
    Then the no-products state is displayed

  Scenario: Category and subcategory filters update the catalog
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I filter the catalog by category "electronics" and subcategory "mobiles"
    Then only "iphone 13 pro" is shown in the catalog

  Scenario: Price filters update the catalog
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I filter the catalog to prices between "10000" and "20000"
    Then products within that price range are shown

  Scenario: Product details show the selected product
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I open the details for "ZARA COAT 3"
    Then the product details show its name, price, and cart action

  Scenario: A product can be added to the cart from its details
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I open the details for "ZARA COAT 3" and add it to the cart
    Then "ZARA COAT 3" is visible in the cart

  Scenario: A product can be removed from the cart
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When Add "ZARA COAT 3" to the cart
    When I remove the product from the cart
    Then the empty cart state is displayed and checkout is unavailable

  Scenario: Checkout displays the order summary and payment fields
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When Add "ZARA COAT 3" to the cart
    When I proceed to checkout
    Then the checkout summary and payment fields are displayed

  Scenario: The orders page displays order history
    Given a deterministic test order is returned by order history
    And a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I open the orders page
    Then the deterministic test order and its actions are displayed

  Scenario: An order can be deleted without changing live account data
    Given a deterministic deletable order is returned by order history
    And a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I open the orders page
    When I delete the deterministic test order
    Then the test order is removed and the delete request was intercepted

  Scenario: An empty cart prevents checkout
    Given a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I open the cart
    Then the empty cart state is displayed and checkout is unavailable

  Scenario: Invalid checkout data shows request error feedback
    Given order submissions are intercepted
    And a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When Add "ZARA COAT 3" to the cart
    When I submit invalid payment details and select "India"
    Then the order request error is displayed without placing an order

  Scenario: The session survives refresh and e-commerce navigation
    Given a deterministic test order is returned by order history
    And a login to Ecommerce application with "ganeshplaywright@gmail.com" and "9731@Ganesh"
    When I refresh the current page
    Then the product catalog is displayed
    When Add "ZARA COAT 3" to the cart
    Then "ZARA COAT 3" is visible in the cart
    When I refresh the current page
    Then "ZARA COAT 3" is visible in the cart
    When I proceed to checkout
    Then the checkout summary and payment fields are displayed
    When I open the orders page
    Then the deterministic test order and its actions are displayed