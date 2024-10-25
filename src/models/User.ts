export interface Subscription {
  id: string;
  payment_id: string;
  user_id: string;
  created_at: number;
  expires_at: number;
  status: string;
  type: string;
  last_message_at: number;
  messages_in_last_day: number;
  message_per_day_limit: number;
}

export interface User {
  id: string;
  provider_ids: string[];
  email: string;
  avatar: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
}
