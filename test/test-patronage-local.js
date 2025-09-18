import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import V2exParser from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPatronageLocal() {
  const htmlPath = path.join(__dirname, '..', 'aa.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html);
  const parser = new V2exParser({ baseUrl: 'https://www.v2ex.com' });

  const post = await parser.parsePostPage($, 'https://www.v2ex.com/t/1159225');

  console.log('Title:', post.title);
  console.log('Patronage count:', post.patronage?.count);
  console.log('Patronage total patrons (from summary):', post.patronage?.totals?.totalPatrons);
  console.log('Patronage total amount (from summary):', post.patronage?.totals?.totalAmount);
  console.log('First 5 patrons:', post.patronage?.users?.slice(0, 5));

  // 简单断言
  if (!post.patronage || post.patronage.count === 0) {
    throw new Error('Patronage parsing failed: no users found');
  }
  if (!post.patronage.summaryText) {
    throw new Error('Patronage parsing failed: summaryText missing');
  }
  console.log('\n✅ Patronage parsing looks good.');
}

// run
try {
  await testPatronageLocal();
} catch (e) {
  console.error('❌ Test failed:', e.message);
  process.exit(1);
}
