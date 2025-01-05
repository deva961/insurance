import { CategoryForm } from "@/app/_components/forms/category-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CreateCategory = () => {
  return (
    <Card className="max-w-screen-xl">
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
        <CardDescription>
          Allows you to create a channels like arena, nexa, autozone etc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryForm />
      </CardContent>
    </Card>
  );
};

export default CreateCategory;
