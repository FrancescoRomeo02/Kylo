import { supabase } from '@/lib/supabase';
import { foodLogs } from '@/lib/types';

export async function getFoodLogsByUserId(userId: string): Promise<foodLogs[]> {
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data as foodLogs[];
}

export async function insertFoodLog(entry: foodLogs & { user_id: string }): Promise<foodLogs> {
  const { data, error } = await supabase
    .from('food_logs')
    .insert(entry)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as foodLogs;
}

export async function deleteFoodLog(id: string): Promise<void> {
  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}