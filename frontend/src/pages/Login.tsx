import { FormEvent, useState } from 'react';
import type { Page } from '../types';

interface LoginProps {
  onNavigate: (page: Page) => void;
  setUser: (user: any) => void;
}

export default function Login({ onNavigate, setUser }: LoginProps) {
  const [role, setRole] = useState<"student" | "instructor" | "admin">("student");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      if (data.user.role !== role) {
        setError(`Invalid credentials for ${role}. Please select the correct role or check your credentials.`);
        return;
      }

      const updatedUser = {
        ...data.user,
        token: data.token,
        isLoggedIn: true,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (updatedUser.role === 'student') onNavigate('studentDashboard');
      else if (updatedUser.role === 'instructor') onNavigate('instructorDashboard');
      else if (updatedUser.role === 'admin') onNavigate('adminDashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please make sure the server is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">

        {/* Left Side - Role Selection */}
        <div className="bg-[#032E3F] p-10 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">Login as</h2>
          <div className="space-y-4">
            <button
              onClick={() => setRole("student")}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                role === "student" ? "bg-white text-[#032E3F]" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("instructor")}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                role === "instructor" ? "bg-white text-[#032E3F]" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Instructor
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                role === "admin" ? "bg-white text-[#032E3F]" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Login as <span className="text-teal-600 capitalize">{role}</span>
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => onNavigate("signup")}
              className="text-teal-600 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
