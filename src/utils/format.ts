import { format, formatDistance, formatRelative } from 'date-fns'
import { id } from 'date-fns/locale'

/**
 * Format date to Indonesian format
 */
export function formatDate(date: Date | string, pattern = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, pattern, { locale: id })
}

/**
 * Format date to relative time (e.g., "2 hari yang lalu")
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: id })
}

/**
 * Format date to relative description (e.g., "kemarin pukul 14:30")
 */
export function formatRelativeDescription(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatRelative(dateObj, new Date(), { locale: id })
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Create slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  const names = name.split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Indonesia)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '')
  if (cleaned.startsWith('+62')) {
    return cleaned.replace(/(\+62)(\d{3})(\d{4})(\d+)/, '$1 $2-$3-$4')
  }
  if (cleaned.startsWith('62')) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})(\d+)/, '+$1 $2-$3-$4')
  }
  if (cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')
  }
  return phone
}
