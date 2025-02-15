"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssignForm } from "@/app/_components/forms/assign-form";

export const StartProcess = ({ driverId }: { driverId: string }) => {
  const [start, setStart] = useState<boolean>(false);
  return (
    <>
      {!start && (
        <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
          <Button onClick={() => setStart(true)}>Start Today</Button>
        </div>
      )}

      {start && (
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
