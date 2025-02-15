"use client";

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

import { createAssignment } from "@/actions/assignment-action";
import { assignmentSchema } from "@/schema/assignment-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Status } from "@prisma/client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useGeolocation } from "@/hooks/use-geo-location";
import { useEffect } from "react";

export const AssignForm = ({ driverId }: { driverId: string }) => {
  const { address } = useGeolocation();

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      driverId: driverId,
      customerName: "",
      customerPhone: "",
      startAddress: "",
      startTime: new Date().toISOString(),
      amount: "0",
      status: Status.ASSIGNED,
    },
  });

  useEffect(() => {
    if (address) {
      form.setValue("startAddress", address);
    }
  }, [address, form]);

  const { isSubmitting, errors } = form.formState;
  console.log(errors);

  const submit = async (values: z.infer<typeof assignmentSchema>) => {
    try {
      const res = await createAssignment(values);

      if (res?.status === 200) {
        toast.success("success");
        form.reset();
      } else {
        toast.error(res?.message || "Failed to create!");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Something went wrong while submitting .");
    }
  };

  if (!driverId) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Rahul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Phone</FormLabel>
              <FormControl>
                <Input placeholder="9848898488" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Starting..." : "Start"}
        </Button>
      </form>
    </Form>
  );
};
