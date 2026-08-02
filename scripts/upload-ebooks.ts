#!/usr/bin/env npx tsx
/**
 * Create bucket if missing and upload ebook PDFs to Supabase Storage
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const BUCKET = 'store';
const EBOOKS = [
  {
    localPath: "PDF's/Drawdown_How_To_Trade copy.pdf",
    remotePath: 'ebooks/how-to-trade.pdf',
    label: 'How to Trade',
  },
  {
    localPath: "PDF's/Drawdown_The_Edge_Manual copy.pdf",
    remotePath: 'ebooks/the-edge.pdf',
    label: 'The Edge Manual',
  },
  {
    localPath: "PDF's/Drawdown_Prop_Firm_Survival_Kit copy.pdf",
    remotePath: 'ebooks/prop-challenge-survival-kit.pdf',
    label: 'Prop Challenge Survival Kit',
  },
];

async function uploadEbooks() {
  console.log('🚀 Checking/Creating Supabase Storage Bucket...');
  
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(b => b.name === BUCKET);
  
  if (!bucketExists) {
    console.log(`Creating bucket '${BUCKET}'...`);
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (createErr) {
      console.error(`Failed to create bucket: ${createErr.message}`);
    } else {
      console.log(`✅ Bucket '${BUCKET}' created.`);
    }
  }

  for (const ebook of EBOOKS) {
    const fullPath = path.join(process.cwd(), ebook.localPath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${fullPath} — skipping ${ebook.label}`);
      continue;
    }
    
    const fileBuffer = fs.readFileSync(fullPath);
    const fileSizeKB = Math.round(fileBuffer.length / 1024);
    
    console.log(`\n📚 Uploading: ${ebook.label} (${fileSizeKB} KB)`);
    
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(ebook.remotePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });
    
    if (error) {
      console.error(`   ❌ Failed: ${error.message}`);
    } else {
      console.log(`   ✅ Uploaded: ${data.path}`);
    }
  }
}

uploadEbooks().catch(console.error);
