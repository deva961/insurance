"use client";

import { updateDriverStatus } from "@/actions/driver-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DriverStatus } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { AssignForm } from "./forms/assign-form";

export const OptionForm = ({ driverId }: { driverId: string }) => {
  const [continueForm, setContinueForm] = useState<boolean>(false);
  const handleClick = async () => {
    const status = DriverStatus.OFFICE;
    try {
      const res = await updateDriverStatus(driverId, status);
      if (res?.status === 200) {
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <>
      {!continueForm && (
        <div className="space-y-5 min-h-[calc(100vh-160px)] p-5 flex flex-col items-center justify-center">
          <Button
            className="w-full bg-blue-600 py-5 "
            size={"lg"}
            onClick={() => setContinueForm(true)}
          >
            Continue (కొనసాగించండి)
          </Button>

          <Button
            className="w-full py-5 flex"
            size={"lg"}
            type="submit"
            variant={"destructive"}
            onClick={() => handleClick()}
          >
            Go to Showroom
          </Button>
        </div>
      )}

      {continueForm && (
        <Card className="max-w-screen-xl">
          <CardHeader>
            <CardTitle>Insurance</CardTitle>
            <CardDescription>Collect the amount from customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <AssignForm driverId={driverId} />
          </CardContent>
        </Card>
      )}
    </>
  );
};
