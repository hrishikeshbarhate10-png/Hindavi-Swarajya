import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTimeline() {
  return useQuery({
    queryKey: [api.timeline.list.path],
    queryFn: async () => {
      const res = await fetch(api.timeline.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch timeline events");
      
      const data = await res.json();
      return api.timeline.list.responses[200].parse(data);
    },
  });
}
