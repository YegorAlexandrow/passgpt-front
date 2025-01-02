export interface Subscription {
  _id: string;
  payment?: PaymentRecord | null; // Поле может быть необязательным или null
  user_id: string;

  // Time fields
  created_at: number;
  activated_at?: number | null; // Поле может быть необязательным или null
  expires_at: number;
  frozen_at?: number | null; // Поле может быть необязательным или null

  // Data fields
  type: SubType | string; // Тип подписки
  status: SubStatus; // Статус подписки
  priority: number;
  last_message_at: number;
  messages_in_last_day: number;
  message_per_day_limit: number;
}

export enum SubStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  ACTIVE = 'active',
  FROZEN = 'frozen',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
}

export enum SubType {
  FREE = 'free',
  // Добавьте другие типы подписок, если они есть
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  provider_payment_id: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  created_at: number;
}

export enum PaymentProvider {
  YOOKASSA = 'yookassa',
}

export enum PaymentStatus {
  PENDING = 'pending',
  WAITING_FOR_CAPTURE = 'waiting_for_capture',
  SUCCEEDED = 'succeeded',
  CANCELED = 'canceled',
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
