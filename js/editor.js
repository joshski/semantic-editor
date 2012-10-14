var highlighter;
var currentAnnotation;
    
window.onload = function() {
    rangy.init();
        
    highlighter = rangy.createHighlighter();
        
    highlighter.addCssClassApplier(rangy.createCssClassApplier("annotation", {
        ignoreWhiteSpace: true,
        elementTagName: "a",
        elementProperties: { href: "#", onclick: onClickAnnotation }
    }));
        
    var data = {items: [
      {value: "21", name: "Theme: US Economy to slow"},
      {value: "43", name: "Theme: US Recovery slow"},
      {value: "46", name: "View: US Economy GIS Flat 6 Months"},
      {value: "54", name: "View: US Economy GIS Flat 3 Months"},
      {value: "55", name: "Trade: US Technology"}
    ]};
        
    $("#entityLookup").autoSuggest(data.items,
      {
        startText: "",
        selectedItemProp: "name",
        searchObjProps: "name",
        matchCase: false,
        neverSubmit: true,
        selectionLimit: 1,
        selectionAdded: function(elem) {
          $("#sidebar").hide();
          $(currentAnnotation).find("label.open-annotation").html($(elem).text().substr(1))
        }
      });
          
    $(document).bind('keydown', 'ctrl+t', function() {
      currentAnnotation = annotateSelectedText();
      $(".as-close").click();
      $("#sidebar").show();
      $(".as-input").focus().val("Theme: ");
    });
};
    
function onClickAnnotation() {
        
    if (window.confirm("Delete this annotation?")) {
        $(this).html($(this).children('span').html());
        var highlight = highlighter.getHighlightForElement(this);
        highlighter.removeHighlights( [highlight] );
    }
    return false;
}

function annotateSelectedText() {
    var newHighlights = highlighter.highlightSelection("annotation");
    var anchor = newHighlights[0].range.startContainer; 
    anchor.innerHTML = "<label class='open-annotation'></label><span class='annotated-contents'>" + anchor.innerHTML + "</span><label class='close-annotation'>&nbsp;</label>";
    //alert("Created " + newHighlights.length + " annotations");
    return anchor;
}