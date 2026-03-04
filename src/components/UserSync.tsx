'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function UserSync() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/auth/sync-user', { method: 'POST' }).catch(() => {});
  }, [isSignedIn]);

  return null;
}
