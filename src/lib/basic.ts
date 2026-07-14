import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASIC_DIR = path.join(process.cwd(), 'src/content/basic');

export type BasicCluster = 'The Markets' | 'The Players' | 'The Mechanics' | 'Getting Started';

export interface BasicPageMeta {
  title: string;
  slug: string;
  cluster: BasicCluster;
  metaTitle: string;
  metaDescription: string;
  dek: string;
  instantAnswer: string;
  heroImage: { src: string; alt: string; caption?: string };
  keyTakeaways: string[];
  faq: { question: string; answer: string }[];
  nextStep: { label: string; href: string };
  glossaryTerm?: string;
  relatedBasics: string[];
  internalLinks: string[];
  thumbnail: string; // same as heroImage.src for hub cards
}

export interface BasicPage extends BasicPageMeta {
  content: string; // raw MDX body
}

export function getAllBasicPages(): BasicPageMeta[] {
  if (!fs.existsSync(BASIC_DIR)) return [];
  const files = fs.readdirSync(BASIC_DIR).filter(f => f.endsWith('.mdx'));
  return files
    .map(file => {
      const slug = file.replace('.mdx', '');
      const raw = fs.readFileSync(path.join(BASIC_DIR, file), 'utf8');
      const { data } = matter(raw);
      return {
        ...data,
        slug,
        thumbnail: data.heroImage?.src || '',
      } as BasicPageMeta;
    })
    .sort((a, b) => {
      // Sort by cluster order, then alphabetically
      const clusterOrder: BasicCluster[] = ['The Markets', 'The Players', 'The Mechanics', 'Getting Started'];
      const ai = clusterOrder.indexOf(a.cluster);
      const bi = clusterOrder.indexOf(b.cluster);
      return ai !== bi ? ai - bi : a.title.localeCompare(b.title);
    });
}

export function getBasicPageBySlug(slug: string): BasicPage | null {
  const filePath = path.join(BASIC_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    ...data,
    slug,
    thumbnail: data.heroImage?.src || '',
    content,
  } as BasicPage;
}
