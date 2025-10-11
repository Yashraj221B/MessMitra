export interface RegisterDTO {
  phone: string;
  password: string;
  role: 'manager' | 'member';
  name: string;
  email?: string;
  
  // Manager-specific fields
  messName?: string;
  messAddress?: string;
  
  // Member-specific fields
  room?: string;
  memberId?: string;
  hostel?: string;
}

export interface LoginDTO {
  phone: string;
  password: string;
  role: 'admin' | 'manager' | 'member';
}

export interface TokenPayload {
  userId: string;
  phone: string;
  role: 'admin' | 'manager' | 'member';
  messId?: string; // For members and managers
}

export interface AuthResponse {
  user: {
    id: string;
    phone: string;
    name: string;
    role: string;
    messId?: string;
    messName?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}
