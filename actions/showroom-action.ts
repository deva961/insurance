"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Category, Manager, Showroom } from "@/types";
import { Role } from "@prisma/client";
import { showroomSchema } from "@/schema/showroom-schema";
import { revalidatePath } from "next/cache";

export interface ShowroomData extends Showroom {
  categoryId: string;
  category: Category;
  managerId: string | null;
  manager?: Manager | null;
  _count: {
    drivers: number;
  };
}

interface ShowroomResponse {
  data: ShowroomData[] | [];
  message: string;
  status: number;
}

export const getShowrooms = async (): Promise<ShowroomResponse> => {
  const session = await auth();

  if (!session) {
    return {
      data: [],
      message: "You are not authenticated!",
      status: 401,
    };
  }

  if (session?.user.role !== Role.ADMIN) {
    return {
      data: [],
      message: "You are not authorized to perform this action!",
      status: 403,
    };
  }

  try {
    const showrooms = await db.showroom.findMany({
      include: {
        category: true,
        manager: {
          select: {
            user: true,
          },
        },
        _count: {
          select: {
            drivers: true,
          },
        },
      },
    });

    const showroomData: ShowroomData[] = showrooms.map((showroom) => ({
      ...showroom,
      manager: showroom.manager
        ? {
            id: showroom.manager.user.id, // Assuming you want to include the user ID
            userId: showroom.manager.user.id, // Same as id
            user: showroom.manager.user, // Include the full user details
            createdAt: showroom.manager.user.createdAt,
            updatedAt: showroom.manager.user.updatedAt,
          }
        : null,
      _count: {
        drivers: showroom._count.drivers, // Count of drivers
      },
    }));

    return {
      data: showroomData,
      message: "success",
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      message: "Failed to fetch showrooms!",
      status: 500,
    };
  }
};

export const createShowroom = async (
  values: z.infer<typeof showroomSchema>
) => {
  const session = await auth();

  if (!session) {
    return {
      data: [],
      message: "You are not authenticated!",
      status: 401,
    };
  }

  if (session?.user.role !== Role.ADMIN) {
    return {
      data: [],
      message: "You are not authorized to perform this action!",
      status: 403,
    };
  }

  const validatedFields = showroomSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      data: [],
      message: "Please fill all the fields!",
      status: 400,
    };
  }

  const existingShowroom = await db.showroom.findUnique({
    where: {
      name: values.name,
    },
  });

  if (existingShowroom) {
    return {
      data: [],
      message: "Showroom already exists!",
      status: 400,
    };
  }

  const category = await db.category.findUnique({
    where: {
      id: values.categoryId,
    },
  });
  if (!category) {
    return {
      data: [],
      message: "Category not found!",
      status: 404,
    };
  }

  const showroom = await db.showroom.create({
    data: {
      name: values.name,
      categoryId: values.categoryId,
    },
  });
  revalidatePath("/showrooms");

  return {
    data: showroom,
    message: "Showroom created successfully!",
    status: 200,
  };
};
