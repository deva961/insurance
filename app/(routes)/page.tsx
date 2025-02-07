import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (session && session.user.role === Role.DRIVER) {
    redirect("/insurance");
  }

  return <p>Coming Soon</p>;
}
