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