var editor = ace.edit("editor");

editor.getSession().setMode("ace/mode/semarkdown");
editor.getSession().setUseWrapMode(true);
editor.setShowPrintMargin(false);
editor.setHighlightActiveLine(false);


function AnnotationController($scope) {
  
  $scope.annotations = [];
  
  function findAnnotationsIn(text) {
    var reg = /\{[^\{\}]+\}/g,
        matches,
        tags = [];
    while (matches = reg.exec(text)) {
      tags.push({ text: matches[0], index: matches.index }); 
    }
    var annotations = [];
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].text.indexOf('{/') == -1) {
        var closingTagText = tags[i].text.replace('{', '{/');
        for (var j = i + 1; j < tags.length; j++) {
          if (tags[j].text == closingTagText) {
            annotations.push({
              key: tags[i].text.replace(/\{|\}/g, ''),
              text: text.substring(tags[i].index, tags[j].index)
                        .replace(reg, ' ')
                        .replace(/\s+/g, ' ')
                        .trim(),
              openingTag: tags[i],
              closingTag: tags[j]
            });
            break;
          }
        }
      }
    }
    return annotations;
  }
  
  function rowAndColumnForIndex(index) {
    var lines = editor.getSession().doc.$lines;
    var total = 0;
    for (var row = 0; row < lines.length; row++) {
      var lineLength = lines[row].length;
      if (total + lineLength > index) {
        return { row: row, column: index - total }
      }
      total += lineLength + 1;
    }
    return false;
  }
  
  $scope.selectAnnotation = function(ann) {
    editor.clearSelection();
    var openingTagPosition = rowAndColumnForIndex(ann.openingTag.index + ann.key.length + 2);
    var closingTagPosition = rowAndColumnForIndex(ann.closingTag.index);
    editor.moveCursorTo(openingTagPosition.row, openingTagPosition.column);
    editor.getSession().selection.selectTo(closingTagPosition.row, closingTagPosition.column);
    editor.centerSelection();
    return false;
  }
  
  $scope.annotations = findAnnotationsIn(editor.getValue());
  
  editor.on("change", function(e) {
    $scope.annotations = findAnnotationsIn(editor.getValue());
    $scope.$digest();
    return false;
  });
}