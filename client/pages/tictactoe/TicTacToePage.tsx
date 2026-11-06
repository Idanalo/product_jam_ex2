import { applyMove, createInitialGame, findWinningLine } from "@shared/game";
import type { GameState } from "@shared/game";
import { useCallback, useState } from "react";
import { Button, Card, Spinner, useToast } from "../../components";
import { useGames, useSaveGame } from "../../features/games/hooks";
import styles from "./TicTacToePage.module.css";

/** Mini visual 4x4 board thumbnail showing the final game outcome. */
function MiniBoard({ moves }: { moves: number[] }) {
  const board = Array.from({ length: 16 }, () => null as "X" | "O" | null);
  for (let i = 0; i < moves.length; i++) {
    board[moves[i]] = i % 2 === 0 ? "X" : "O";
  }
  const win = findWinningLine(board);

  return (
    <div className={styles.miniBoard} aria-hidden="true" title={`Final board after ${moves.length} moves`}>
      {board.map((cell, idx) => {
        const isWin = win?.line.includes(idx);
        return (
          <div
            key={idx}
            className={`${styles.miniCell} ${
              cell === "X"
                ? styles.miniCellX
                : cell === "O"
                  ? styles.miniCellO
                  : ""
            } ${isWin ? styles.miniCellWin : ""}`}
          >
            {cell}
          </div>
        );
      })}
    </div>
  );
}

export default function TicTacToePage() {
  const [gameState, setGameState] = useState<GameState>(createInitialGame);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const toast = useToast();
  const saveGame = useSaveGame();
  const { data: games, isLoading: loadingGames } = useGames();

  const handleCellClick = useCallback(
    (index: number) => {
      if (
        gameState.result !== null ||
        gameState.board[index] !== null ||
        saveGame.isPending
      ) {
        return;
      }

      try {
        const nextState = applyMove(gameState, index);
        setGameState(nextState);

        // If this move completed the game (win or draw), automatically save to server
        if (nextState.result !== null) {
          saveGame.mutate(
            { moves: nextState.moves },
            {
              onSuccess: () => {
                toast.add({
                  title: "Game saved",
                  description: "The result was verified by the server and saved to your history.",
                });
              },
              onError: (err) => {
                toast.add({
                  title: "Could not save game",
                  description: err.message,
                });
              },
            },
          );
        }
      } catch (err) {
        console.error("Illegal move:", err);
      }
    },
    [gameState, saveGame, toast],
  );

  const handleReset = useCallback(() => {
    setGameState(createInitialGame());
    setHoveredCell(null);
  }, []);

  const isWinningCell = (index: number) =>
    gameState.winningLine?.includes(index) ?? false;

  // Calculate coordinates for the animated SVG strike line across the 3 winning tiles
  let strikeCoords: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (gameState.winningLine) {
    const [a, , c] = gameState.winningLine;
    const ra = Math.floor(a / 4);
    const ca = a % 4;
    const rc = Math.floor(c / 4);
    const cc = c % 4;

    const xa = ca * 100 + 50;
    const ya = ra * 100 + 50;
    const xc = cc * 100 + 50;
    const yc = rc * 100 + 50;

    const dx = xc - xa;
    const dy = yc - ya;
    const len = Math.hypot(dx, dy) || 1;
    const pad = 24; // Extend stroke slightly beyond cell centers

    strikeCoords = {
      x1: xa - (dx / len) * pad,
      y1: ya - (dy / len) * pad,
      x2: xc + (dx / len) * pad,
      y2: yc + (dy / len) * pad,
    };
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tic-tac-toe</h1>
        <p className={styles.subtitle}>
          Variant: <strong>big-three</strong> (4×4 grid • 3 in a row wins)
        </p>
      </header>

      {/* Main Game Board Card */}
      <Card padding="lg" className={styles.gameCard}>
        {gameState.result === null ? (
          <div className={styles.statusBar}>
            <span className={styles.statusText}>
              Current Turn:{" "}
              <span
                className={
                  gameState.turn === "X" ? styles.playerX : styles.playerO
                }
              >
                Player {gameState.turn}
              </span>
            </span>
            <Button size="sm" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        ) : (
          <div
            className={`${styles.winnerBanner} ${
              gameState.result === "X"
                ? styles.winBannerX
                : gameState.result === "O"
                  ? styles.winBannerO
                  : styles.drawBanner
            }`}
          >
            {gameState.result === "draw"
              ? "🤝 Game Ended in a Draw!"
              : `🎉 Player ${gameState.result} Wins!`}
          </div>
        )}

        <div className={styles.boardWrapper}>
          <div className={styles.board}>
            {gameState.board.map((cell, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.cell} ${
                  cell === "X"
                    ? styles.playerX
                    : cell === "O"
                      ? styles.playerO
                      : ""
                } ${isWinningCell(idx) ? styles.cellWinning : ""}`}
                onClick={() => handleCellClick(idx)}
                onMouseEnter={() => setHoveredCell(idx)}
                onMouseLeave={() => setHoveredCell(null)}
                disabled={
                  cell !== null ||
                  gameState.result !== null ||
                  saveGame.isPending
                }
                aria-label={`Cell ${idx}, ${cell ?? "empty"}`}
              >
                {cell ?? (
                  hoveredCell === idx &&
                  gameState.result === null &&
                  !saveGame.isPending ? (
                    <span
                      className={`${styles.ghostMark} ${
                        gameState.turn === "X" ? styles.playerX : styles.playerO
                      }`}
                    >
                      {gameState.turn}
                    </span>
                  ) : null
                )}
              </button>
            ))}
          </div>

          {/* Animated SVG Strike Line */}
          {strikeCoords && (
            <svg
              className={styles.strikeOverlay}
              viewBox="0 0 400 400"
              aria-hidden="true"
            >
              <line
                x1={strikeCoords.x1}
                y1={strikeCoords.y1}
                x2={strikeCoords.x2}
                y2={strikeCoords.y2}
                className={
                  gameState.result === "X"
                    ? styles.strikeLineX
                    : styles.strikeLineO
                }
              />
            </svg>
          )}
        </div>

        <div className={styles.actions}>
          <Button onClick={handleReset} variant="primary">
            New Game
          </Button>
          {saveGame.isPending && (
            <span className={styles.statusText}>
              <Spinner /> Saving game...
            </span>
          )}
        </div>
      </Card>

      {/* Game History Section */}
      <Card padding="lg" className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <h2 className={styles.historyTitle}>Your Saved Games</h2>
          {loadingGames && <Spinner />}
        </div>

        {loadingGames ? (
          <p className={styles.emptyState}>Loading games...</p>
        ) : !games || games.length === 0 ? (
          <p className={styles.emptyState}>
            No saved games yet. Complete your first match above!
          </p>
        ) : (
          <ul className={styles.historyList}>
            {games.map((g) => (
              <li key={g.id} className={styles.historyItem}>
                <div className={styles.historyContent}>
                  <MiniBoard moves={g.moves} />
                  <div className={styles.historyResult}>
                    <div className={styles.historyDetails}>
                      <span
                        className={`${styles.badge} ${
                          g.result === "X"
                            ? styles.badgeX
                            : g.result === "O"
                              ? styles.badgeO
                              : styles.badgeDraw
                        }`}
                      >
                        {g.result === "draw" ? "Draw" : `Player ${g.result} Won`}
                      </span>
                      <span>{g.moves.length} moves</span>
                    </div>
                  </div>
                </div>
                <time className={styles.historyMeta} dateTime={g.created_at}>
                  {new Date(g.created_at).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
