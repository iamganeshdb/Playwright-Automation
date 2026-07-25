Feature: Ecommerce Validations 

Scenario: Placing the order
    Given a login to Ecommerce application with "anshika@gmail.com" and "9731@Ganesh"
    When Add "ZARA COAT 3" to the cart
    When Proceed to checkout and fill the details with "4542 9931 9292 2293","123","India"
    Then Verify the order is placed successfully