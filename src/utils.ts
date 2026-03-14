import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COLORS = {
  primary: '#10B981', // Medical Green
  secondary: '#3B82F6', // Light Blue
  background: '#F9FAFB', // Light Gray/White
  white: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
};
