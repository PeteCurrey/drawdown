import os
import json
import urllib.request

# Read .env
env_vars = {}
with open('.env', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            key, val = line.split('=', 1)
            env_vars[key] = val

supabase_url = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
service_key = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not service_key:
    print("Missig keys")
    exit(1)

# Step 1: list users to find petecurrey@gmail.com
url = f"{supabase_url}/auth/v1/admin/users"
req = urllib.request.Request(url, headers={
    'apikey': service_key,
    'Authorization': f'Bearer {service_key}'
})

try:
    with urllib.request.urlopen(req) as response:
        users = json.loads(response.read())
        target_user = None
        
        # Admin list users response is either a list of users, or paginated depending on Supabase version
        if isinstance(users, dict) and 'users' in users:
            users_list = users['users']
        else:
            users_list = users
            
        for u in users_list:
            if u.get('email') == 'petecurrey@gmail.com':
                target_user = u
                break
                
        if not target_user:
            print("User petecurrey@gmail.com not found. Let's list the first few emails:")
            for u in users_list[:5]:
                print(u.get('email'))
            exit(0)
            
        print(f"Found user: {target_user['id']}")
        
        # Step 2: update profiles
        # Note: if schema cache issue, we can try to reload schema cache
        # or just make sure to use correct endpoint /rest/v1/profiles
        update_url = f"{supabase_url}/rest/v1/profiles?id=eq.{target_user['id']}"
        payload = json.dumps({"subscription_tier": "floor"}).encode('utf-8')
        upd_req = urllib.request.Request(update_url, data=payload, method='PATCH', headers={
            'apikey': service_key,
            'Authorization': f'Bearer {service_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        })
        
        with urllib.request.urlopen(upd_req) as upd_res:
            print("Update response:", upd_res.read().decode('utf-8'))
            
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
