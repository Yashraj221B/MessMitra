# Manager Components Organization

This folder contains all components related to **Mess Manager** (mess owner/operator) functionality.

## 📁 Folder Structure

```
manager/
├── operations/          # Day-to-day operations
│   ├── MenuPlanner.tsx      # Plan and schedule daily menus
│   └── Attendance.tsx       # Track member attendance
│
├── finances/            # Financial management
│   └── Billing.tsx          # Payment collection & billing
│
├── communication/       # Communication features
│   ├── Announcements.tsx    # Send announcements to members
│   └── Notifications.tsx    # View and manage notifications
│
├── management/          # Member & mess management
│   ├── MemberManagement.tsx # Manage existing members
│   ├── JoinRequests.tsx     # Approve/reject join requests
│   └── MessQR.tsx           # QR code for mess joining
│
├── analytics/           # Reports & analytics
│   └── RatingsView.tsx      # View member feedback & ratings
│
├── AdminDashboard.tsx   # Main dashboard (home screen)
├── AdminProfile.tsx     # Manager profile & settings
├── BottomNav.tsx        # Bottom navigation bar
└── index.ts             # Barrel export
```

## 🎯 Categories Explained

### Operations
Daily operational tasks that keep the mess running smoothly:
- **Menu Planning**: Schedule breakfast, lunch, dinner menus
- **Attendance Tracking**: Mark who ate which meals

### Finances  
Money matters and billing:
- **Billing**: Collect payments, track dues, send reminders

### Communication
Staying in touch with members:
- **Announcements**: Send important updates to all members
- **Notifications**: Manage notification system

### Management
Administrative tasks:
- **Member Management**: View, edit, remove members
- **Join Requests**: Approve new member requests
- **Mess QR Code**: Generate QR for members to join

### Analytics
Insights and reporting:
- **Ratings View**: See feedback and ratings from members

## 🔄 Navigation Flow

```
Dashboard (Home)
    ├─→ Menu Planner (operations/)
    ├─→ Attendance (operations/)
    ├─→ Billing (finances/)
    ├─→ Announcements (communication/)
    ├─→ Members (management/)
    ├─→ Join Requests (management/)
    ├─→ Ratings (analytics/)
    ├─→ Notifications (communication/)
    ├─→ Mess QR (management/)
    └─→ Settings (AdminProfile)
```

## 📝 Adding New Features

### Operations Feature
Place in `operations/` if it's about:
- Daily tasks
- Meal management
- Attendance/presence

### Finance Feature
Place in `finances/` if it's about:
- Money/payments
- Billing/invoices
- Financial reports

### Communication Feature
Place in `communication/` if it's about:
- Messaging
- Notifications
- Announcements

### Management Feature
Place in `management/` if it's about:
- Member CRUD operations
- Access control
- Mess settings

### Analytics Feature
Place in `analytics/` if it's about:
- Reports
- Statistics
- Data visualization

## 🚀 Usage Example

```typescript
// In ManagerRouter.tsx
import { MenuPlanner } from '../components/manager/operations/MenuPlanner';
import { Billing } from '../components/manager/finances/Billing';
import { Announcements } from '../components/manager/communication/Announcements';
import { MemberManagement } from '../components/manager/management/MemberManagement';
import { RatingsView } from '../components/manager/analytics/RatingsView';
```

---

**Role**: Manager (mess owner/operator) - previously called "Admin"
**User Type**: Business user who runs the mess facility
