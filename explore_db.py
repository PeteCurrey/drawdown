import os
import json
import urllib.request

env_vars = {}
with open('.env', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            key, val = line.split('=', 1)
            env_vars[key] = val

supabase_url = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
service_key = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

url = f"{supabase_url}/rest/v1/"
req = urllib.request.Request(url, headers={
    'apikey': service_key,
    'Authorization': f'Bearer {service_key}'
})

try:
    with urllib.request.urlopen(req) as response:
        info = json.loads(response.read())
        print(json.dumps(info, indent=2))
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
