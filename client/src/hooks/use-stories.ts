import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type BattleStory } from "@shared/schema";

export function useStories() {
  return useQuery<BattleStory[]>({
    queryKey: [api.stories.list.path],
  });
}

export function useStory(id: number) {
  return useQuery<BattleStory>({
    queryKey: ["/api/stories", id],
    queryFn: async () => {
      const res = await fetch(`/api/stories/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Story not found");
      const data = await res.json();
      return api.stories.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}
