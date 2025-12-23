
import { supabase } from '@/lib/supabase';
import { Diet } from '@/lib/types';

export async function getDietByUserId(userId: string): Promise<Diet | null> {
  const { data, error } = await supabase
    .from('diet_targets')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return (data as Diet) ?? null;
}

export async function insertDiet(diet: Diet): Promise<Diet> {
  const { data, error } = await supabase
    .from('diet_targets')
    .insert(diet)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Diet;
}

export async function updateDiet(diet: Diet): Promise<Diet> {
  const { data, error } = await supabase
    .from('diet_targets')
    .update(diet)
    .eq('id', diet.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Diet;
}