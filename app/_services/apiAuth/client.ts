import { createClient } from "../supabase/client";
import type {
  Credentials,
  SignupData,
  UpdateUserData,
  AuthResponse,
  AdminAuthData,
} from "@/app/_types";

//public
export async function signupUser({
  email,
  password,
  full_name,
  phone,
}: SignupData): Promise<AuthResponse> {
  const supabase = await createClient();

  // 1️⃣ Register to Supabase Auth
  const { data: signupData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);

  const user = signupData.user;
  if (!user) throw new Error("Signup successful, please verify your email.");

  // 2️⃣ Insert into profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    full_name,
    role: "user",
  });

  if (profileError) throw new Error(profileError.message);

  // 3️⃣ Insert into clients
  const { error: clientError } = await supabase.from("clients").insert({
    id: user.id,
    phone,
  });

  if (clientError) throw new Error(clientError.message);

  return { success: true };
}

//public
export async function signinUser({
  email,
  password,
}: Credentials): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  const user = data.user;
  if (!user) throw new Error("Login failed. User not found.");

  return { success: true };
}

//admin
export async function signinAdmin({
  email,
  password,
}: Credentials): Promise<AdminAuthData> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    const user = data.user;
    if (!user) throw new Error("Login failed. User not found.");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      throw new Error("Unable to verify user role.");
    }

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      throw new Error("Access denied. You are not authorized as admin.");
    }

    return data;
  } catch (err) {
    console.error("signinAdmin error:", err); // Debug
    throw err; // Re-throw biar masuk ke onError
  }
}

//both
export async function signoutUser(): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);

  return { success: true };
}

//public
export async function updateUserInformation({
  full_name,
  phone,
  address,
  password,
}: UpdateUserData): Promise<AuthResponse> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Unauthorized");

  // 1️⃣ Update password (Supabase Auth)
  if (password && password.trim().length > 0) {
    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError) throw new Error(pwError.message);
  }

  // 2️⃣ Update profile (full_name)
  if (full_name) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name })
      .eq("id", user.id);

    if (profileError) throw new Error(profileError.message);
  }

  // 3️⃣ Update client (phone + address)
  const updates: Record<string, string> = {};
  if (phone) updates.phone = phone;
  if (address) updates.address = address;

  if (Object.keys(updates).length > 0) {
    const { error: clientError } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", user.id);

    if (clientError) throw new Error(clientError.message);
  }

  return { success: true };
}

//public
export async function getProfileName(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile name:", error.message);
    return null;
  }

  return data?.full_name;
}

//admin
export async function verifyAdmin(): Promise<AuthResponse> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "User not logged in." };
  }

  // Check profile role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, message: "User profile not found." };
  }

  if (profile.role !== "admin") {
    return { success: false, message: "Access denied. Not an admin." };
  }

  return { success: true };
}

//admin
export async function getAdminProfile() {
  const supabase = await createClient();

  // 1️⃣ Get current user session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not logged in.");

  // 2️⃣ Get profile info (full_name, role, etc.)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) throw new Error("Profile not found.");

  return {
    id: user.id,
    email: user.email,
    full_name: profile.full_name,
    role: profile.role,
  };
}
