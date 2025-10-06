import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Utensils, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card, Alert } from '../components/common';
import useForm from '../hooks/useForm';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const { values, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      email: 'testuser@security.yashraj221b.me',
      password: '#@ausbdio$242uashd',
    },
    onSubmit: async (formValues) => {
      setError('');
      try {
        await login(formValues.email, formValues.password);
        navigate('/dashboard');
      } catch (err) {
        setError('Login failed. Please try again.');
        throw err;
      }
    },
    validate: (formValues) => {
      const errors: any = {};
      if (!formValues.email) errors.email = 'Email is required';
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Manager Login</h1>
          <p className="text-slate-600">Access the management dashboard</p>
        </div>

        {/* Login Form */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={values.email}
              onChange={handleChange}
              placeholder="your@email.com"
              variant="primary"
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
              variant="primary"
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
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
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
