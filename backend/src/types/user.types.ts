export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  profilePicture?: string;
  
  // Manager fields
  messName?: string;
  messAddress?: string;
  
  // Member fields
  room?: string;
  hostel?: string;
  
  // Preferences
  language?: 'english' | 'hindi' | 'marathi';
  theme?: 'light' | 'dark' | 'system';
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileResponse {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: string;
  profilePicture?: string;
  messId?: string;
  messName?: string;
  joinStatus?: string;
  
  // Member fields
  memberId?: string;
  room?: string;
  hostel?: string;
  
  // Manager fields
  messAddress?: string;
  
  // Preferences
  language?: string;
  theme?: string;
  
  createdAt: Date;
  lastLogin?: Date;
}
