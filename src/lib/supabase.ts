import { createClient } from '@supabase/supabase-js';

// Supabase configuration provided in specifications
export const SUPABASE_URL = 'https://dxqezvkguswleoisxikz.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_4YjkMWzHSFnxb4eCe4ukkw_j-yaPhd6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface SupabaseUserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'traveler' | 'business_owner' | 'biologist' | 'guide';
  created_at?: string;
}

/**
 * Helper to fetch or create a user profile in Supabase
 */
export async function getOrCreateUserProfile(user: any): Promise<SupabaseUserProfile> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Profile fetch warning (using auth metadata fallback):', error.message);
    }

    if (data) {
      return data as SupabaseUserProfile;
    }

    // Default profile from auth metadata
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Explorador Tico',
      avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
      role: 'traveler',
    };
  } catch (err) {
    console.warn('Supabase profile error:', err);
    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || 'Explorador Tico',
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
      role: 'traveler',
    };
  }
}

/**
 * Upload fauna sighting photo directly to Supabase Storage bucket 'fauna-photos'
 * If storage bucket is not available or restricted, falls back gracefully to a data/object URL.
 */
export async function uploadFaunaPhotoToStorage(
  file: File | Blob, 
  fileName?: string
): Promise<{ url: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const cleanName = fileName ? fileName.replace(/[^a-zA-Z0-9.-]/g, '_') : `fauna_${timestamp}.jpg`;
    const filePath = `uploads/${timestamp}_${cleanName}`;

    // Upload to Supabase Storage 'fauna-photos'
    const { error: uploadError } = await supabase.storage
      .from('fauna-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload notice:', uploadError.message);
      // Return object URL as local preview fallback
      const fallbackUrl = typeof window !== 'undefined' ? URL.createObjectURL(file) : '';
      return { url: fallbackUrl, error: uploadError.message };
    }

    // Retrieve public URL
    const { data: publicData } = supabase.storage
      .from('fauna-photos')
      .getPublicUrl(filePath);

    return { url: publicData.publicUrl };
  } catch (err: any) {
    console.warn('Storage upload error fallback:', err);
    const fallbackUrl = typeof window !== 'undefined' ? URL.createObjectURL(file) : '';
    return { url: fallbackUrl, error: err?.message || 'Storage upload error' };
  }
}

/**
 * Record a user sighting in public.user_fauna_sightings
 */
export async function recordUserFaunaSightingInDB(
  userId: string,
  faunaId: string,
  notes?: string,
  lat?: number,
  lng?: number
) {
  try {
    const { error } = await supabase
      .from('user_fauna_sightings')
      .upsert({
        user_id: userId,
        fauna_id: faunaId,
        notes: notes || 'Avistado en la naturaleza costarricense',
        sighting_date: new Date().toISOString(),
      });
    if (error) {
      console.warn('Record sighting DB warning:', error.message);
    }
  } catch (e) {
    console.warn('Record sighting exception:', e);
  }
}

/**
 * Toggle like for a target item (fauna_photo, sighting, destination, service)
 */
export async function toggleLikeInDB(userId: string, targetType: string, targetId: string) {
  try {
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .maybeSingle();

    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
      return false; // unliked
    } else {
      await supabase.from('likes').insert({
        user_id: userId,
        target_type: targetType,
        target_id: targetId,
      });
      return true; // liked
    }
  } catch (e) {
    console.warn('Like toggle DB notice:', e);
    return true;
  }
}

/**
 * Toggle follow relationship in public.user_follows
 */
export async function toggleFollowUserInDB(followerId: string, followedId: string): Promise<boolean> {
  if (followerId === followedId) return false;
  try {
    const { data: existing } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('followed_id', followedId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('followed_id', followedId);
      return false; // unfollowed
    } else {
      await supabase.from('user_follows').insert({
        follower_id: followerId,
        followed_id: followedId,
      });
      return true; // followed
    }
  } catch (e) {
    console.warn('Follow toggle DB notice:', e);
    return true;
  }
}
