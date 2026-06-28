import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility for merging Tailwind CSS classes conditionally.
 * Combines clsx and tailwind-merge for robust class handling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indian currency (INR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a date as a human-readable string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

/**
 * Calculate BMI
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

/**
 * Calculate days remaining until a date
 */
export function daysUntil(date: Date | string): number {
  const target = new Date(date)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + '...'
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone)
}

/**
 * Get WhatsApp URL with pre-filled message
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Get a membership plan label from its ID
 */
export function getMembershipLabel(planId: string): string {
  const labels: Record<string, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly (3 Months)',
    'half-yearly': 'Half Yearly (6 Months)',
    yearly: 'Yearly (12 Months)',
    corporate: 'Corporate Membership',
    student: 'Student Membership',
    family: 'Family Membership',
  }
  return labels[planId] || planId
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
