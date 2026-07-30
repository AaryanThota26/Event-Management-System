#!/bin/bash
# Auth test script - test approve/reject endpoints

# Login
echo "=== Login ==="
USER_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@test.com","password":"password123"}' | python -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
echo "User token: ${USER_TOKEN:0:20}..."

ORG_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testorg@test.com","password":"password123"}' | python -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
echo "Org token: ${ORG_TOKEN:0:20}..."

ADMIN_TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@test.com","password":"password123"}' | python -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
echo "Admin token: ${ADMIN_TOKEN:0:20}..."

echo ""

# Create a pending event
echo "=== Create test event ==="
EVENT_RESP=$(curl -s -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ORG_TOKEN}" \
  -d '{"title":"ApproveRejectTest","description":"A valid event description here for testing","date":"2026-12-25","time":"10:00","location":"Test Location City","capacity":100}')
echo "Event response: $EVENT_RESP"
EVENT_ID=$(echo "$EVENT_RESP" | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
echo "Event ID: $EVENT_ID"

echo ""
echo "=== PATCH approve tests ==="

echo -n "User approve: "
curl -s -o /dev/null -w "%{http_code}" -X PATCH "http://localhost:8000/api/events/${EVENT_ID}/approve" \
  -H "Authorization: Bearer ${USER_TOKEN}"
echo " (expect 403)"

echo -n "Org approve: "
curl -s -o /dev/null -w "%{http_code}" -X PATCH "http://localhost:8000/api/events/${EVENT_ID}/approve" \
  -H "Authorization: Bearer ${ORG_TOKEN}"
echo " (expect 403)"

echo -n "Admin approve: "
curl -s -o /dev/null -w "%{http_code}" -X PATCH "http://localhost:8000/api/events/${EVENT_ID}/approve" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
echo " (expect 200)"

echo ""
echo "=== PATCH reject tests ==="

# Create another event for reject
EVENT_RESP2=$(curl -s -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ORG_TOKEN}" \
  -d '{"title":"RejectTest","description":"Another valid event description here","date":"2026-12-31","time":"14:00","location":"Another Location","capacity":50}')
EVENT_ID2=$(echo "$EVENT_RESP2" | python -c "import sys,json;print(json.load(sys.stdin)['id'])")
echo "Event ID2: $EVENT_ID2"

echo -n "User reject: "
curl -s -o /dev/null -w "%{http_code}" -X PATCH "http://localhost:8000/api/events/${EVENT_ID2}/reject" \
  -H "Authorization: Bearer ${USER_TOKEN}"
echo " (expect 403)"

echo -n "Org reject: "
curl -s -o /dev/null -w "%{http_code}" -X PATCH "http://localhost:8000/api/events/${EVENT_ID2}/reject" \
  -H "Authorization: Bearer ${ORG_TOKEN}"
echo " (expect 403)"

echo -n "Admin reject: "
curl -s -o /dev/null -w "%{http_code}" -X PATCH "http://localhost:8000/api/events/${EVENT_ID2}/reject" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
echo " (expect 200)"
