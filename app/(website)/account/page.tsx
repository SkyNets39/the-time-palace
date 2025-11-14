import { requireAuth } from "@/app/_services/apiAuth/server";
import { redirect } from "next/navigation";

export default async function Page() {
  await requireAuth();
  redirect("/account/edit-profile");
}
