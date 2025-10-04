import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberProfile from './pages/MemberProfile';
import AddMember from './pages/AddMember';
import Attendance from './pages/Attendance';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/members" element={<Layout><Members /></Layout>} />
        <Route path="/members/add" element={<Layout><AddMember /></Layout>} />
        <Route path="/members/:id" element={<Layout><MemberProfile /></Layout>} />
        <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
