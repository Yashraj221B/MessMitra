// Mock database utilities for MessMitra

export interface User {
  phone: string;
  role: 'manager' | 'member';
  name: string;
  password?: string; // Password for authentication
  // Manager specific fields (mess owner/operator)
  messName?: string;
  address?: string;
  // Member specific fields (mess subscriber/student)
  education?: string;
  notifications?: boolean;
  room?: string;
  memberId?: string;
}

// Initialize mock database with some demo users
export const initializeMockDatabase = () => {
  const existingDb = localStorage.getItem('messmitra-users-db');
  
  // Only initialize if database doesn't exist
  if (!existingDb) {
    const demoUsers: User[] = [
      // Demo Manager User (Mess Owner/Operator)
      {
        phone: '9876543210',
        role: 'manager',
        name: 'Rajesh Kumar',
        password: '1234', // Demo password
        messName: 'Shanti Bhawan Mess',
        address: 'Near Main Gate, College Road, Hostel Area'
      },
      // Demo Member Users (Mess Subscribers)
      {
        phone: '9876543211',
        role: 'member',
        name: 'Priya Sharma',
        password: '1234', // Demo password
        room: 'H1-201',
        memberId: '2025001',
        education: 'B.Tech Computer Science, 2nd Year',
        notifications: true
      },
      {
        phone: '9876543212',
        role: 'member',
        name: 'Amit Patel',
        password: '1234', // Demo password
        room: 'H2-105',
        memberId: '2025002',
        education: 'B.Tech Electrical Engineering, 3rd Year',
        notifications: false
      }
    ];
    
    localStorage.setItem('messmitra-users-db', JSON.stringify(demoUsers));
    console.log('Mock database initialized with demo users');
  }

  // Initialize demo leave requests for testing
  const existingLeaveRequests = localStorage.getItem('leave-requests');
  if (!existingLeaveRequests) {
    const demoLeaveRequests = [
      {
        id: 'leave-demo-1',
        studentName: 'Priya Sharma',
        studentId: '2025001',
        phone: '9876543211',
        room: 'H1-201',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Family function - sister\'s wedding',
        requestDate: new Date().toISOString(),
        status: 'pending'
      },
      {
        id: 'leave-demo-2',
        studentName: 'Amit Patel',
        studentId: '2025002',
        phone: '9876543212',
        room: 'H2-105',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        reason: 'Going home for Diwali vacation',
        requestDate: new Date().toISOString(),
        status: 'pending'
      }
    ];
    
    localStorage.setItem('leave-requests', JSON.stringify(demoLeaveRequests));
    console.log('Mock leave requests initialized');
  }
};

// Get all users from database
export const getAllUsers = (): User[] => {
  try {
    const usersData = localStorage.getItem('messmitra-users-db');
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Check if user exists
export const userExists = (phone: string, role: 'manager' | 'member'): boolean => {
  const users = getAllUsers();
  return users.some(user => user.phone === phone && user.role === role);
};

// Get user by phone and role
export const getUserByPhone = (phone: string, role: 'manager' | 'member'): User | null => {
  const users = getAllUsers();
  return users.find(user => user.phone === phone && user.role === role) || null;
};

// Add new user to database
export const addUser = (user: User): boolean => {
  try {
    const users = getAllUsers();
    
    // Check if user already exists
    if (userExists(user.phone, user.role)) {
      console.warn('User already exists');
      return false;
    }
    
    users.push(user);
    localStorage.setItem('messmitra-users-db', JSON.stringify(users));
    console.log('User added to database:', user);
    return true;
  } catch (error) {
    console.error('Error adding user:', error);
    return false;
  }
};

// Update existing user
export const updateUser = (phone: string, role: 'manager' | 'member', updatedData: Partial<User>): boolean => {
  try {
    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.phone === phone && user.role === role);
    
    if (userIndex === -1) {
      console.warn('User not found');
      return false;
    }
    
    users[userIndex] = { ...users[userIndex], ...updatedData };
    localStorage.setItem('messmitra-users-db', JSON.stringify(users));
    console.log('User updated:', users[userIndex]);
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// Clear database (for testing)
export const clearDatabase = () => {
  localStorage.removeItem('messmitra-users-db');
  console.log('Database cleared');
};
