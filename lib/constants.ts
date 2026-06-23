// Known legitimate Solana gaming token addresses.
// These are always fetched and scored, but they do not bypass the safety threshold.
export const WHITELISTED_GAMING_TOKEN_ADDRESSES = [
  "Tqj8yFmagrg7oorpQkVGYR52r96RFTamvWfth9bpump", // kintara
  "2pL9J9mTD9RAGS9jnNeB2kKR62ar8pnQAV2sMgyrpump", // wasabicraft
  "GENEtH5amGSi8kHAtQoezp1XEXwZJ8vcuePYnXdKrMYz", // genopets
  "DFL1zNkaGPWm1BqAVqRjCZvHmwTFrEaJtbzJWgseoNJh", // defi land
  "3dgCCb15HMQSA4Pn3Tfii5vRk7aRqTH95LJjxzsG2Mug", // honeyland
  "H53UGEyBrB9easo9ego8yYk7o4Zq1G5cCtkxD3E3hZav", // mixmob
] as const;

// Tokens that should never be treated as games regardless of description.
export const BLOCKED_TOKEN_SYMBOLS = new Set([
  "nudaeng",
  "ballsack",
  "ballsack coin",
]);

export const GAMING_KEYWORDS = [
  "game", "games", "gaming", "gamer", "gamers",
  "play-to-earn", "p2e", "p2w", "play2earn",
  "mmo", "mmorpg", "rpg", "roleplay", "role-playing",
  "metaverse", "virtual world",
  "craft", "crafting",
  "runner", "racing",
  "battle", "battler", "arena",
  "quest", "dungeon", "raid", "roguelike",
  "strategy", "tactics",
  "simulator", "simulation",
  "shooter", "fps", "action",
  "card game", "trading card",
  "mobil game", "mobile gaming",
  "idle game", "idle rpg",
] as const;
