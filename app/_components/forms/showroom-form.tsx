"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { getCategories } from "@/actions/category-action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "@/components/spinner";
import { showroomSchema } from "@/schema/showroom-schema";
import { createShowroom } from "@/actions/showroom-action";

export const ShowroomForm = () => {
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [isFormReady, setIsFormReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.status === 200 && res.data) {
          setCategories(res.data);
          setIsFormReady(true);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch channels");
      }
    };
    fetchCategories();
  }, []);

  // Only initialize the form once the categories are loaded
  const form = useForm<z.infer<typeof showroomSchema>>({
    resolver: zodResolver(showroomSchema),
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof showroomSchema>) {
    try {
      const res = await createShowroom(values);
      if (res.status === 200) {
        toast.success(res.message);
        form.reset();
        router.push("/showrooms");
      } else {
        toast.error(res.message);
      }
      console.log(values);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create showroom");
    }
  }

  // Don't render the form until categories are fetched and form is ready
  if (!isFormReady) {
    return <Spinner />; // Show a loading state until the form is ready
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Arena"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Showroom</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select a showroom" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        className="capitalize"
                        value={`${category.id}`}
                        key={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Save"}
          </Button>
        </form>
      </Form>
    </>
  );
};
