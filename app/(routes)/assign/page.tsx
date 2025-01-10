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
        <CardTitle>Create Category</CardTitle>
        <CardDescription>
          Allows you to create a channels like arena, nexa, autozone etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssignForm />
      </CardContent>
    </Card>
  );
};

export default AssignPage;
