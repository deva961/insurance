import { auth, signOut } from "@/lib/auth";
import { NOT_LOGGED_IN } from "@/routes";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (session && session.user.role === Role.DRIVER) {
    redirect("/records");
  }

  return (
    <>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: NOT_LOGGED_IN,
          });
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
}
