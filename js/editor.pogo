window.editor = ace.edit "editor"

editor.get session().set mode "ace/mode/semarkdown"
editor.get session().set use wrap mode(true)
editor.set show print margin (false)
editor.set highlight active line (false)

tag expression = r/\{\/?([^\{\}]+)\}/g

find annotations in (text) =
  tags = find tags in (text)
  annotations = []
  each opening tag in (tags) @(opening, i)
    find closing tag after (i) in (tags) with (opening.key) @(closing)
      annotations.push {
        key = opening.key
        text = clean (text) between (opening.index) and (closing.index)
        opening tag = opening
        closing tag = closing
      }

  annotations

find tags in (text) =
  tags = []
  while (match = tag expression.exec(text))
    tags.push {
      text = match.0
      key = match.1
      index = match.index
      closing = match.0.index of '/' == 1
    }
  
  tags

each opening tag in (tags) (found with index) =
  for (i = 0, i < tags.length, i = i + 1)
    if (!tags.(i).closing)
      found with index (tags.(i), i)

find closing tag after (i) in (tags) with (key) (found) =
  for (j = i + 1, j < tags.length, j = j + 1)
    if ((tags.(j).closing) && (tags.(j).key == key))
      found (tags.(j))
      break

clean (text) between (start index) and (end index) =
  text.substring(start index, end index).replace(tag expression, ' ').replace(r/\s+/g, ' ').trim()

window.AnnotationController ($scope) =
  
  $scope.annotations = []
  
  row and column for (index) =
    lines = editor.get session().doc.$lines
    total = 0
    for (row = 0, row < lines.length, row = row + 1)
      line length = lines.(row).length
      if ((total + line length) > index)
        return { row = row, column = index - total }
      
      total = total + line length + 1
    
    false
  
  $scope.select annotation (ann) =
    opening position = row and column for (ann.opening tag.index + ann.text.length)
    closing position = row and column for (ann.closing tag.index)
    
    editor.clear selection()
    editor.move cursor to (opening position.row, opening position.column)
    editor.get session().selection.select to (closing position.row, closing position.column)
    editor.center selection()
    false
  
  infer annotations from editor () =
    $scope.annotations = find annotations in (editor.get value())
  
  infer annotations from editor ()
  
  editor.on "change"
    infer annotations from editor ()
    $scope.$digest()
    false