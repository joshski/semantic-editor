Feature: Selecting Annotations
  Scenario: Choose annotation from index
    Given the following document:
      """
      The {foo} quick {/foo} brown fox
      """
    When I select the annotation "foo"
    Then the text " quick " should be selected