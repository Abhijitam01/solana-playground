import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@solana-playground/db';
import { userCode, profiles } from '@solana-playground/db';
import { eq, and, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import {
  createGist,
  getGistContent,
  updateGist,
  deleteGist,
  shouldUseGist,
} from '../services/github-gist';

export const codeRouter = router({
  getMyCode: protectedProcedure
    .query(async ({ ctx }) => {
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not connected' });
      return db
        .select()
        .from(userCode)
        .where(eq(userCode.userId, ctx.user.id))
        .orderBy(desc(userCode.updatedAt));
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not connected' });
      const code = await db
        .select()
        .from(userCode)
        .where(
          and(
            eq(userCode.id, input.id),
            eq(userCode.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (!code[0]) {
        return null;
      }

      const record = code[0];
      
      // If code is stored in Gist, fetch it
      if (record.gistId && !record.code) {
        try {
          const gistContent = await getGistContent(record.gistId);
          return {
            ...record,
            code: gistContent,
          };
        } catch (error) {
          // If Gist fetch fails, log error but return record without code
          console.error(`Failed to fetch Gist ${record.gistId}:`, error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch code from GitHub Gist',
          });
        }
      }
      
      return record;
    }),

  save: protectedProcedure
    .input(z.object({
      id: z.string().uuid().optional(),
      templateId: z.string(),
      title: z.string().min(1).max(100),
      code: z.string().min(1),
      language: z.string().default('rust'),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not connected' });
      
      // Ensure profile exists before saving code (fixes foreign key constraint)
      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, ctx.user.id))
        .limit(1);
      
      if (existingProfile.length === 0) {
        // Create profile if it doesn't exist
        try {
          await db
            .insert(profiles)
            .values({
              id: ctx.user.id,
              username: ctx.user.email?.split('@')[0] || `user-${ctx.user.id.slice(0, 8)}`,
              displayName: ctx.user.email || 'User',
              avatarUrl: ctx.user.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar?d=identicon',
            })
            .onConflictDoNothing();
        } catch (error) {
          // If insert fails (e.g., username conflict), try with unique username
          await db
            .insert(profiles)
            .values({
              id: ctx.user.id,
              username: `user-${ctx.user.id.slice(0, 8)}-${Date.now().toString(36)}`,
              displayName: ctx.user.email || 'User',
              avatarUrl: ctx.user.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar?d=identicon',
            })
            .onConflictDoNothing();
        }
      }
      
      const now = new Date();
      const useGist = shouldUseGist(input.code);

      if (input.id) {
        // Update existing - first get the current record
        const [existing] = await db
          .select()
          .from(userCode)
          .where(
            and(
              eq(userCode.id, input.id),
              eq(userCode.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (!existing) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Code not found' });
        }

        const hadGist = !!existing.gistId;
        const needsGist = useGist;
        const switchingStorage = hadGist !== needsGist;

        // Handle storage switching
        if (switchingStorage) {
          if (hadGist && !needsGist) {
            // Switching from Gist to DB - delete old Gist
            try {
              await deleteGist(existing.gistId!);
            } catch (error) {
              console.error(`Failed to delete old Gist ${existing.gistId}:`, error);
              // Continue anyway
            }
          } else if (!hadGist && needsGist) {
            // Switching from DB to Gist - delete old code from DB
            // (will be handled in update)
          }
        }

        // Create or update Gist if needed
        let gistId = existing.gistId;
        let gistUrl = existing.gistUrl;

        if (needsGist) {
          try {
            if (hadGist && !switchingStorage) {
              // Update existing Gist
              await updateGist(existing.gistId!, input.code, input.title, input.language);
            } else {
              // Create new Gist
              const gist = await createGist(input.code, input.title, input.language);
              gistId = gist.id;
              gistUrl = gist.url;
            }
          } catch (error) {
            console.error('Failed to create/update Gist, falling back to database:', error);
            // Fallback to database storage
            const [updated] = await db
              .update(userCode)
              .set({
                title: input.title,
                code: input.code,
                gistId: null,
                gistUrl: null,
                updatedAt: now,
                lastOpenedAt: now,
              })
              .where(
                and(
                  eq(userCode.id, input.id),
                  eq(userCode.userId, ctx.user.id)
                )
              )
              .returning();
            return updated;
          }
        }

        // Update database record
        const [updated] = await db
          .update(userCode)
          .set({
            title: input.title,
            code: needsGist ? null : input.code, // Store code only if not using Gist
            gistId: needsGist ? gistId : null,
            gistUrl: needsGist ? gistUrl : null,
            updatedAt: now,
            lastOpenedAt: now,
          })
          .where(
            and(
              eq(userCode.id, input.id),
              eq(userCode.userId, ctx.user.id)
            )
          )
          .returning();
        
        return updated;
      } else {
        // Create new
        let gistId: string | null = null;
        let gistUrl: string | null = null;
        let codeToStore: string | null = input.code;

        if (useGist) {
          try {
            const gist = await createGist(input.code, input.title, input.language);
            gistId = gist.id;
            gistUrl = gist.url;
            codeToStore = null; // Don't store code in DB if using Gist
          } catch (error) {
            console.error('Failed to create Gist, falling back to database:', error);
            // Fallback to database storage
            gistId = null;
            gistUrl = null;
            codeToStore = input.code;
          }
        }

        const [created] = await db
          .insert(userCode)
          .values({
            userId: ctx.user.id,
            templateId: input.templateId,
            title: input.title,
            code: codeToStore,
            language: input.language,
            gistId,
            gistUrl,
            lastOpenedAt: now,
          })
          .returning();
        
        return created;
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not connected' });
      
      // Get the record first to check for Gist
      const [record] = await db
        .select()
        .from(userCode)
        .where(
          and(
            eq(userCode.id, input.id),
            eq(userCode.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (record?.gistId) {
        // Delete the Gist first
        try {
          await deleteGist(record.gistId);
        } catch (error) {
          console.error(`Failed to delete Gist ${record.gistId}:`, error);
          // Continue with database deletion even if Gist deletion fails
        }
      }

      // Delete from database
      await db
        .delete(userCode)
        .where(
          and(
            eq(userCode.id, input.id),
            eq(userCode.userId, ctx.user.id)
          )
        );
      
      return { success: true };
    }),

  toggleFavorite: protectedProcedure
    .input(z.object({ 
      id: z.string().uuid(),
      isFavorite: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not connected' });
      const [updated] = await db
        .update(userCode)
        .set({ isFavorite: input.isFavorite })
        .where(
          and(
            eq(userCode.id, input.id),
            eq(userCode.userId, ctx.user.id)
          )
        )
        .returning();
      
      return updated;
    }),
});
