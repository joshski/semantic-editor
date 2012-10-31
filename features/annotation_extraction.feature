Feature: Annotation Extraction

  Scenario: One closed annotation, one key
    Given the following document:
      """
      The {foo} quick {/foo} brown fox
      """
    Then the following annotations should be recongised:
      | key | text  |
      | foo | quick |
  
  Scenario: Overlapping closed annotations with different keys
    Given the following document:
      """
      {baz} The {foo} {bar} quick {/bar} brown {/baz} fox {/foo}
      """
    Then the following annotations should be recongised:
      | key | text            |
      | baz | The quick brown |
      | foo | quick brown fox |
      | bar | quick           |
  
  @wip
  Scenario: Overlapping annotations with reused keys
    Given the following document:
      """
      {foo} The {foo} quick brown {/foo} fox {/foo}
      """
    Then the following annotations should be recongised:
      | key | text                |
      | foo | quick brown         |
      | foo | The quick brown fox |
