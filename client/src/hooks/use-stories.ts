import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type BattleStory } from "@shared/schema";

export function useStories() {
  return useQuery<BattleStory[]>({
    queryKey: [api.stories.list.path],
  });
}
