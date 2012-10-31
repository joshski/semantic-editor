require 'rack'
require 'capybara/cucumber'

static_root = File.expand_path(File.join(File.dirname(__FILE__), '..', '..', '..'))
puts static_root

app = Rack::Builder.app do
  use Rack::Static, :urls => [""], :root => static_root, :index => 'index.html'
  run lambda { |env| [200, {'Content-Type' => 'text/plain'}, 'OK'] }
end

Capybara.default_driver = :selenium
Capybara.app = app