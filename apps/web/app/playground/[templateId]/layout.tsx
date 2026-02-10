import { generateTemplateMetadata } from "@/lib/seo";
import { readFile } from "fs/promises";
import { join } from "path";

async function findTemplatesDir(): Promise<string> {
  const cwd = process.cwd();
  const possiblePaths = [
    join(cwd, '..', '..', '..', 'packages', 'solana', 'templates'),
    join(cwd, '..', '..', 'packages', 'solana', 'templates'),
    join(cwd, 'packages', 'solana', 'templates'),
    join(cwd, '..', 'packages', 'solana', 'templates'),
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

async function getTemplateMetadata(templateId: string) {
  try {
    const templatesDir = await findTemplatesDir();
    if (!templatesDir) return null;
    
    const metadataPath = join(templatesDir, templateId, 'metadata.json');
    const content = await readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(content);
    
    return {
      name: metadata.name || templateId,
      description: metadata.description || `Interactive Solana programming template: ${templateId}`,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { templateId: string };
}): Promise<ReturnType<typeof generateTemplateMetadata>> {
  const templateId = params.templateId;
  const metadata = await getTemplateMetadata(templateId);
  
  if (!metadata) {
    return generateTemplateMetadata(templateId);
  }
  
  return generateTemplateMetadata(templateId, metadata.name, metadata.description);
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

