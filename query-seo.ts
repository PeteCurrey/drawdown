const url = "https://miiasjbonwlleggiukyf.supabase.co/rest/v1/";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1paWFzamJvbndsbGVnZ2l1a3lmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE1Njc1OCwiZXhwIjoyMDkxNzMyNzU4fQ.FZdZVV4N0JTZ61HAwdxzHP3HrUmDy3UBFcB_OapIzng";

async function run() {
  const res = await fetch(url, {
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`
    }
  });
  if (res.ok) {
    const data = await res.json();
    console.log("Tables:", Object.keys(data.paths || {}));
    if (data.definitions && data.definitions.seo_pages) {
      console.log("seo_pages properties:", Object.keys(data.definitions.seo_pages.properties || {}));
    }
  } else {
    console.log("HTTP Error:", res.status, res.statusText);
  }
}

run();
