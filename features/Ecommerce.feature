Feature: Ecommerce Validations 

@Regression
Scenario Outline: Placing the order
    Given a login to Ecommerce application with "<email>" and "<password>"
    When Add "ZARA COAT 3" to the cart
    When Proceed to checkout and fill the details with "<cardNumber>","<cvv>","<country>"
    Then Verify the order is placed successfully

    Examples:
      | email                        | password       | productName   | cardNumber          | cvv | country |
      | ganeshplaywright@gmail.com    | 9731@Ganesh    | ZARA COAT 3   | 4542 9931 9292 2293 | 123 | India   |