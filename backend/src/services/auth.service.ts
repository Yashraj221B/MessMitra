import prisma from '../config/prisma';
import { RegisterDTO, LoginDTO, AuthResponse, TokenPayload, RefreshTokenDTO } from '../types/auth.types';
import { hashPassword, comparePassword, validatePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';
import { formatPhoneNumber, validatePhoneNumber } from '../utils/helpers.util';
import { generateJoinQRCode, generateQRCodeImage, getQRCodeExpiry } from '../utils/qrcode.util';

export class AuthService {

  /**
   * Register a new user (Manager or Member)
   */
  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Validate phone number
    const phone = formatPhoneNumber(data.phone);
    if (!validatePhoneNumber(phone)) {
      throw new AppError('Invalid phone number format', 400);
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.message || 'Invalid password', 400);
    }

    // Check if user already exists with this phone and role
    const roleEnum = data.role === 'manager' ? 'manager' : 'member';
    const existingUser = await prisma.users.findFirst({
      where: { phone, role: roleEnum }
    });

    if (existingUser) {
      throw new AppError(`User with this phone number already exists as ${data.role}`, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user based on role
    let messId: string | undefined = undefined;

    if (data.role === 'manager') {
      // Check if manager already exists (created by admin)
      const existingManager = await prisma.users.findFirst({
        where: { phone, role: 'manager' },
        include: { messes_users_mess_idTomesses: true }
      });

      if (existingManager) {
        // Manager was already created by admin
        if (existingManager.mess_id && existingManager.messes_users_mess_idTomesses) {
          throw new AppError('Manager account already exists. Please use login instead.', 409);
        }
      }

      // Manager creates a mess automatically
      if (!data.messName || !data.messAddress) {
        throw new AppError('Mess name and address are required for managers', 400);
      }

      // Generate QR code for the mess
      const joinQRCode = generateJoinQRCode();
      const qrCodeImage = await generateQRCodeImage(joinQRCode);
      const qrCodeExpiry = getQRCodeExpiry(30); // 30 days validity

      // Create mess first without owner_id (we'll update it after creating user)
      const mess = await prisma.messes.create({
        data: {
          name: data.messName,
          address: data.messAddress,
          qr_code: joinQRCode,
          qr_code_expiry: qrCodeExpiry,
          monthly_fee: 0, // Manager can update this later
          capacity: 100,
          current_members: 0,
          is_active: true,
          // Required field - will be updated after user creation
          users_messes_owner_idTousers: {
            create: {
              phone,
              password: hashedPassword,
              role: roleEnum,
              name: data.name,
              email: data.email || null,
              join_status: 'approved',
              is_active: true,
              token_version: 1,
              language: 'en',
              theme: 'light'
            }
          }
        },
        include: {
          users_messes_owner_idTousers: true
        }
      });

      const user = mess.users_messes_owner_idTousers;
      messId = mess.id;

      // Update user's mess_id
      await prisma.users.update({
        where: { id: user.id },
        data: { mess_id: mess.id }
      });

      // Update mess owner
      await prisma.messes.update({
        where: { id: mess.id },
        data: { owner_id: user.id }
      });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        phone: user.phone,
        role: user.role as 'admin' | 'manager' | 'member',
        messId: user.mess_id || undefined
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Save refresh token
      await prisma.users.update({
        where: { id: user.id },
        data: { refresh_token: refreshToken }
      });

      return {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          messId: user.mess_id || undefined,
          messName: data.messName
        },
        accessToken,
        refreshToken
      };
    } else {
      // Create member user
      const user = await prisma.users.create({
        data: {
          phone,
          password: hashedPassword,
          role: roleEnum,
          name: data.name,
          email: data.email || null,
          mess_id: null,
          join_status: 'pending',
          is_active: true,
          token_version: 1,
          language: 'en',
          theme: 'light'
        }
      });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        phone: user.phone,
        role: user.role as 'admin' | 'manager' | 'member',
        messId: user.mess_id || undefined
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Save refresh token
      await prisma.users.update({
        where: { id: user.id },
        data: { refresh_token: refreshToken }
      });

      return {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          messId: user.mess_id || undefined,
          messName: undefined
        },
        accessToken,
        refreshToken
      };
    }
  }

  /**
   * Login user
   */
  async login(data: LoginDTO): Promise<AuthResponse> {
    // Validate phone number
    const phone = formatPhoneNumber(data.phone);
    if (!validatePhoneNumber(phone)) {
      throw new AppError('Invalid phone number format', 400);
    }

    // Find user with mess information
    const roleEnum = data.role === 'admin' ? 'admin' : 
                     data.role === 'manager' ? 'manager' : 'member';
    const user = await prisma.users.findFirst({
      where: { phone, role: roleEnum },
      include: {
        messes_users_mess_idTomesses: true
      }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password);
    
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('Your account has been deactivated. Please contact support.', 403);
    }

    // Check if member's join request is approved
    if (user.role === 'member' && user.join_status !== 'approved') {
      throw new AppError('Your join request is pending approval', 403);
    }

    // Get mess name if user has a mess
    const messName = user.messes_users_mess_idTomesses?.name;

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      phone: user.phone,
      role: user.role as 'admin' | 'manager' | 'member',
      messId: user.mess_id || undefined
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update user
    await prisma.users.update({
      where: { id: user.id },
      data: {
        refresh_token: refreshToken,
        last_login: new Date(),
        token_version: (user.token_version || 0) + 1
      }
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        messId: user.mess_id || undefined,
        messName
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(oldRefreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = verifyRefreshToken(oldRefreshToken);

      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        include: {
          messes_users_mess_idTomesses: true
        }
      });

      if (!user || user.refresh_token !== oldRefreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      if (!user.is_active) {
        throw new AppError('Account is deactivated', 403);
      }

      // Get mess name if user has a mess
      const messName = user.messes_users_mess_idTomesses?.name;

      const tokenPayload = {
        userId: user.id,
        phone: user.phone,
        role: user.role as 'admin' | 'manager' | 'member',
        messId: user.mess_id || undefined
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      await prisma.users.update({
        where: { id: user.id },
        data: { refresh_token: refreshToken }
      });

      return {
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          messId: user.mess_id || undefined,
          messName
        },
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    await prisma.users.update({
      where: { id: userId },
      data: { refresh_token: null }
    });
  }
}
