'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { UserSync } from '@/components/UserSync';
import { PwaRegister } from '@/components/PwaRegister';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <UserSync />
      <PwaRegister />
      {children}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </ClerkProvider>
  );
}
