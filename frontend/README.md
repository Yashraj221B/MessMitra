# MessMitra Frontend

A modern, bilingual mess management system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Dual Role System**: Separate interfaces for administrators and students
- **Bilingual Support**: English, Hindi, and Marathi
- **Password Authentication**: Secure login system
- **Mobile-First Design**: Optimized for mobile devices
- **Modern UI**: Built with Radix UI and Tailwind CSS
- **Type-Safe**: Full TypeScript support

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Yashraj221B/MessMitra.git
cd MessMitra/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/        # React components
│   ├── admin/        # Admin-specific components
│   ├── student/      # Student-specific components
│   ├── ui/           # Reusable UI components (Radix UI)
│   └── ...           # Other shared components
├── config/           # Configuration files
├── constants/        # Application constants
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── services/         # Business logic and API calls
├── styles/           # Global styles
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 🎨 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons
- **Motion** - Animations
- **Sonner** - Toast notifications

## 👥 User Roles

### Admin (Mess Owner)
- Dashboard with analytics
- Menu planning and management
- Attendance tracking
- Billing and payments
- Member management
- Announcements
- Ratings and feedback view

### Student
- Personal dashboard
- QR code for attendance
- Menu calendar
- Leave management
- Payment history
- Feedback and ratings
- Profile settings

## 🔐 Demo Credentials

### Admin
- Phone: 8446150310
- Password: 1234

### Student
- Phone: 9876543211
- Password: 1234

## 🌐 API Integration

The app is currently using a mock database for development. To integrate with a real backend:

1. Set `VITE_API_URL` in `.env`
2. Set `VITE_ENABLE_MOCK_API=false`
3. Implement API calls in `src/services/`

See `src/constants/api.constants.ts` for available API endpoints.

## 📱 PWA Support

The app is PWA-ready. To enable:

1. Build the app: `npm run build`
2. Serve the `dist` folder with a static server
3. The app will be installable on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Yashraj221B**

- GitHub: [@Yashraj221B](https://github.com/Yashraj221B)

## 🙏 Acknowledgments

- Radix UI for accessible components
- Tailwind CSS for styling utilities
- Lucide for beautiful icons
