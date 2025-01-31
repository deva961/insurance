import {
  getAssignments,
  getAssignmentsForDriver,
} from "@/actions/assignment-action";
import { getDriverById } from "@/actions/driver-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

const Records = async () => {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.role) {
    return <div>Please log in to view assignments.</div>;
  }

  let records;

  // If the user is a DRIVER, fetch assignments for the driver
  if (session.user.role === Role.DRIVER) {
    const driver = await getDriverById(session.user.id);

    if (!driver) {
      return <>No driver found</>;
    }

    const response = await getAssignmentsForDriver(
      driver.id,
      session.user.role
    );

    // If no records are found for the driver
    if (!response.data || response.data.length === 0) {
      return <div>No assignments found.</div>;
    }

    records = response.data; // Set records for the driver
  }

  // If the user is an ADMIN, fetch all assignments
  if (session.user.role === Role.ADMIN) {
    const response = await getAssignments();

    // If no records are found for admin
    if (!response.data || response.data.length === 0) {
      return <div>No assignments found.</div>;
    }

    records = response.data;
  }

  if (!records) {
    return <>No records</>;
  }

  return (
    <div className="grid grid-cols-4 gap-5">
      {records.map((record, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Assignment {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {format(new Date(record.pickupDate), "PPP")}</p>
            <p>Car Plate: {record.carPlate}</p>
            <p>Status: {record.status}</p>
            <p>Driver Name: {record.driver.user.name}</p>
          </CardContent>
          <CardFooter>
            {session.user.role === Role.DRIVER && (
              <Button asChild>
                <Link href={`/records/driver/${record.id}`} className="w-full">
                  Continue
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Records;
