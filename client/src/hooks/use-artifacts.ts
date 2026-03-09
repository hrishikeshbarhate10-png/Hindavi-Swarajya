import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

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
