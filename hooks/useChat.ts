"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";
import type { ChatMessage } from "@/types/chat";

const MESSAGES_PER_PAGE = 100;

interface UseChatOptions {
  enabled?: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  sendMessage: (content: string, user: { address?: string | null; displayName: string }) => Promise<boolean>;
  refetch: () => void;
}

export function useChat({ enabled = true }: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const mountedRef = useRef(false);

  const fetchMessages = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const client = getSupabaseClient();
      const { data, error: supaError } = await client
        .from("chat_messages")
        .select("id, created_at, wallet_address, display_name, content, reply_to")
        .order("created_at", { ascending: true })
        .limit(MESSAGES_PER_PAGE);

      if (supaError) throw supaError;

      if (mountedRef.current) {
        setMessages((data as ChatMessage[]) ?? []);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Async data fetch is idiomatic here; the rule flags setState inside the async callback.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, [fetchMessages, retryCount]);

  useEffect(() => {
    if (!enabled) return;

    let channel: RealtimeChannel;

    try {
      const client = getSupabaseClient();
      channel = client
        .channel("chat_messages:public")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          (payload) => {
            const newMessage = payload.new as ChatMessage;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMessage.id)) return prev;
              return [...prev, newMessage].slice(-MESSAGES_PER_PAGE);
            });
          }
        )
        .subscribe();

      channelRef.current = channel;
    } catch {
      // Realtime is best-effort; polling fallback already handled by user refetch.
    }

    return () => {
      channel?.unsubscribe();
      channelRef.current = null;
    };
  }, [enabled]);

  const sendMessage = useCallback(
    async (content: string, user: { address?: string | null; displayName: string }) => {
      const trimmed = content.trim();
      if (!trimmed || trimmed.length > 500) return false;

      setSending(true);
      try {
        const client = getSupabaseClient();
        const { error: supaError } = await client.from("chat_messages").insert({
          content: trimmed,
          wallet_address: user.address ?? null,
          display_name: user.displayName.trim() || "Anonymous",
        });

        if (supaError) throw supaError;
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        return false;
      } finally {
        setSending(false);
      }
    },
    []
  );

  const refetch = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    refetch,
  };
}
