import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MemberAuthProvider } from './contexts/MemberAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MemberProtectedRoute from './components/MemberProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import MemberLogin from './pages/MemberLogin';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import AddMember from './pages/AddMember';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import GenerateEnrollmentQR from './pages/GenerateEnrollmentQR';
import EnrollmentForm from './pages/EnrollmentForm';
import ScanAttendanceQR from './pages/ScanAttendanceQR';
import MemberDashboard from './pages/MemberDashboard';
import Layout from './components/Layout';
import MemberLayout from './components/MemberLayout';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = "MessMitra - Yashraj221B";
  }, []);
  return (
    <AuthProvider>
      <MemberAuthProvider>
        <Router>
          <Routes>
            {/* Landing Page - Choose Login Type */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Routes */}
            <Route path="/enroll/:enrollmentId" element={<EnrollmentForm />} />
            
            {/* Manager Authentication */}
            <Route path="/manager/login" element={<Login />} />
            
            {/* Member Authentication Routes */}
            <Route path="/member/login" element={<MemberLogin />} />
            <Route 
              path="/member/dashboard" 
              element={
                <MemberProtectedRoute>
                  <MemberLayout>
                    <MemberDashboard />
                  </MemberLayout>
                </MemberProtectedRoute>
              } 
            />

          {/* Protected Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Layout><Members /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/add"
            element={
              <ProtectedRoute>
                <Layout><AddMember /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:id"
            element={
              <ProtectedRoute>
                <Layout><MemberProfile /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Layout><Attendance /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout><Reports /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/generate-qr"
            element={
              <ProtectedRoute>
                <Layout><GenerateEnrollmentQR /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan-attendance"
            element={
              <ProtectedRoute>
                <Layout><ScanAttendanceQR /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </MemberAuthProvider>
    </AuthProvider>
  );
}

export default App;
