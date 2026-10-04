from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import threading
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
HOST = "127.0.0.1"
PORT = 8000
URL = f"http://{HOST}:{PORT}/"

print(f"Serving Civilius site from: {ROOT}")
print(f"Open: {URL}")
print("Press Ctrl+C to stop.\n")

threading.Timer(0.6, lambda: webbrowser.open(URL)).start()
try:
    ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler).serve_forever()
except KeyboardInterrupt:
    print("\nStopped.")
