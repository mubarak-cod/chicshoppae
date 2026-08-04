import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const raw = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

const cleaned = raw.map((p) => ({
  id: p.id,
  title: p.title,
  name: p.name,
  category: p.category,
  description: p.description,
  price: Number(p.price),
  original_price: Number(p.originalPrice),
  images: (p.images || []).filter((url) => url), // drops empty "" entries
  colors: p.colors || [],
  sizes: p.sizes || [],
  styles: p.styles || [],
}));

async function migrate() {
  const { data, error } = await supabase.from('products').insert(cleaned);

  if (error) {
    console.error('Migration failed:', error);
  } else {
    console.log(`✅ Migrated ${cleaned.length} products successfully.`);
  }
}

migrate();