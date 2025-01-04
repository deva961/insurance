'use server'

import { z } from "zod";
import { hash } from "bcryptjs";

import { db } from "@/lib/db";
import { User } from "@/types/user-type";
import { userSchema } from "@/schema/schema";

interface UserResponse {
  data?: User;
  message: string;
  status: number;
}

export const createUser = async (
  values: z.infer<typeof userSchema>
): Promise<UserResponse> => {
  const validatedFields = userSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.error.errors);
    return {
      message: 'Invalid fields',
      status: 400,
    };
  }

  const { name, phone, email, password } = validatedFields.data;

  //validate if user phone already exists
  const existingUser = await db.user.findUnique({
    where: {
      phone,
    },
  });

  if (existingUser) {
    return {
      message: "User with this phone number already exists",
      status: 400,
    };
  }

  const hashedPassword = await hash(password, 10);

  try {
    const user = await db.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
      },
    });
    return {
      data: user,
      message: "User created successfully",
      status: 201,
    };
  } catch (error) {
    return {
      message: "An error occurred while creating user",
      status: 500,
    };
  }
};
