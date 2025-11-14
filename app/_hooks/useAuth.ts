"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  getAdminProfile,
  signinAdmin,
  verifyAdmin,
} from "../_services/apiAuth/client";

interface LoginData {
  email: string;
  password: string;
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: login, isPending } = useMutation<
    unknown, // return type (tidak kamu pakai)
    Error, // 🟢 tipe error yang eksplisit
    LoginData // tipe variabel input ({ email, password })
  >({
    mutationFn: ({ email, password }: LoginData) =>
      signinAdmin({ email, password }),
    onSuccess: async (user) => {
      console.log(user);
      queryClient.setQueryData(["user"], user);
      toast.success("Welcome back, Admin!", { duration: 2000 });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/admin");
    },
    onError: (err) => {
      toast.error(err.message || "Admin login failed.");
    },
  });

  return { login, isPending };
}

export function useVerifyAdmin() {
  return useQuery({
    queryKey: ["verifyAdmin"],
    queryFn: verifyAdmin,
    retry: false,
  });
}

export function useAdmin() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getAdminProfile,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}
