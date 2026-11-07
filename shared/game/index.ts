/**
 * Pure game rules for the "big-three" Tic-tac-toe variant:
 * - 4x4 board (16 cells, indexed 0..15).
 * - Three in a row wins (horizontal, vertical, or diagonal).
 * - Players: 'X' moves first, then 'O', alternating.
 * - If board fills completely and no one has 3 in a row, it's a draw.
 *
 * These functions are 100% pure: no React, no database, no side-effects.
 * Both the browser and the server use the exact same functions.
 */

export type Player = "X" | "O";
export type Cell = Player | null;
export type GameResult = Player | "draw" | null;

export type GameState = {
  /** Array of 16 cells (null, 'X', or 'O') */
  board: Cell[];
  /** Whose turn it is next */
  turn: Player;
  /** 'X' | 'O' | 'draw' when game has ended, or null if ongoing */
  result: GameResult;
  /** The 3 cell indices that formed the win, or null */
  winningLine: [number, number, number] | null;
  /** Sequence of cell indices played so far */
  moves: number[];
};

export const BOARD_SIZE = 4;
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE; // 16

/**
 * All 24 possible 3-in-a-row winning lines on a 4x4 grid:
 * - 8 horizontal (2 per row x 4 rows)
 * - 8 vertical (2 per col x 4 cols)
 * - 4 main diagonals (\)
 * - 4 anti-diagonals (/)
 */
export const WINNING_LINES: readonly [number, number, number][] = [
  // Horizontal (Row 0..3)
  [0, 1, 2],
  [1, 2, 3],
  [4, 5, 6],
  [5, 6, 7],
  [8, 9, 10],
  [9, 10, 11],
  [12, 13, 14],
  [13, 14, 15],

  // Vertical (Col 0..3)
  [0, 4, 8],
  [4, 8, 12],
  [1, 5, 9],
  [5, 9, 13],
  [2, 6, 10],
  [6, 10, 14],
  [3, 7, 11],
  [7, 11, 15],

  // Diagonal (\ direction)
  [0, 5, 10],
  [5, 10, 15],
  [1, 6, 11],
  [4, 9, 14],

  // Anti-diagonal (/ direction)
  [3, 6, 9],
  [6, 9, 12],
  [2, 5, 8],
  [7, 10, 13],
] as const;

/** Creates a fresh, empty game state. */
export function createInitialGame(): GameState {
  return {
    board: Array.from({ length: TOTAL_CELLS }, () => null),
    turn: "X",
    result: null,
    winningLine: null,
    moves: [],
  };
}

/** Checks if the board currently contains a winning 3-in-a-row line. */
export function findWinningLine(
  board: readonly Cell[],
): { winner: Player; line: [number, number, number] } | null {
  for (const [a, b, c] of WINNING_LINES) {
    const val = board[a];
    if (val !== null && val === board[b] && val === board[c]) {
      return { winner: val, line: [a, b, c] };
    }
  }
  return null;
}

export class GameRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameRuleError";
  }
}

/**
 * Pure function: takes current GameState and a cell index, and returns
 * a brand new GameState after the move. Does NOT mutate the input state.
 *
 * Throws GameRuleError if the move is invalid or game already ended.
 */
export function applyMove(
  game: Readonly<GameState>,
  cellIndex: number,
): GameState {
  if (game.result !== null) {
    throw new GameRuleError(
      "Cannot make a move in a game that has already ended.",
    );
  }

  if (
    typeof cellIndex !== "number" ||
    !Number.isInteger(cellIndex) ||
    cellIndex < 0 ||
    cellIndex >= TOTAL_CELLS
  ) {
    throw new GameRuleError(
      `Invalid cell index: ${cellIndex}. Must be 0..${TOTAL_CELLS - 1}.`,
    );
  }

  if (game.board[cellIndex] !== null) {
    throw new GameRuleError(`Cell ${cellIndex} is already occupied.`);
  }

  const nextBoard = [...game.board];
  nextBoard[cellIndex] = game.turn;

  const win = findWinningLine(nextBoard);
  if (win) {
    return {
      board: nextBoard,
      turn: game.turn, // keeps last player
      result: win.winner,
      winningLine: win.line,
      moves: [...game.moves, cellIndex],
    };
  }

  const isFull = nextBoard.every((cell) => cell !== null);
  if (isFull) {
    return {
      board: nextBoard,
      turn: game.turn,
      result: "draw",
      winningLine: null,
      moves: [...game.moves, cellIndex],
    };
  }

  return {
    board: nextBoard,
    turn: game.turn === "X" ? "O" : "X",
    result: null,
    winningLine: null,
    moves: [...game.moves, cellIndex],
  };
}

/**
 * Replays a full sequence of moves from start to finish.
 * Verifies that each move is legal and that the game correctly concluded on the final move.
 * Returns the final verified result.
 */
export function replayGame(moves: readonly number[]): {
  result: "X" | "O" | "draw";
  moves: number[];
  winningLine: [number, number, number] | null;
} {
  if (!Array.isArray(moves) || moves.length === 0) {
    throw new GameRuleError(
      "A game must contain at least 5 moves to be won or 16 moves to draw.",
    );
  }

  let state = createInitialGame();

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (state.result !== null) {
      throw new GameRuleError(
        `Move ${i} (${move}) was played after the game had already ended with result '${state.result}'.`,
      );
    }
    state = applyMove(state, move);
  }

  if (state.result === null) {
    throw new GameRuleError("The game is not finished yet.");
  }

  return {
    result: state.result,
    moves: state.moves,
    winningLine: state.winningLine,
  };
}
