"use client";

import { createUser } from "@/actions/user-action";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { userSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const RegisterForm = () => {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      role: Role.USER,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      const res = await createUser(values);
      if (res.status !== 201) {
        toast.error(res.message);
      }
      toast.success("User created successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating user");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} placeholder="Rahul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="97654*****"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="****@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="******"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="flex w-full">
          {isSubmitting ? (
            <Spinner />
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
};
