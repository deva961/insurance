"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getShowrooms } from "@/actions/showroom-action";
import { createUser } from "@/actions/user-action";
import { Spinner } from "@/components/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userExtendedSchema } from "@/schema/user-schema";
import { Showroom } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Role } from "@prisma/client";

export const UserForm = () => {
  const [showrooms, setShowrooms] = useState<Showroom[] | []>([]);
  const [isFormReady, setIsFormReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        const res = await getShowrooms();
        if (res.data && res.status === 200) {
          setShowrooms(res.data);
          setIsFormReady(true);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch showrooms!");
      }
    };

    fetchShowrooms();
  }, []);

  // Use userExtendedSchema for form validation
  const form = useForm<z.infer<typeof userExtendedSchema>>({
    resolver: zodResolver(userExtendedSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: Role.USER,
      showroomId: "",
      employeeId: "",
    },
  });

  const role = form.watch("role");
  const { isSubmitting } = form.formState;

  console.log(form.formState.errors);

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof userExtendedSchema>) {
    try {
      console.log("Form Values:", values); // Check the form values in console

      // Uncomment and call your createUser API
      const res = await createUser(values);
      if (res.status === 200) {
        toast.success(res.message);
        form.reset();
        router.push("/users");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error during user creation:", error);
      toast.error("Error during user creation!");
    }
  }

  if (!isFormReady) {
    return <Spinner />;
  }

  return (
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
                <Input placeholder="Rahul" disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="9848898488"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="rahul@gmail.com"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                value={field.value} // Bind the select value to the form
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                  <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                  <SelectItem value={Role.DRIVER}>Driver</SelectItem>
                  <SelectItem value={Role.USER}>User</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {(role === Role.DRIVER || role === Role.MANAGER) && (
          <FormField
            control={form.control}
            name="showroomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Showroom</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a showroom" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {showrooms?.map((showroom) => (
                      <SelectItem key={showroom.id} value={`${showroom.id}`}>
                        {showroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {role === Role.DRIVER && (
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Id</FormLabel>
                <Input placeholder="9832" disabled={isSubmitting} {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};
