import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { TokenPayload } from '../types/auth.types';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Authenticate user using JWT token
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...allowedRoles: Array<'admin' | 'manager' | 'member'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. Required role: ' + allowedRoles.join(' or ')
      });
    }

    next();
  };
};

/**
 * Check if user owns the mess (for manager-specific operations)
 */
export const requireMessOwnership = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const messId = req.params.messId || req.body.messId;
  
  if (req.user.role === 'admin') {
    // Admin can access any mess
    return next();
  }

  if (req.user.role === 'manager' && req.user.messId === messId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You do not have permission to access this mess'
  });
};

/**
 * Check if user is a member of the mess
 */
export const requireMessMembership = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  const messId = req.params.messId || req.body.messId;
  
  if (req.user.role === 'admin' || req.user.role === 'manager') {
    // Admin and managers can access
    return next();
  }

  if (req.user.role === 'member' && req.user.messId === messId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You must be a member of this mess to perform this action'
  });
};
