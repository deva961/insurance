import { ShowroomForm } from "@/app/_components/forms/showroom-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CreateShowroom = () => {
  return (
    <Card className="max-w-screen-xl">
      <CardHeader>
        <CardTitle>Create Location</CardTitle>
        <CardDescription>
          Allows you to create a showroom or service location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShowroomForm />
      </CardContent>
    </Card>
  );
};

export default CreateShowroom;
