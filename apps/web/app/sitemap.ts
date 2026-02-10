import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const baseUrl = getBaseUrl();

async function findTemplatesDir(): Promise<string> {
  const cwd = process.cwd();
  const possiblePaths = [
    join(cwd, '..', '..', 'packages', 'solana', 'templates'),
    join(cwd, 'packages', 'solana', 'templates'),
    join(cwd, '..', 'packages', 'solana', 'templates'),
    join(cwd, 'apps', 'web', 'packages', 'solana', 'templates'),
  ];
  
  for (const path of possiblePaths) {
    try {
      const { stat } = await import('fs/promises');
      const stats = await stat(path);
      if (stats.isDirectory()) {
        return path;
      }
    } catch {
      continue;
    }
  }
  
  return '';
}

async function findTemplatesRecursive(dir: string, basePath: string = ''): Promise<string[]> {
  const templates: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name.startsWith('_')) continue;
      
      const fullPath = join(dir, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        try {
          const metadataPath = join(fullPath, 'metadata.json');
          await readFile(metadataPath, 'utf-8');
          templates.push(relativePath);
        } catch {
          const nestedTemplates = await findTemplatesRecursive(fullPath, relativePath);
          templates.push(...nestedTemplates);
        }
      }
    }
  } catch {
    // If directory doesn't exist or can't be read, return empty array
  }
  
  return templates.sort();
}

async function getAllTemplates(): Promise<string[]> {
  try {
    const templatesDir = await findTemplatesDir();
    if (!templatesDir) return [];
    return await findTemplatesRecursive(templatesDir);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const templates = await getAllTemplates();
  const now = new Date();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/playground`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/paths`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
  
  // Template pages
  const templatePages: MetadataRoute.Sitemap = templates.map((templateId) => ({
    url: `${baseUrl}/playground/${templateId}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  // Concept pages (if you have dynamic concepts, add them here)
  // For now, we'll add a few example concept pages
  const conceptPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/concepts/accounts`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/concepts/programs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/concepts/pdas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
  
  return [...staticPages, ...templatePages, ...conceptPages];
}

