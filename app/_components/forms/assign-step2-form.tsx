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
import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/use-geo-location";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/compress-img";

export const AssignFormStep = ({
  driverId,
  formId,
}: {
  driverId: string;
  formId: string;
}) => {
  const [image, setImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof stepFormSchema>>({
    resolver: zodResolver(stepFormSchema),
    defaultValues: {
      driverId: driverId,
      amount: "",
      collectedAddress: "",
      image: "",
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (image) {
      URL.revokeObjectURL(image);
    }

    if (file) {
      try {
        const compressedImage = await compressImage(file);
        const imageUrl = URL.createObjectURL(compressedImage);

        setImage(imageUrl);
        form.setValue("image", imageUrl);
      } catch (error) {
        console.log("Error while handling image change", error);
      }
    }
  };

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

        <div>
          {!image ? (
            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <ImageIcon className="mx-auto size-12 text-gray-300" />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md mx-auto font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        capture={"environment"}
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs/5 text-gray-600">
                    (ఫోటోను అప్‌లోడ్ చేయండి)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Image
              src={image}
              alt="image"
              height={250}
              width={250}
              loading="lazy"
            />
          )}
        </div>

        {/* <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  capture={"environment"}
                  {...field}
                />
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
