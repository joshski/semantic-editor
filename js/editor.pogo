window.editor = ace.edit "editor"

editor.get session().set mode "ace/mode/semarkdown"
editor.get session().set use wrap mode(true)
editor.set show print margin (false)
editor.set highlight active line (false)

reg = r/\{[^\{\}]+\}/g

clean (text) between (start index) and (end index) =
  console.log(start index, end index)
  text.substring(start index, end index).replace(reg, ' ').replace(r/\s+/g, ' ').trim()

find annotations in (text) =
  tags = []
  while (matches = reg.exec(text))
    tags.push { text = matches.0, index = matches.index }
  
  annotations = []
  for (i = 0, i < tags.length, i = i + 1)
    if (tags.(i).text.index of('{/') == -1)
      closing tag text = tags.(i).text.replace('{', '{/')
      for (j = i + 1, j < tags.length, j = j + 1)
        if (tags.(j).text == closing tag text)
          annotations.push {
            key = tags.(i).text.replace (r/\{|\}/g, '')
            text = clean (text) between (tags.(i).index) and (tags.(j).index)
            opening tag = tags.(i)
            closing tag = tags.(j)
          }
          break

  annotations

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
    editor.clear selection()
    opening position = row and column for (ann.opening tag.index + ann.key.length + 2)
    closing position = row and column for (ann.closing tag.index)
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