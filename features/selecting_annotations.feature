Feature: Selecting Annotations

  Scenario: Choosing annotations from an index
    Given the following document:
      """
      The {foo} {bar} quick {/foo} brown {/bar} fox
      """
    When I select the annotation "foo"
    Then the text " {bar} quick " should be selected
    When I select the annotation "bar"
    Then the text " quick {/foo} brown " should be selected