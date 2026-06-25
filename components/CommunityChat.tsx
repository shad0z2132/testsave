"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Send, MessageSquare, Loader2, RefreshCw, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

const GUEST_NAME_KEY = "savepoint-chat-guest-name";
const MAX_MESSAGE_LENGTH = 500;

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function shortenWallet(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function stringToHsl(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 55%)`;
}

function ChatAvatar({
  name,
  address,
  className,
}: {
  name: string;
  address?: string | null;
  className?: string;
}) {
  const seed = address || name;
  const initial = (name || "?").charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-white/10 font-bold uppercase text-white shadow-sm",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${stringToHsl(seed)} 0%, rgba(204,255,0,0.25) 100%)`,
      }}
    >
      {initial}
    </div>
  );
}

function ChatMessageItem({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  const displayName = message.display_name || "Anonymous";
  const isWallet = !!message.wallet_address;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3", isOwn && "flex-row-reverse")}
    >
      <ChatAvatar
        name={displayName}
        address={message.wallet_address}
        className="h-8 w-8 text-[10px]"
      />
      <div className={cn("flex min-w-0 flex-col", isOwn && "items-end")}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {isWallet && message.wallet_address
              ? shortenWallet(message.wallet_address)
              : displayName}
          </span>
          <span className="text-[10px] text-foreground/40">{formatTime(message.created_at)}</span>
        </div>
        <div
          className={cn(
            "mt-0.5 max-w-[85%] rounded-2xl border px-3 py-2 text-sm leading-relaxed",
            isOwn
              ? "rounded-br-none border-lime/30 bg-lime/10 text-foreground"
              : "rounded-bl-none border-white/[0.08] bg-white/[0.04] text-foreground/90"
          )}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}

interface CommunityChatProps {
  className?: string;
}

export function CommunityChat({ className }: CommunityChatProps) {
  const { publicKey, connected } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const [guestName, setGuestName] = useLocalStorage(GUEST_NAME_KEY);
  const [input, setInput] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, loading, error, sending, sendMessage, refetch } = useChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || sending) return;

      const displayName = connected && walletAddress
        ? shortenWallet(walletAddress)
        : guestName.trim() || "Anonymous";

      const ok = await sendMessage(input, {
        address: walletAddress,
        displayName,
      });

      if (ok) {
        setInput("");
      }
    },
    [input, sending, connected, walletAddress, guestName, sendMessage]
  );

  const handleNameSave = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      setGuestName(trimmed || "Anonymous");
      setShowNameInput(false);
      inputRef.current?.focus();
    },
    [setGuestName]
  );

  return (
    <div
      className={cn(
        "relative flex h-[600px] flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0a0a0a] shadow-[0_0_40px_rgba(204,255,0,0.05)]",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-black/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-lime/30 bg-lime/10">
            <MessageSquare size={14} className="text-lime" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Community Chat</h2>
            <p className="text-[10px] text-foreground/50">
              {loading ? "Connecting..." : `${messages.length} message${messages.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!connected && (
            <button
              onClick={() => setShowNameInput((v) => !v)}
              className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-foreground/70 hover:border-lime/30 hover:text-lime"
            >
              {guestName || "Set name"}
            </button>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="rounded-full border border-white/[0.12] bg-white/[0.04] p-1.5 text-foreground/60 hover:text-lime disabled:opacity-50"
            aria-label="Refresh chat"
          >
            <RefreshCw size={12} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Name editor */}
      <AnimatePresence>
        {showNameInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/[0.08] bg-black/30"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const input = form.elements.namedItem("guestName") as HTMLInputElement;
                handleNameSave(input.value);
              }}
              className="flex items-center gap-2 p-3"
            >
              <User size={14} className="text-foreground/40" />
              <input
                name="guestName"
                defaultValue={guestName}
                placeholder="Guest name"
                maxLength={20}
                className="flex-1 rounded-lg border border-white/[0.12] bg-black/50 px-3 py-1.5 text-xs text-foreground outline-none placeholder:text-foreground/30 focus:border-lime/50"
              />
              <button
                type="submit"
                className="rounded-lg bg-lime px-3 py-1.5 text-xs font-bold text-black hover:bg-lime/90"
              >
                Save
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {loading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center gap-2 text-foreground/50">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading messages...</span>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="max-w-[200px] text-xs text-negative">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04]">
              <MessageSquare size={20} className="text-foreground/40" />
            </div>
            <p className="mt-3 text-sm text-foreground/60">No messages yet</p>
            <p className="text-xs text-foreground/40">Be the first to say something.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                isOwn={!!walletAddress && msg.wallet_address === walletAddress}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.08] bg-black/40 p-3">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              placeholder={connected ? "Say something..." : "Say something as guest..."}
              disabled={sending}
              maxLength={MAX_MESSAGE_LENGTH}
              className="w-full rounded-xl border border-white/[0.12] bg-black/60 px-3 py-2.5 pr-12 text-xs text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-lime/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-foreground/30">
              {input.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime text-black transition-all hover:bg-lime/90 disabled:opacity-40 disabled:hover:bg-lime"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
