export interface Profile {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  role?: 'atleta' | 'coach' | null;
  coach_id?: string | null;
  email?: string | null;
}

export interface Diet {
  id: string;
  target_calories: number;
  target_protein?: number | null;
  target_carbs?: number | null;
  target_fats?: number | null;
  effective_from?: string | null;
  last_update?: string | null;
}

export interface foodEntry {
  id: string;
  user_id?: string | null;
  food_name: string;
  calories: number;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  meal_type?: 'colazione' | 'pranzo' | 'cena' | 'spuntino' | null;
  logged_at?: string | null;
}

export interface foodLogs {
  food_name: string;
  meal_type: 'colazione' | 'pranzo' | 'cena' | 'spuntino';
  amount: number;
}