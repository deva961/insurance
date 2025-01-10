import { DriverAssignForm } from "@/app/_components/forms/driver-assign-form";
import { db } from "@/lib/db";

const page = async ({ params }: { params: { id: string } }) => {
  const data = await db.assignment.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!data) {
    return <>No Data found</>;
  }

  return <DriverAssignForm carPlate={data?.carPlate} />;
};

export default page;
