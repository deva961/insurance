import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
    {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: "/login",
          });
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
}
