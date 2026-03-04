'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { checkRole } from '@/lib/roles';

export async function makeAdmin(formData: FormData): Promise<void> {
  const allowed = await checkRole('admin');
  if (!allowed) throw new Error('Not authorized');

  const id = formData.get('id') as string | null;
  if (!id) throw new Error('Missing user id');

  const client = await clerkClient();
  await client.users.updateUserMetadata(id, {
    publicMetadata: { role: 'admin' },
  });

  revalidatePath('/admin/users');
}

export async function removeAdmin(formData: FormData): Promise<void> {
  const allowed = await checkRole('admin');
  if (!allowed) throw new Error('Not authorized');

  const id = formData.get('id') as string | null;
  if (!id) throw new Error('Missing user id');

  const client = await clerkClient();
  await client.users.updateUserMetadata(id, {
    publicMetadata: { role: null },
  });

  revalidatePath('/admin/users');
}

