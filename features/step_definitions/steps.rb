Given /^the following document:$/ do |string|
  visit '/'
  page.execute_script "editor.setValue(#{string.to_json})"
end

Then /^the following annotations should be recongised:$/ do |table|
  recognised_annotations = all(".annotation").map do |a|
    {
      "key" => a.find(".key").text.gsub(/\{|\}/, ""),
      "text" => a.find(".text").text
    }
  end
  table.diff! recognised_annotations
end

When /^I select the annotation "(.*?)"$/ do |key|
  within "#annotations" do
    click_on "{#{key}}"
  end
end

Then /^the text "(.*?)" should be selected$/ do |expected_selection|
  selected_text = page.execute_script "return editor.session.getTextRange(editor.getSelectionRange());"
  selected_text.should == expected_selection
end