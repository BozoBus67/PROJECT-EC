import { signal } from '@preact/signals';

export const current_audio = signal<HTMLAudioElement | null>(null);

export interface AccountTier {
  id: string;
  label: string;
  price: number;
}

export const account_tiers = signal<AccountTier[]>([]);