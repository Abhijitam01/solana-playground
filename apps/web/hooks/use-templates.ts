import { useQuery } from "@tanstack/react-query";

// Use local Next.js API routes (no external API needed for Vercel deployment)
const API_URL = "/api";

export interface TemplateListItem {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate";
}

export function useTemplates() {
  return useQuery<TemplateListItem[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/templates`);
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    },
  });
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/templates/${id}`);
      if (!res.ok) throw new Error("Failed to fetch template");
      return res.json();
    },
    enabled: !!id,
  });
}
