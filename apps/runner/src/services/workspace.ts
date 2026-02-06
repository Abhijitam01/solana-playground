import { mkdtemp, rm } from "fs/promises";
import { join } from "path";

export class WorkspaceManager {
  constructor(private readonly baseDir: string = "/tmp/solana-playground-workspaces") {}

  async create(templateId: string): Promise<string> {
    const prefix = join(this.baseDir, `${templateId}-`);
    return mkdtemp(prefix);
  }

  async cleanup(path: string): Promise<void> {
    await rm(path, { recursive: true, force: true });
  }
}
