import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type QuizQuestion } from "@shared/schema";

export function useDailyQuiz() {
  return useQuery<QuizQuestion>({
    queryKey: [api.quiz.daily.path],
  });
}
