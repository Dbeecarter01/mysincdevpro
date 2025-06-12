'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle query params
  useEffect(() => {
    const prefillEmail = searchParams.get('prefill');
    const signupSuccess = searchParams.get('signup') === 'success';

    if (signupSuccess) {
      setIsLogin(true);
      setEmail(prefillEmail || '');
      setSuccessMessage('Signup successful! Please log in.');

      // Clean the URL
      setTimeout(() => {
        router.replace('/auth');
      }, 100);
    }
  }, [searchParams, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;

        router.push(`/auth?prefill=${encodeURIComponent(email)}&signup=success`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </h2>

          {successMessage && (
            <div className="text-green-700 bg-green-100 p-3 rounded text-sm text-center">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? isLogin
                  ? 'Logging in...'
                  : 'Signing up...'
                : isLogin
                  ? 'Login'
                  : 'Sign Up'}
            </Button>
          </form>

          <p
            className="text-sm text-center text-blue-600 cursor-pointer hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
