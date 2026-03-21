'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupUser, clearError } from '@/store/slices/authSlice';

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser({ email, password, name }));
    if (result.meta.requestStatus === 'fulfilled') {
      router.push('/chat');
    }
  };

  return (
    <div className="flex items-center justify-center auth-bg noise page-scroll px-4">
      {/* Ambient orbs */}
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1.5">Start building beautiful emails</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/8 border border-red-500/15 rounded-xl text-red-400 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => dispatch(clearError())} className="text-red-400/60 hover:text-red-300 ml-2 text-lg leading-none">&times;</button>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className={`block text-xs font-medium mb-2 tracking-wide uppercase transition-colors ${focused === 'name' ? 'text-cyan-400' : 'text-gray-500'}`}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none input-glow transition-all duration-300"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 tracking-wide uppercase transition-colors ${focused === 'email' ? 'text-cyan-400' : 'text-gray-500'}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                required
                className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none input-glow transition-all duration-300"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 tracking-wide uppercase transition-colors ${focused === 'password' ? 'text-cyan-400' : 'text-gray-500'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                required
                minLength={8}
                className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-600 focus:outline-none input-glow transition-all duration-300"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-7 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:hover:from-cyan-600 disabled:hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-300 btn-shine shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
