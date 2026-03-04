import { auth, clerkClient } from '@clerk/nextjs/server';
import type { Roles } from '@/types/globals';

export async function checkRole(role: Roles): Promise<boolean> {
  const { sessionClaims, userId } = await auth();

  // Prefer role from session claims if available (when session token is customized)
  const metadata = sessionClaims?.metadata as { role?: Roles } | undefined;
  if (metadata?.role) {
    return metadata.role === role;
  }

  // Fallback: fetch user and read publicMetadata.role
  if (!userId) return false;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const publicRole = (user.publicMetadata as { role?: Roles } | null)?.role;

  return publicRole === role;
}
