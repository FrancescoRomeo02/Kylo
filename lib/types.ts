export interface Profile {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  role?: 'atleta' | 'coach' | null;
  coach_id?: string | null;
  email?: string | null;
}

