import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Artifact } from "@shared/schema";

export function useArtifacts() {
  return useQuery({
    queryKey: [api.artifacts.list.path],
    queryFn: async () => {
      const res = await fetch(api.artifacts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch artifacts");
      const data = await res.json();
      return api.artifacts.list.responses[200].parse(data);
    },
  });
}

export function useArtifact(id: number) {
  return useQuery<Artifact>({
    queryKey: ["/api/artifacts", id],
    queryFn: async () => {
      const res = await fetch(`/api/artifacts/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Artifact not found");
      return res.json();
    },
    enabled: !!id,
  });
}
