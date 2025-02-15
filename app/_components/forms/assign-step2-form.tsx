"use client";

import { stepFormSchema } from "@/schema/assignment-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Status } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { updateAssignment } from "@/actions/assignment-action";
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
import { useEffect } from "react";
import { useGeolocation } from "@/hooks/use-geo-location";

export const AssignFormStep = ({
  driverId,
  formId,
}: {
  driverId: string;
  formId: string;
}) => {
  const form = useForm<z.infer<typeof stepFormSchema>>({
    resolver: zodResolver(stepFormSchema),
    defaultValues: {
      driverId: driverId,
      amount: "",
      collectedAddress: "",
      collectedTime: new Date().toISOString(),
      status: Status.COMPLETED,
    },
  });

  const { address } = useGeolocation();

  useEffect(() => {
    if (address) {
      form.setValue("collectedAddress", address);
    }
  }, [address, form]);

  const { isSubmitting, errors } = form.formState;
  console.log(errors);

  const onSubmit = async (values: z.infer<typeof stepFormSchema>) => {
    try {
      const res = await updateAssignment(formId, driverId, values);
      if (res.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input type="file" capture={"environment"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Collecting..." : "Collect"}
        </Button>
      </form>
    </Form>
  );
};
