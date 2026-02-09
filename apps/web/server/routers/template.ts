import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import fs from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), '../../packages/solana/templates');

// Helper to read template metadata
const getTemplateMetadata = (category: string, templateId: string) => {
  const metadataPath = path.join(TEMPLATES_DIR, category, templateId, 'metadata.json');
  if (!fs.existsSync(metadataPath)) return null;
  
  try {
    const content = fs.readFileSync(metadataPath, 'utf-8');
    const metadata = JSON.parse(content);
    return { ...metadata, id: templateId, category };
  } catch (e) {
    console.error(`Failed to parse metadata for ${templateId}`, e);
    return null;
  }
};

// Helper to read all files in a template
// TODO: optimize this to maybe lazily load or cache
const getTemplateFiles = (category: string, templateId: string) => {
    const programDir = path.join(TEMPLATES_DIR, category, templateId, 'program');
    const libRsPath = path.join(programDir, 'lib.rs');
    
    if (!fs.existsSync(libRsPath)) return null;
    
    const libRs = fs.readFileSync(libRsPath, 'utf-8');
    
    // We also need the other JSON files
    const baseDir = path.join(TEMPLATES_DIR, category, templateId);
    const readJson = (filename: string) => {
        const p = path.join(baseDir, filename);
        return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : {};
    };

    return {
        code: libRs,
        lineExplanations: readJson('line-explanations.json'),
        programMap: readJson('program-map.json'),
        precomputedState: readJson('precomputed-state.json'),
        functionSpecs: readJson('function-specs.json'),
    };
};

export const templateRouter = router({
  getAll: publicProcedure
    .query(async () => {
      const categories = ['beginner', 'intermediate', 'expert'];
      const templates = [];

      for (const category of categories) {
        const categoryPath = path.join(TEMPLATES_DIR, category);
        if (fs.existsSync(categoryPath)) {
          const params = fs.readdirSync(categoryPath);
          for (const templateId of params) {
            // Skip hidden files/dirs
            if (templateId.startsWith('.')) continue; // .DS_Store etc
            
            const metadata = getTemplateMetadata(category, templateId);
            if (metadata) {
              templates.push(metadata);
            }
          }
        }
      }

      return templates;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
       const categories = ['beginner', 'intermediate', 'expert'];
       
       for (const category of categories) {
           const potentialPath = path.join(TEMPLATES_DIR, category, input.id);
            if (fs.existsSync(potentialPath)) {
                const metadata = getTemplateMetadata(category, input.id);
                const files = getTemplateFiles(category, input.id);
                
                if (!metadata || !files) {
                     throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load template files' });
                }

                // Construct response to match store expectations
                return {
                    id: input.id,
                    metadata: metadata, // nested metadata
                    ...files,
                    // lineExplanations are returned as part of keys in files
                };
            }
       }

       throw new TRPCError({ code: 'NOT_FOUND', message: `Template ${input.id} not found` });
    }),
});
