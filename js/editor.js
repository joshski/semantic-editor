((function() {
    var self = this;
    var reg, cleanBetweenAnd, findAnnotationsIn;
    window.editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/semarkdown");
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(false);
    reg = /\{[^\{\}]+\}/g;
    cleanBetweenAnd = function(text, startIndex, endIndex) {
        console.log(startIndex, endIndex);
        return text.substring(startIndex, endIndex).replace(reg, " ").replace(/\s+/g, " ").trim();
    };
    findAnnotationsIn = function(text) {
        var tags, matches, annotations, i, closingTagText, j;
        tags = [];
        while (matches = reg.exec(text)) {
            tags.push({
                text: matches[0],
                index: matches.index
            });
        }
        annotations = [];
        for (i = 0; i < tags.length; i = i + 1) {
            if (tags[i].text.indexOf("{/") === -1) {
                closingTagText = tags[i].text.replace("{", "{/");
                for (j = i + 1; j < tags.length; j = j + 1) {
                    if (tags[j].text === closingTagText) {
                        annotations.push({
                            key: tags[i].text.replace(/\{|\}/g, ""),
                            text: cleanBetweenAnd(text, tags[i].index, tags[j].index),
                            openingTag: tags[i],
                            closingTag: tags[j]
                        });
                        break;
                    }
                }
            }
        }
        return annotations;
    };
    window.AnnotationController = function($scope) {
        var self = this;
        var rowAndColumnFor, inferAnnotationsFromEditor;
        $scope.annotations = [];
        rowAndColumnFor = function(index) {
            var lines, total, row, gen1_forResult;
            lines = editor.getSession().doc.$lines;
            total = 0;
            for (row = 0; row < lines.length; row = row + 1) {
                gen1_forResult = void 0;
                if (function(row) {
                    var lineLength;
                    lineLength = lines[row].length;
                    if (total + lineLength > index) {
                        gen1_forResult = {
                            row: row,
                            column: index - total
                        };
                        return true;
                    }
                    total = total + lineLength + 1;
                }(row)) {
                    return gen1_forResult;
                }
            }
            return false;
        };
        $scope.selectAnnotation = function(ann) {
            var self = this;
            var openingPosition, closingPosition;
            editor.clearSelection();
            openingPosition = rowAndColumnFor(ann.openingTag.index + ann.key.length + 2);
            closingPosition = rowAndColumnFor(ann.closingTag.index);
            editor.moveCursorTo(openingPosition.row, openingPosition.column);
            editor.getSession().selection.selectTo(closingPosition.row, closingPosition.column);
            editor.centerSelection();
            return false;
        };
        inferAnnotationsFromEditor = function() {
            return $scope.annotations = findAnnotationsIn(editor.getValue());
        };
        inferAnnotationsFromEditor();
        return editor.on("change", function() {
            inferAnnotationsFromEditor();
            $scope.$digest();
            return false;
        });
    };
})).call(this);