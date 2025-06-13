'use client';

import { Suspense } from 'react';
import AuthPage from '@/app/auth/AuthPage';

export default function Auth() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}

