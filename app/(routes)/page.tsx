import { auth, signOut } from "@/lib/auth";
import { NOT_LOGGED_IN } from "@/routes";

export default async function Page() {
  const session = await auth();

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
