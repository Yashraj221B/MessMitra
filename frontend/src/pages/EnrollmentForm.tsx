import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Utensils, CheckCircle, Clock } from 'lucide-react';

export default function EnrollmentForm() {
  const { enrollmentId } = useParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In production: await api.submitEnrollment(enrollmentId, formData)
      
      setSubmitted(true);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Enrollment Submitted! 🎉
          </h1>
          
          <p className="text-slate-600 mb-6">
            Your request has been sent to the mess manager for approval.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-blue-900">What's Next?</p>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              1. Manager will review and approve your request<br/>
              2. Payment will be recorded<br/>
              3. You can login with your phone & password
            </p>
            <div className="bg-white rounded-lg p-2 border border-blue-300">
              <p className="text-xs text-slate-600">Your Phone: <strong className="text-slate-800">{formData.phone}</strong></p>
              <p className="text-xs text-green-600 mt-1">✓ Password saved securely</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Your Details</p>
            <p className="font-semibold text-slate-800">{formData.name}</p>
            <p className="text-sm text-slate-600">{formData.phone}</p>
            <p className="text-sm text-slate-600">{formData.email}</p>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            You can close this page now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Join MessMitra
          </h1>
          <p className="text-slate-600">
            Fill in your details to enroll
          </p>
          <p className="text-xs text-slate-500 mt-2 font-mono">
            ID: {enrollmentId}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6 gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
          <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
          <div className={`h-1 w-12 ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Rahul Sharma"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9876543210"
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Your residential address"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 transition-all mt-6"
              >
                Next: Create Password →
              </button>
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-blue-800">
                  Create a password to login after approval
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600">Passwords don't match!</p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-200 text-slate-700 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.password || formData.password !== formData.confirmPassword}
                  className="w-2/3 bg-primary-600 disabled:bg-slate-400 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all disabled:cursor-not-allowed"
                >
                  Next: Review →
                </button>
              </div>
            </>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-slate-800 mb-3">Review Your Details</h3>
                <div><span className="text-xs text-slate-600">Name:</span> <span className="font-semibold text-slate-800">{formData.name}</span></div>
                <div><span className="text-xs text-slate-600">Phone:</span> <span className="font-semibold text-slate-800">{formData.phone}</span></div>
                <div><span className="text-xs text-slate-600">Email:</span> <span className="font-semibold text-slate-800">{formData.email}</span></div>
                <div><span className="text-xs text-slate-600">Address:</span> <span className="font-semibold text-slate-800 text-sm">{formData.address}</span></div>
                <div className="pt-2 border-t border-slate-300">
                  <span className="text-xs text-green-600">✓ Password set securely</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> Manager will review and approve. You'll be able to login with your phone & password after approval.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-200 text-slate-700 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-green-600 disabled:bg-green-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Enrollment ✓'
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          By enrolling, you agree to the mess terms and conditions.
        </p>
      </div>
    </div>
  );
}
