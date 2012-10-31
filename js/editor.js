((function() {
    var self = this;
    var tagExpression, findAnnotationsIn, findTagsIn, eachOpeningTagIn, findClosingTagAfterInWith, cleanBetweenAnd;
    window.editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/semarkdown");
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(false);
    tagExpression = /\{\/?([^\{\}]+)\}/g;
    findAnnotationsIn = function(text) {
        var tags, annotations;
        tags = findTagsIn(text);
        annotations = [];
        eachOpeningTagIn(tags, function(opening, i) {
            return findClosingTagAfterInWith(i, tags, opening.key, function(closing) {
                return annotations.push({
                    key: opening.key,
                    text: cleanBetweenAnd(text, opening.index, closing.index),
                    openingTag: opening,
                    closingTag: closing
                });
            });
        });
        return annotations;
    };
    findTagsIn = function(text) {
        var tags, match;
        tags = [];
        while (match = tagExpression.exec(text)) {
            tags.push({
                text: match[0],
                key: match[1],
                index: match.index,
                closing: match[0].indexOf("/") === 1
            });
        }
        return tags;
    };
    eachOpeningTagIn = function(tags, foundWithIndex) {
        var i;
        for (i = 0; i < tags.length; i = i + 1) {
            if (!tags[i].closing) {
                foundWithIndex(tags[i], i);
            }
        }
    };
    findClosingTagAfterInWith = function(i, tags, key, found) {
        var j;
        for (j = i + 1; j < tags.length; j = j + 1) {
            if (tags[j].closing && tags[j].key === key) {
                found(tags[j]);
                break;
            }
        }
    };
    cleanBetweenAnd = function(text, startIndex, endIndex) {
        return text.substring(startIndex, endIndex).replace(tagExpression, " ").replace(/\s+/g, " ").trim();
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
            openingPosition = rowAndColumnFor(ann.openingTag.index + ann.text.length);
            closingPosition = rowAndColumnFor(ann.closingTag.index);
            editor.clearSelection();
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