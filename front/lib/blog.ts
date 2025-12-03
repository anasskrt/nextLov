import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  image: string;
  content: string;
  keywords?: string;
}

export function getAllPosts(): BlogPost[] {
  // Vérifier si le dossier existe
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        summary: data.summary || '',
        label: data.label || 'Article',
        author: data.author || 'MSParking',
        published: data.published || new Date().toISOString(),
        image: data.image || '/blog/default.jpg',
        content,
        keywords: data.keywords || '',
      };
    });

  // Trier par date de publication (plus récent en premier)
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.published);
    const dateB = new Date(b.published);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      summary: data.summary || '',
      label: data.label || 'Article',
      author: data.author || 'MSParking',
      published: data.published || new Date().toISOString(),
      image: data.image || '/blog/default.jpg',
      content,
      keywords: data.keywords || '',
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}
