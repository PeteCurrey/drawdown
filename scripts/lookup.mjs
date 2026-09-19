import dns from 'dns';

dns.lookup('db.fzzmcqqpfhvolugsiagg.supabase.co', (err, address, family) => {
  if (err) {
    console.error('DNS lookup failed:', err);
  } else {
    console.log(`Resolved db.fzzmcqqpfhvolugsiagg.supabase.co to: ${address} (family: IPv${family})`);
  }
});
