export interface ChatMessage {
  id: string;
  created_at: string;
  wallet_address: string | null;
  display_name: string | null;
  content: string;
  reply_to: string | null;
}

export interface ChatUser {
  address: string | null;
  displayName: string;
  isGuest: boolean;
}
