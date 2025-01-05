"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema } from "@/schema/category-schema";
import { Category } from "@/types";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface CategoryData extends Category {
  _count: {
    showrooms: number;
  };
}

interface CategoryResponse {
  data: CategoryData[] | [];
  message: string;
  status: number;
}

export const getCategories = async (): Promise<CategoryResponse> => {
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
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { showrooms: true },
        },
      },
    });

    return {
      data: categories,
      message: "success",
      status: 200,
    };
  } catch (error) {
    return {
      data: [],
      message: "Failed to fetch categories!",
      status: 500,
    };
  }
};

export const createCategory = async (
  values: z.infer<typeof categorySchema>
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

  const validatedFields = categorySchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      data: [],
      message: "Please fill all the fields!",
      status: 400,
    };
  }

  const existingCategory = await db.category.findUnique({
    where: {
      name: values.name,
    },
  });

  if (existingCategory) {
    return {
      data: [],
      message: "Category already exists!",
      status: 400,
    };
  }

  try {
    const category = await db.category.create({
      data: {
        name: values.name,
      },
    });
    revalidatePath("/category");
    return {
      data: category,
      message: "Category created successfully!",
      status: 200, // OK
    };
  } catch (error) {
    console.log(error);
    return {
      data: [],
      message: "Failed to create category!",
      status: 500, // Internal Server Error
    };
  }
};
