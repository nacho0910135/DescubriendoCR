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
