/**
 * Format phone number for consistency
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
};

/**
 * Validate phone number (Indian format)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = formatPhoneNumber(phone);
  return /^[6-9]\d{9}$/.test(cleaned); // Indian mobile numbers
};

/**
 * Calculate days between two dates
 */
export const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
};

/**
 * Format date to YYYY-MM-DD
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get month name
 */
export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || 'Unknown';
};

/**
 * Generate receipt number
 */
export const generateReceiptNumber = (messId: string, month: number, year: number): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `RCP-${messId.slice(0, 8)}-${year}${String(month).padStart(2, '0')}-${timestamp}`;
};
