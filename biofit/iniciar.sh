#!/bin/sh
cd "$(dirname "$0")"
echo "Gym CRM Biofit em http://localhost:8080"
(sleep 1; xdg-open http://localhost:8080 2>/dev/null || open http://localhost:8080 2>/dev/null) &
python3 -m http.server 8080
