import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

/**
 * Generate a unique QR code for joining a mess
 */
export const generateJoinQRCode = (): string => {
  return `MESS-${uuidv4()}`;
};

/**
 * Generate QR code image from data
 */
export const generateQRCodeImage = async (data: string): Promise<string> => {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    } as any);
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code image');
  }
};

/**
 * Set QR code expiry (default: 7 days from now)
 */
export const getQRCodeExpiry = (days: number = 7): Date => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};

/**
 * Check if QR code is expired
 */
export const isQRCodeExpired = (expiryDate: Date): boolean => {
  return new Date() > new Date(expiryDate);
};
