'use client';

import { useActionState } from 'react';
import { login } from '../actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  // React 19 native form handling
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-[calc(100vh-104px)] flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        {state?.error && <p className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{state.error}</p>}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" name="email" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900" />
          </div>
          <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-50">
            {isPending ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
