use Rack::Static, :urls => [""], :root => '.', :index => 'index.html'

# Run your own Rack app here or use this one to serve 404 messages:
run lambda{ |env| [ 404, { 'Content-Type'  => 'text/html' }, ['404 - page not found'] ] }