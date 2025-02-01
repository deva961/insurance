import { z } from "zod";
import { Role } from "@prisma/client";

export const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 characters.",
    })
    .max(10, {
      message: "Phone number must be at most 10 characters.",
    }),
  email: z.string().optional(),
  role: z.enum([Role.ADMIN, Role.MANAGER, Role.DRIVER, Role.USER]),
});

export const userExtendedSchema = userSchema.extend({
  showroomId: z.string().optional(),
  employeeId: z.string().optional(),
});

export const registerationSchema = userSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 characters.",
    })
    .max(10, {
      message: "Phone number must be at most 10 characters.",
    }),
  email: z.string().optional(),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
  role: z.enum([Role.ADMIN, Role.MANAGER, Role.DRIVER, Role.USER]),
});
