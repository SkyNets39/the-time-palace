import EditProfileForm from "@/app/_components/features/authentication/EditProfileForm";
import { requireAuth } from "@/app/_services/apiAuth/server";

import { Container } from "@mui/material";
import Breadcrumbs from "@/app/_components/UI/Breadcrumbs";
import {
  getClientInfo,
  getProfileName,
} from "@/app/_services/apiProfileClient/server";

export default async function EditProfilePage() {
  const user = await requireAuth();

  // 🧠 Fetch data profile + client secara paralel
  const [profileName, client] = await Promise.all([
    getProfileName(user.id),
    getClientInfo(user.id),
  ]);

  // Data awal yang akan dikirim ke Client Component
  const initialData = {
    email: user.email,
    full_name: profileName ?? "",
    phone: client?.phone ?? "",
    address: client?.address ?? "",
  };

  return (
    <Container>
      <Breadcrumbs />
      <EditProfileForm initialData={initialData} />
    </Container>
  );
}
