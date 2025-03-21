import http.server
import socketserver
import os

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if not os.path.exists(self.path[1:]) and not self.path.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg')):
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

PORT = 8000

with socketserver.ThreadingTCPServer(("", PORT), SPAHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()