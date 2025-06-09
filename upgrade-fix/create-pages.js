import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pages = [
  'Pricing',
  'Support',
  'Features',
  'Auth',
  'About',
  'Blog',
  'Documentation',
  'AccountSettings',
  'Terms',
  'Privacy',
  'Careers',
  'Admin',
  'Checkout',
  'PaymentStatus'
];

const template = (name) => `export default function ${name}() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">${name}</h1>
      <p>Coming soon...</p>
    </div>
  );
}`;

const pagesDir = join(__dirname, 'src', 'pages');

if (!existsSync(pagesDir)) {
  mkdirSync(pagesDir, { recursive: true });
}

pages.forEach(page => {
  const filePath = join(pagesDir, `${page}.tsx`);
  writeFileSync(filePath, template(page));
  console.log(`Created ${page}.tsx`);
}); 