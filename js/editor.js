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
    
    function hideLookup() {
      $('#themeLookup, #viewLookup, #tradeLookup, #allocationLookup').hide();
    }
        
    function bindLookup(type, items) {
      $('#' + type + 'Button').click(function() {
        currentAnnotation = annotateSelectedText();
        hideLookup();
        $('#' + type + 'Lookup').show();
        $('.as-input').focus();
      });
      $('#' + type + 'LookupText').autoSuggest(items,
        {
          startText: "",
          selectedItemProp: "name",
          searchObjProps: "name",
          matchCase: false,
          neverSubmit: true,
          selectionLimit: 1,
          selectionAdded: function(elem) {
            $(currentAnnotation).find("label.open-annotation").html(type + ':' + $(elem).text().substr(1))
            $(".as-close").click();
            hideLookup();
          }
        });
    }
    
    bindLookup("theme", [
      {value: "21", name: "US Economy to slow"},
      {value: "43", name: "US Recovery slow"}
    ]);

    bindLookup("view", [
      {value: "46", name: "US Economy GIS Flat 6 Months"},
      {value: "54", name: "US Economy GIS Flat 3 Months"}
    ]);
    
    bindLookup("trade", [
      {value: "55", name: "US Technology"}
    ]);
      
    bindLookup("allocation", [
      {value: "55", name: "US Technology Allocation"}
    ]);    
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
    return anchor;
}