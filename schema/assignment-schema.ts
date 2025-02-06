import { Status } from "@prisma/client";
import { z } from "zod";

export const assignmentSchema = z.object({
  driverId: z.string(),
  customerName: z.string().min(4, {
    message: "Please enter customer name",
  }),
  customerPhone: z
    .string()
    .min(10, {
      message: "Please enter a valid phone number",
    })
    .max(10, {
      message: "Please enter a valid phone number",
    }),
  customerAddress: z.string().min(4, {
    message: "Please enter customer address",
  }),
  amount: z.string().min(1, {
    message: "Please enter a amount",
  }),
  status: z.enum([Status.ASSIGNED, Status.PENDING, Status.COMPLETED]),
});

export const stepFormSchema = z.object({
  driverId: z.string(),
  amount: z.string().min(2, {
    message: "Please enter a valid amount!",
  }),
  status: z.enum([Status.COMPLETED]),
});
