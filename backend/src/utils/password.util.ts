import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 4) {
    return { valid: false, message: 'Password must be at least 4 characters long' };
  }
  
  // Add more validation rules as needed
  // if (!/[A-Z]/.test(password)) {
  //   return { valid: false, message: 'Password must contain at least one uppercase letter' };
  // }
  
  return { valid: true };
};
