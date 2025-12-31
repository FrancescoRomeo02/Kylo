import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return (data as Profile) ?? null;
}

export async function upsertProfile(payload: Partial<Profile> & { id: string }): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile;
}
