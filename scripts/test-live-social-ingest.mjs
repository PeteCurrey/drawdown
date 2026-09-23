import { config } from 'dotenv';
config({ path: '.env.local' });

// We can import the route handler directly or start the server and curl it.
// Importing the route handler directly in a Node script lets us inspect full in-memory execution and responses.

import { NextRequest } from 'next/server';

async function runCronTest() {
  console.log('Testing live social ingestion runner (/api/cron/social-ingest)...');
  
  const { GET } = await import('../src/app/api/cron/social-ingest/route.ts');

  const req = new NextRequest('http://localhost:3000/api/cron/social-ingest', {
    headers: {
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    }
  });

  const res = await GET(req);
  const status = res.status;
  const json = await res.json();

  console.log(`\nResponse Status: ${status}`);
  console.log('Ingestion Summary:');
  console.log(JSON.stringify(json, null, 2));
}

runCronTest().catch(console.error);
