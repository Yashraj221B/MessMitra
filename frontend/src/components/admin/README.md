# Platform Admin Panel 🛡️

The Platform Admin Panel is a comprehensive "god mode" interface for managing the entire MessMitra platform.

## 📁 Components

### AdminContainer
Main container that manages navigation between admin screens.

```typescript
import { AdminContainer } from '@/components/admin';

// In your App.tsx, use role-based routing:
{userRole === 'admin' && <AdminContainer />}
```

### PlatformAdminDashboard
**Main dashboard** showing platform-wide statistics and quick actions.

**Features:**
- Platform overview (total messes, managers, members, active users)
- Revenue tracking with monthly growth percentage
- Action-required cards (pending verifications, support tickets)
- Quick action buttons (Manage Messes, Users, Analytics, Settings)
- Gradient header with animations

**Stats Displayed:**
- Total Messes: 47
- Total Managers: 52
- Total Members: 1,248
- Active Users: 892
- Total Revenue: ₹458.9K
- Monthly Growth: +23.5%
- Pending Verifications: 8
- Support Tickets: 3

### MessManagement
**Mess management interface** for viewing and controlling all registered messes.

**Features:**
- Search by name, manager, or location
- Filter by status (all, active, suspended, pending)
- View mess details (members, fees, revenue, location)
- Approve pending mess registrations
- Suspend/activate messes
- Detailed mess information modal

**Data Fields:**
- Mess name & manager name
- Location (city-based)
- Total members
- Monthly fee (₹)
- Total revenue generated
- Status (active/suspended/pending)
- Joined date

**Actions:**
- Approve Mess (for pending registrations)
- Suspend Mess (deactivate active mess)
- Activate Mess (reactivate suspended mess)
- View full details in modal

### UserManagement
**User management interface** for viewing and managing all platform users.

**Features:**
- Role-based statistics (admins, managers, members)
- Search by name, email, phone, or mess
- Filter by role (all, admin, manager, member)
- View user details (email, phone, mess, join date)
- Suspend/activate users
- Delete users (with confirmation)
- Detailed user information modal

**User Roles:**
- 🛡️ **Admin**: Platform administrators (purple badge)
- 🏢 **Manager**: Mess owners/managers (blue badge)
- 👤 **Member**: Mess members/students (gray badge)

**Actions:**
- Suspend User (deactivate account)
- Activate User (reactivate account)
- Delete User (permanent removal with confirmation)
- View full profile details

### AdminBottomNav
**Bottom navigation bar** for switching between admin screens.

**Navigation Items:**
- 📊 Dashboard (overview & stats)
- 🏢 Messes (mess management)
- 👥 Users (user management)
- 📈 Analytics (coming soon)
- ⚙️ Settings (coming soon)

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Indigo-purple gradient theme
- **Typography**: Bold headings, medium body text
- **Layout**: Responsive grid system (max-width: 4xl)
- **Spacing**: Consistent padding and gaps

### Animations
- Motion animations with staggered delays
- Smooth screen transitions
- Hover effects on cards and buttons
- Modal slide-up animations

### Status Indicators
- **Active**: Green badge with checkmark icon
- **Suspended**: Red badge with X icon
- **Pending**: Yellow badge with eye icon

### Responsive Design
- Mobile-first approach
- Fixed bottom navigation (z-50)
- Scrollable content with pb-20 for nav clearance
- Modal overlays with backdrop blur

## 🔌 Backend Integration (TODO)

The admin panel is currently using mock data. To integrate with the backend:

### 1. Create Admin Service

```typescript
// frontend/src/services/admin.service.ts

class AdminService {
  // Platform Stats
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  // Mess Management
  async getMesses(): Promise<Mess[]> {
    const response = await api.get('/admin/messes');
    return response.data;
  }

  async approveMess(messId: string): Promise<void> {
    await api.post(`/admin/messes/${messId}/approve`);
  }

  async suspendMess(messId: string): Promise<void> {
    await api.post(`/admin/messes/${messId}/suspend`);
  }

  async activateMess(messId: string): Promise<void> {
    await api.post(`/admin/messes/${messId}/activate`);
  }

  // User Management
  async getUsers(): Promise<AppUser[]> {
    const response = await api.get('/admin/users');
    return response.data;
  }

  async suspendUser(userId: string): Promise<void> {
    await api.post(`/admin/users/${userId}/suspend`);
  }

  async activateUser(userId: string): Promise<void> {
    await api.post(`/admin/users/${userId}/activate`);
  }

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  }
}

export const adminService = new AdminService();
```

### 2. Backend Endpoints Needed

```
GET    /admin/stats                      # Platform statistics
GET    /admin/messes                     # List all messes
POST   /admin/messes/:id/approve         # Approve pending mess
POST   /admin/messes/:id/suspend         # Suspend mess
POST   /admin/messes/:id/activate        # Activate mess
GET    /admin/users                      # List all users
GET    /admin/users/:id                  # Get user details
POST   /admin/users/:id/suspend          # Suspend user
POST   /admin/users/:id/activate         # Activate user
DELETE /admin/users/:id                  # Delete user
POST   /admin/users/:id/role             # Change user role
```

### 3. Update Components

