import { z } from "zod";

/** A saved game, as returned by the API. */
export const gameSchema = z.object({
  id: z.string(),
  owner_id: z.string(),
  moves: z.array(z.number().int().min(0).max(15)),
  result: z.enum(["X", "O", "draw"]),
  created_at: z.string(),
});

/**
 * Payload sent by the browser to save a finished game.
 * Notice: the browser sends ONLY the moves, NEVER the result.
 * The server replays the moves and calculates the result itself.
 */
export const createGameSchema = z.object({
  moves: z
    .array(z.number().int().min(0).max(15))
    .min(5, "A game requires at least 5 moves to conclude"),
});

export type Game = z.infer<typeof gameSchema>;
export type CreateGameInput = z.infer<typeof createGameSchema>;
