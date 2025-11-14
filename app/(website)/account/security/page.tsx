import SecurityForm from "@/app/_components/features/authentication/SecurityForm";
import { requireAuth } from "@/app/_services/apiAuth/server";
import { getProfileName } from "@/app/_services/apiProfileClient/server";

export default async function SecurityPage() {
  const user = await requireAuth();

  // Fetch data tambahan dari profile
  const name = await getProfileName(user.id);

  // Data yang dikirim ke form
  const initialData = {
    email: user.email,
    full_name: name ?? "",
  };

  return <SecurityForm initialData={initialData} />;
}
