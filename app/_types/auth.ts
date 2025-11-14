// src/app/_lib/types/auth.ts

import { Session, User } from "@supabase/supabase-js";

/**
 * 🔹 Common reusable types for authentication and user data
 */
export type Credentials = {
  email: string;
  password: string;
};

export type SignupData = Credentials & {
  full_name: string;
  phone: string;
};

export type UpdateUserData = {
  full_name?: string;
  phone?: string;
  address?: string;
  password?: string;
};

export type UserProfile = {
  id: string;
  full_name: string;
  role: string;
};
/**
 * 🔹 Common response type for all auth actions
 */

export type AdminAuthData = { user: User; session: Session | null };

export type AuthResponse = {
  success?: boolean;
  message?: string;
};
