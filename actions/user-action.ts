"use server";

import { hash } from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";
import { userExtendedSchema } from "@/schema/user-schema";
import { Driver, Manager, User } from "@/types";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export interface UserData extends User {
  manager: Manager | null;
  driver: Driver | null;
}

interface UserResponse {
  data: UserData[] | [];
  message: string;
  status: number;
}

export const getUsers = async (): Promise<UserResponse> => {
  const session = await auth();

  if (!session) {
    return {
      data: [],
      message: "You are not authenticated!",
      status: 401,
    };
  }

  if (
    session?.user.role !== Role.ADMIN &&
    session?.user.role !== Role.MANAGER
  ) {
    return {
      data: [],
      message: "You are not authorized to perform this action!",
      status: 403,
    };
  }

  const users = await db.user.findMany({
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      manager: true,
      driver: true,
    },
  });

  return {
    data: users,
    message: "success",
    status: 200,
  };
};

export const createUser = async (
  values: z.infer<typeof userExtendedSchema>
) => {
  const validatedFields = userExtendedSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.error.errors);
    return {
      message: "Invalid fields",
      status: 400,
    };
  }

  const { name, phone, email, role, showroomId, employeeId } =
    validatedFields.data;

  if (showroomId) {
    const showroom = await db.showroom.findUnique({
      where: {
        id: showroomId,
      },
    });

    if (!showroom) {
      return {
        message: "Showroom does not exist",
        status: 400,
      };
    }
  }

  if (role === Role.MANAGER) {
    const existingManager = await db.manager.findUnique({
      where: {
        showroomId,
      },
    });
    if (existingManager) {
      return {
        message: "showroom already has a manager!",
        status: 400,
      };
    }
  }

  if (role === Role.MANAGER && !showroomId) {
    return {
      data: [],
      message: "Please provide a showroom Id for the manager!",
      status: 400,
    };
  }

  if (role === Role.DRIVER && !showroomId) {
    return {
      data: [],
      message: "Please provide a showroom Id for the driver!",
      status: 400,
    };
  }

  if (role === Role.DRIVER && (!employeeId || employeeId.trim() === "")) {
    return {
      data: [],
      message: "Please provide an employee Id for the driver!",
      status: 400,
    };
  }

  if (role === Role.DRIVER && employeeId) {
    const verifyEmployeeId = await db.driver.findUnique({
      where: {
        employeeId,
      },
    });
    if (verifyEmployeeId) {
      return {
        message: "Driver with this employeeId already exists",
        status: 400,
      };
    }
  }

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

  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const firstFourCharsOfName = trimmedName.toLowerCase().slice(0, 4);
  const lastFourDigitsofPhone = trimmedPhone.slice(-4);
  const password = firstFourCharsOfName + lastFourDigitsofPhone;
  console.log(password);
  const hashedPassword = await hash(password, 10);

  const result = await db.$transaction(async (prisma) => {
    let user;
    try {
      // Create the user within the transaction
      user = await prisma.user.create({
        data: {
          name,
          phone,
          email,
          role,
          password: hashedPassword,
        },
      });

      // If the role is MANAGER, create manager and associate with showroom
      if (role === Role.MANAGER && showroomId) {
        const manager = await prisma.manager.create({
          data: {
            userId: user.id,
            showroomId: showroomId,
          },
        });

        // Associate the manager with the showroom
        if (manager) {
          await prisma.showroom.update({
            where: {
              id: showroomId,
            },
            data: {
              managerId: manager.id, // This is to associate the manager with the showroom
            },
          });
        }
      }

      // If the role is DRIVER, create driver and associate with showroom
      if (role === Role.DRIVER && showroomId && employeeId) {
        const driver = await prisma.driver.create({
          data: {
            userId: user.id,
            showroomId: showroomId,
            employeeId: employeeId,
            license: "license",
          },
        });

        // Associate the driver with the showroom
        if (driver) {
          await prisma.showroom.update({
            where: {
              id: showroomId,
            },
            data: {
              drivers: {
                connect: { id: driver.id },
              },
            },
          });
        }
      }

      revalidatePath("/users");
      return {
        data: user,
        message: "User created successfully!",
        status: 200, // OK
      };
    } catch (error) {
      return {
        data: null,
        message: "Failed to create!",
        status: 500, // Internal Server Error
      };
    }
  });

  return {
    data: result,
    message: "success",
    status: 200,
  };
};