Replace mock data with service calls:

```typescript
// In PlatformAdminDashboard.tsx
const loadPlatformStats = async () => {
  try {
    const stats = await adminService.getPlatformStats();
    setStats(stats);
  } catch (error) {
    console.error('Failed to load stats:', error);
    toast.error('Failed to load platform statistics');
  }
};

// In MessManagement.tsx
const loadMesses = async () => {
  try {
    const data = await adminService.getMesses();
    setMesses(data);
  } catch (error) {
    console.error('Failed to load messes:', error);
    toast.error('Failed to load messes');
  }
};

// In UserManagement.tsx
const loadUsers = async () => {
  try {
    const data = await adminService.getUsers();
    setUsers(data);
  } catch (error) {
    console.error('Failed to load users:', error);
    toast.error('Failed to load users');
  }
};
```

## 🔒 Access Control

### Route Protection

Add role-based routing in `App.tsx`:

```typescript
import { AdminContainer } from './components/admin';
import { realAuthService } from './services/realAuth.service';

function App() {
  const userRole = realAuthService.getRole();

  if (userRole === 'admin') {
    return <AdminContainer />;
  }

  // ... other role-based routing
}
```

### Backend Middleware

Ensure admin endpoints are protected:

```typescript
// backend/src/middleware/auth.middleware.ts
router.get('/admin/stats', authorize('admin'), adminController.getStats);
router.get('/admin/messes', authorize('admin'), adminController.getMesses);
router.get('/admin/users', authorize('admin'), adminController.getUsers);
// ... etc
```

## 📊 Data Models

### PlatformStats
```typescript
interface PlatformStats {
  totalMesses: number;
  totalManagers: number;
  totalMembers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  pendingVerifications: number;
  supportTickets: number;
}
```

### Mess
```typescript
interface Mess {
  id: string;
  name: string;
  managerName: string;
  location: string;
  totalMembers: number;
  monthlyFee: number;
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  totalRevenue: number;
}
```

### AppUser
```typescript
interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'member';
  messName?: string;
  joinedDate: string;
  status: 'active' | 'suspended';
}
```

## 🚀 Usage Example

```typescript
// App.tsx
import { AdminContainer } from './components/admin';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const user = await realAuthService.getCurrentUser();
      setCurrentUser(user);
    };
    checkAuth();
  }, []);

  if (!currentUser) {
    return <Login />;
  }

  if (currentUser.role === 'admin') {
    return <AdminContainer />;
  }

  // ... handle other roles
}
```

## 🎯 Future Enhancements

### Phase 1 (Current)
- ✅ Platform dashboard with stats
- ✅ Mess management (view, approve, suspend)
- ✅ User management (view, suspend, delete)
- ✅ Bottom navigation
- ✅ Responsive design

### Phase 2 (Planned)
- [ ] Analytics dashboard with charts
- [ ] Platform settings panel
- [ ] Export data (CSV/Excel)
- [ ] Advanced filtering & sorting
- [ ] Bulk actions (suspend multiple users)
- [ ] Email notifications to users
- [ ] Audit log viewer

### Phase 3 (Advanced)
- [ ] Real-time WebSocket updates
- [ ] Advanced analytics (revenue trends, user growth)
- [ ] Custom reports generator
- [ ] Role management (create custom roles)
- [ ] Platform announcement system
- [ ] Support ticket management
- [ ] Payment gateway integration monitoring

## 🛠️ Development Notes

### File Structure
```
frontend/src/components/admin/
├── index.ts                    # Exports all admin components
├── AdminContainer.tsx          # Main container with navigation
├── PlatformAdminDashboard.tsx  # Dashboard screen
├── MessManagement.tsx          # Mess management screen
├── UserManagement.tsx          # User management screen
└── AdminBottomNav.tsx          # Bottom navigation bar
```

### Dependencies
- `motion/react`: Animations
- `sonner`: Toast notifications
- `lucide-react`: Icons
- `@/components/ui/*`: Shadcn components (Card, Button, Input)

### State Management
Currently uses local component state with `useState`. Consider:
- React Context for global admin state
- Zustand/Redux for complex state management
- React Query for server state caching

### Performance
- Lazy load screens with `React.lazy()`
- Implement pagination for large lists
- Add debounced search
- Optimize bundle size with code splitting

## 📝 Testing Checklist

- [ ] Dashboard loads with correct stats
- [ ] Navigation switches between screens
- [ ] Search filters work correctly
- [ ] Status filters work correctly
- [ ] Approve mess updates status
- [ ] Suspend/activate mess works
- [ ] Suspend/activate user works
- [ ] Delete user shows confirmation
- [ ] Modals open/close correctly
- [ ] Animations smooth and performant
- [ ] Mobile responsive design works
- [ ] Error handling shows toast messages

## 📚 Related Documentation

- [Backend Auth Middleware](../../../backend/src/middleware/auth.middleware.ts)
- [Auth Types](../../../backend/src/types/auth.types.ts)
- [Storage Service](../../services/storage.service.ts)
- [Auth Service](../../services/realAuth.service.ts)

---

**Created**: January 2025  
**Status**: ✅ UI Complete, Backend Integration Pending  
**Version**: 1.0.0
