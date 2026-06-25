"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Game } from "@/types/game";
import { Search, Compass, Flame, Sparkles, Bookmark, X } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGame: (game: Game) => void;
  onTabChange: (tab: string) => void;
  onFilterChange: (filter: string) => void;
  games: Game[];
}

const commands = [
  { id: "discover", label: "Go to Discover", icon: Compass, action: "tab:discover" },
  { id: "trending", label: "Go to Trending", icon: Flame, action: "tab:trending" },
  { id: "new", label: "Go to New", icon: Sparkles, action: "tab:new" },
  { id: "saved", label: "Go to Saved", icon: Bookmark, action: "tab:saved" },
  { id: "live", label: "Filter: Live games", icon: Flame, action: "filter:Live" },
  { id: "beta", label: "Filter: Beta games", icon: Sparkles, action: "filter:Beta" },
  { id: "rpg", label: "Filter: RPG", icon: Compass, action: "filter:RPG" },
];

export function CommandPalette({
  open,
  onOpenChange,
  onSelectGame,
  onTabChange,
  onFilterChange,
  games,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const justOpenedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const next = !open;
        onOpenChange(next);
        if (next) {
          setQuery("");
          setSelectedIndex(0);
          justOpenedRef.current = true;
        }
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (justOpenedRef.current && inputRef.current) {
      inputRef.current.focus();
      justOpenedRef.current = false;
    }
  });

  const gameResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return games
      .filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.tokenSymbol.toLowerCase().includes(q) ||
          g.genre.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, games]);

  const commandResults = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  const allItems = useMemo(
    () => [
      ...gameResults.map((g) => ({ type: "game" as const, data: g })),
      ...commandResults.map((c) => ({ type: "command" as const, data: c })),
    ],
    [gameResults, commandResults]
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  };

  const handleSelect = (item: (typeof allItems)[number]) => {
    if (item.type === "game") {
      onSelectGame(item.data as Game);
    } else {
      const command = item.data as (typeof commands)[0];
      const [kind, value] = command.action.split(":");
      if (kind === "tab") onTabChange(value);
      if (kind === "filter") onFilterChange(value);
    }
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[15vh] backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-[#0f0f11]/95 shadow-[0_0_60px_rgba(204, 255, 0, 0.15)] animate-in zoom-in-95 slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5">
          <Search size={20} className="text-primary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search games, commands, filters..."
            className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-white/[0.06] hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {allItems.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}

          {gameResults.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Games
              </p>
              {gameResults.map((game, index) => {
                const actualIndex = index;
                return (
                  <button
                    key={game.id}
                    onClick={() => handleSelect(allItems[actualIndex])}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      selectedIndex === actualIndex
                        ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_rgba(204, 255, 0, 0.2)]"
                        : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium text-foreground">{game.name}</span>
                    <span className="font-mono text-xs">{game.tokenSymbol}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {game.genre}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {commandResults.length > 0 && (
            <div>
              <p className="px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Commands
              </p>
              {commandResults.map((command, index) => {
                const actualIndex = gameResults.length + index;
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => handleSelect(allItems[actualIndex])}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      selectedIndex === actualIndex
                        ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_rgba(204, 255, 0, 0.2)]"
                        : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium text-foreground">{command.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
          <span>↑↓ to navigate</span>
          <span>↵ to select</span>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
}
