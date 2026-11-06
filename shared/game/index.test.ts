import { describe, expect, it } from "vitest";
import {
  applyMove,
  createInitialGame,
  GameRuleError,
  replayGame,
} from "./index";

describe("Tic-tac-toe big-three variant", () => {
  it("initializes an empty 4x4 game", () => {
    const game = createInitialGame();
    expect(game.board.length).toBe(16);
    expect(game.board.every((c) => c === null)).toBe(true);
    expect(game.turn).toBe("X");
    expect(game.result).toBe(null);
    expect(game.winningLine).toBe(null);
    expect(game.moves).toEqual([]);
  });

  it("alternates turns when applying valid moves", () => {
    let game = createInitialGame();
    game = applyMove(game, 0); // X plays 0
    expect(game.board[0]).toBe("X");
    expect(game.turn).toBe("O");
    expect(game.moves).toEqual([0]);

    game = applyMove(game, 5); // O plays 5
    expect(game.board[5]).toBe("O");
    expect(game.turn).toBe("X");
    expect(game.moves).toEqual([0, 5]);
  });

  it("detects horizontal 3-in-a-row win for X", () => {
    // X: 0, 1, 2 (Row 0 win)
    // O: 4, 5
    const moves = [0, 4, 1, 5, 2];
    const result = replayGame(moves);
    expect(result.result).toBe("X");
    expect(result.winningLine).toEqual([0, 1, 2]);
  });

  it("detects vertical 3-in-a-row win for O", () => {
    // X: 0, 1, 15
    // O: 4, 8, 12 (Col 0 vertical win)
    const moves = [0, 4, 1, 8, 15, 12];
    const result = replayGame(moves);
    expect(result.result).toBe("O");
    expect(result.winningLine).toEqual([4, 8, 12]);
  });

  it("detects diagonal 3-in-a-row win for X", () => {
    // X plays [0, 5, 10]
    // O plays [1, 2]
    const moves = [0, 1, 5, 2, 10];
    const result = replayGame(moves);
    expect(result.result).toBe("X");
    expect(result.winningLine).toEqual([0, 5, 10]);
  });

  it("detects anti-diagonal 3-in-a-row win", () => {
    // [3, 6, 9]
    // X plays 3, 6, 9
    // O plays 0, 1
    const moves = [3, 0, 6, 1, 9];
    const result = replayGame(moves);
    expect(result.result).toBe("X");
    expect(result.winningLine).toEqual([3, 6, 9]);
  });

  it("rejects move to already occupied cell", () => {
    let game = createInitialGame();
    game = applyMove(game, 4);
    expect(() => applyMove(game, 4)).toThrow(GameRuleError);
  });

  it("rejects invalid cell index", () => {
    const game = createInitialGame();
    expect(() => applyMove(game, -1)).toThrow(GameRuleError);
    expect(() => applyMove(game, 16)).toThrow(GameRuleError);
  });

  it("rejects moves played after game has already ended", () => {
    const moves = [0, 4, 1, 5, 2, 7]; // X won on move 2, move 7 is invalid
    expect(() => replayGame(moves)).toThrow(GameRuleError);
  });

  it("rejects incomplete game on replay", () => {
    const moves = [0, 4, 1, 5]; // only 4 moves, nobody won
    expect(() => replayGame(moves)).toThrow(GameRuleError);
  });
});
