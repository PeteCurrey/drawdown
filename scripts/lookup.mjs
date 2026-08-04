import dns from 'dns';

dns.lookup('db.miiasjbonwlleggiukyf.supabase.co', (err, address, family) => {
  if (err) {
    console.error('DNS lookup failed:', err);
  } else {
    console.log(`Resolved db.miiasjbonwlleggiukyf.supabase.co to: ${address} (family: IPv${family})`);
  }
});
