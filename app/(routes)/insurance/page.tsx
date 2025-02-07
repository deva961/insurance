import { getAssignmentsForDriver } from "@/actions/assignment-action";
import { getDriverById } from "@/actions/driver-action";
import { AssignForm } from "@/app/_components/forms/assign-form";
import { AssignFormStep } from "@/app/_components/forms/assign-step2-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DriverStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const Records = async () => {
  const session = await auth();

  // If the session does not exist, redirect to the sign-in page
  if (!session) {
    redirect("/auth/sign-in");
    return null; // Ensures rendering stops here and doesn't proceed
  }

  const userId = session.user.id;

  try {
    // Fetch the driver details by user ID
    const driver = await getDriverById(userId as string);

    // If no driver is found, return an error message
    if (!driver) {
      return (
        <div>
          <p>Driver not found!</p>
        </div>
      );
    }

    // Fetch the existing assignment for the driver
    const existingAssignment = await getAssignmentsForDriver(driver.id);

    // Check if the driver is busy and no assignment exists
    if (driver.status === DriverStatus.BUSY && !existingAssignment?.data) {
      return (
        <Card className="max-w-screen-xl">
          <CardHeader>
            <CardTitle>Insurance</CardTitle>
            <CardDescription>Collect the amount from customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 mt-10">
              <form
                action={async () => {
                  "use server";
                  await db.driver.update({
                    where: {
                      id: driver.id,
                    },
                    data: {
                      status: DriverStatus.AVAILABLE,
                    },
                  });
                  revalidatePath("/insurance");
                }}
              >
                <Button
                  variant={"destructive"}
                  type="submit"
                  className="w-full"
                >
                  Go to Showroom
                </Button>
              </form>

              <div className="space-x-5 flex items-center overflow-hidden justify-center">
                <Separator />
                <span>OR</span>
                <Separator />
              </div>
            </div>
            <AssignForm driverId={driver.id} />
          </CardContent>
        </Card>
      );
    }

    // Check if there is an existing assignment for the driver
    if (existingAssignment?.data && !Array.isArray(existingAssignment.data)) {
      return (
        <Card className="max-w-screen-xl">
          <CardHeader>
            <CardTitle>Insurance</CardTitle>
            <CardDescription>Collect the amount from customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <AssignFormStep
              formId={existingAssignment.data.id}
              driverId={driver.id}
            />
          </CardContent>
        </Card>
      );
    }

    // If no assignment exists and the driver is available, show the form to create a new assignment
    if (!existingAssignment?.data && driver.status === DriverStatus.AVAILABLE) {
      return (
        <Card className="max-w-screen-xl">
          <CardHeader>
            <CardTitle>Insurance</CardTitle>
            <CardDescription>Collect the amount from customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <AssignForm driverId={driver.id} />
          </CardContent>
        </Card>
      );
    }
  } catch (error) {
    console.error("Error fetching driver:", error);
    return (
      <div>
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }
};

export default Records;
