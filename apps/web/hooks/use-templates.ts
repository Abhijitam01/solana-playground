import { useQuery } from "@tanstack/react-query";

// Use local Next.js API routes (no external API needed for Vercel deployment)
const API_URL = "/api";

export interface TemplateListItem {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate";
  featured?: boolean;
}

export function useTemplates(featuredOnly: boolean = false) {
  return useQuery<TemplateListItem[]>({
    queryKey: ["templates", featuredOnly ? "featured" : "all"],
    queryFn: async () => {
      const url = featuredOnly ? `${API_URL}/templates?featured=true` : `${API_URL}/templates`;
      const res = await fetch(url);
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
