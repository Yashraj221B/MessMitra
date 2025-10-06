import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemberAuth } from '../contexts/MemberAuthContext';
import { User, ArrowLeft, LogIn } from 'lucide-react';
import { Button, Input, Card, Alert } from '../components/common';
import useForm from '../hooks/useForm';

export default function MemberLogin() {
  const navigate = useNavigate();
  const { login } = useMemberAuth();
  const [error, setError] = useState('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      phone: '9123456789',
      password: 'sgdvfadsyuf',
    },
    onSubmit: async (formValues) => {
      setError('');
      try {
        await login(formValues.phone, formValues.password);
        navigate('/member/dashboard');
      } catch (err) {
        setError('Invalid credentials. Please try again.');
        throw err;
      }
    },
    validate: (formValues) => {
      const errors: any = {};
      if (!formValues.phone) errors.phone = 'Phone number is required';
      if (formValues.phone.length !== 10) errors.phone = 'Phone must be 10 digits';
      if (!formValues.password) errors.password = 'Password is required';
      return errors;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Member Login</h1>
          <p className="text-slate-600">Access your mess dashboard</p>
        </div>

        {/* Login Form */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              value={values.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength={10}
              variant="blue"
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              variant="blue"
              required
            />

            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={LogIn}
              iconPosition="left"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </a>
          </div>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          By signing in, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
