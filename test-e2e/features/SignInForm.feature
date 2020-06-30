Feature: SignInFrom

  Scenario Outline: The e-mail field is required and accepts only e-mail addresses
    Given I visit /
    And the demo data is loaded
    When I enter into the email field: <EMAIL>
    And I press the Sign In button
    Then The email field's error message is: <MESSAGE>

    Examples:

      | EMAIL        | MESSAGE                |
      |              | email must be an email |
      | user         | email must be an email |
      | user@        | email must be an email |
      | user@example | email must be an email |

  Scenario Outline: The password field is required and the minimum password length is 8 characters
    Given I visit /
    And the demo data is loaded
    When I enter into the password field: <PASSWORD>
    And I press the Sign In button
    Then The password field's error message is: <MESSAGE>

    Examples:

      | PASSWORD | MESSAGE                                               |
      |          | Password is too short, minimum length is 8 characters |
      | 123      | Password is too short, minimum length is 8 characters |
      | 1234567  | Password is too short, minimum length is 8 characters |

  Scenario: The user tries to log in with an e-mail address, that is not in the database
    Given I visit /
    And the demo data is loaded
    When I enter into the email field: NonExistingUser@example.com
    And I enter into the password field: 12345678
    And I press the Sign In button
    Then I should see an error notice, it's text is: Invalid email or password
