
import { createClient } from '@sanity/client';

// Use the same client as in sanity.ts
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2023-05-03',
});

// Create a new snap
export async function createSnap(snapData: any) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24hr expiry
  
  return await client.create({
    _type: 'snap',
    ...snapData,
    expiresAt,
    viewed: false
  });
}

// Get snaps for a specific user that are unviewed and not expired
export async function getSnapsByUser(userId: string) {
  return await client.fetch(
    `*[_type == "snap" && sender._ref == $userId && !viewed && dateTime(expiresAt) > dateTime(now())]`,
    { userId }
  );
}

// Get all unviewed snaps that are not expired
export async function getAllActiveSnaps() {
  return await client.fetch(
    `*[_type == "snap" && !viewed && dateTime(expiresAt) > dateTime(now())]`
  );
}

// Mark a snap as viewed
export async function markSnapAsViewed(snapId: string) {
  return await client
    .patch(snapId)
    .set({ viewed: true })
    .commit();
}

// Delete expired snaps (useful for scheduled cleanup)
export async function deleteExpiredSnaps() {
  const expiredSnaps = await client.fetch(
    `*[_type == "snap" && dateTime(expiresAt) < dateTime(now())]._id`
  );
  
  for (const snapId of expiredSnaps) {
    await client.delete(snapId);
  }
  
  return { deleted: expiredSnaps.length };
}
