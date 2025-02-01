import { AssignForm } from "@/app/_components/forms/assign-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AssignPage = async () => {
  return (
    <Card className="max-w-screen-xl">
      <CardHeader>
        <CardTitle>Create Assignment</CardTitle>
        <CardDescription>
          Allows you to create a new assignment to a driver.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssignForm />
      </CardContent>
    </Card>
  );
};

export default AssignPage;
