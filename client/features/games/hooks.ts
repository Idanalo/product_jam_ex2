import type { CreateGameInput, Game } from "@shared/schemas/games";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

export const gameKeys = {
  all: ["games"] as const,
};

/** Load all games saved by the logged-in user, newest first. */
export function useGames() {
  return useQuery({
    queryKey: gameKeys.all,
    queryFn: () => api<Game[]>("/api/games"),
  });
}

/** Save a newly finished game by sending only its move sequence. */
export function useSaveGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGameInput) =>
      api<Game>("/api/games", { method: "POST", body: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: gameKeys.all });
    },
  });
}
