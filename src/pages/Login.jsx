import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Mail, Lock } from 'lucide-react';
import { api } from '../api';

const Login = ({ setAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      try {
        const profileRes = await api.get('/user/profile');
        localStorage.setItem('user', JSON.stringify(profileRes.data));
      } catch {
        // Fallback if profile fetch fails
        localStorage.setItem('user', JSON.stringify({ email: formData.email }));
      }
      
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans antialiased text-gray-900 w-full h-full">
      <div className="max-w-md w-full">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30 mb-6 group transition-all hover:scale-105">
            <Briefcase size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 mt-2 font-medium">Log in to your GraphHire account</p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-10 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium placeholder-gray-400 text-gray-900"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium placeholder-gray-400 text-gray-900"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold flex items-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-purple-600/30 text-white font-bold bg-purple-600 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-purple-600 hover:text-purple-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
