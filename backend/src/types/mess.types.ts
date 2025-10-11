export interface CreateMessDTO {
  name: string;
  description?: string;
  address: string;
  monthlyFee: number;
  currency?: string;
  securityDeposit?: number;
  maxMembers?: number;
  
  // Timings (breakfast, lunch, dinner)
  timings?: {
    breakfast?: { start: string; end: string };
    lunch?: { start: string; end: string };
    dinner?: { start: string; end: string };
  };
  
  // Features
  features?: {
    hasWifi?: boolean;
    hasAC?: boolean;
    hasParking?: boolean;
    specialDiet?: boolean;
  };
  
  // Images
  coverImage?: string;
  images?: string[];
}

export interface UpdateMessDTO extends Partial<CreateMessDTO> {
  isActive?: boolean;
}

export interface MessResponse {
  id: string;
  name: string;
  description?: string;
  address: string;
  ownerId: string;
  ownerName?: string;
  monthlyFee: number;
  currency: string;
  securityDeposit?: number;
  maxMembers: number;
  currentMembers: number;
  activeMembers: number;
  totalRevenue: number;
  
  joinQRCode?: string;
  qrCodeImage?: string;
  qrCodeExpiry?: Date;
  
  timings?: any;
  features?: any;
  settings?: any;
  
  coverImage?: string;
  images?: string[];
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JoinMessDTO {
  qrCode?: string;
  messId?: string;
  memberId?: string;
  room?: string;
  hostel?: string;
}

export interface MessMemberResponse {
  id: string;
  name: string;
  phone: string;
  memberId?: string;
  room?: string;
  hostel?: string;
  joinStatus: string;
  joinedAt?: Date;
}
