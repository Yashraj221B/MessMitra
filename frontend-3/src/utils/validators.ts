// Validation utility functions

import { VALIDATION } from '../constants';

export const validators = {
  /**
   * Validate phone number
   */
  isValidPhone: (phone: string): boolean => {
    return /^\d{10}$/.test(phone);
  },

  /**
   * Validate password
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
  },

  /**
   * Validate name
   */
  isValidName: (name: string): boolean => {
    const trimmed = name.trim();
    return (
      trimmed.length >= VALIDATION.MIN_NAME_LENGTH &&
      trimmed.length <= VALIDATION.MAX_NAME_LENGTH
    );
  },

  /**
   * Validate email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate date (not in past)
   */
  isValidFutureDate: (date: string): boolean => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  },

  /**
   * Validate date range
   */
  isValidDateRange: (startDate: string, endDate: string): boolean => {
    return new Date(startDate) <= new Date(endDate);
  },

  /**
   * Validate text length
   */
  isValidLength: (text: string, maxLength: number): boolean => {
    return text.trim().length <= maxLength;
  },
};

export default validators;
