"use server";

import { db } from "@/lib/db";
import { assignmentSchema } from "@/schema/assignment-schema";
import { Role } from "@prisma/client";
import { z } from "zod";

export const getAssignments = async () => {
  try {
    const assignments = await db.assignment.findMany({
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        manager: true,
      },
    });

    return {
      data: assignments,
      message: "success",
      status: 200,
    };
  } catch (error) {
    return {
      data: [],
      message: "Failed to fetch assignment!",
      status: 500,
    };
  }
};

// getAssignments function
export const getAssignmentsForDriver = async (
  driverId: string,
  role: string
) => {
  try {
    let assignments;

    if (role === Role.ADMIN) {
      assignments = await db.assignment.findMany({
        include: {
          driver: {
            include: {
              user: true,
            },
          },
          manager: true,
        },
      });
    } else if (role === Role.DRIVER) {
      assignments = await db.assignment.findMany({
        where: {
          driverId,
        },
        include: {
          driver: {
            include: {
              user: true,
            },
          },
          manager: true,
        },
      });
    }

    return {
      data: assignments,
      message: "success",
      status: 200,
    };
  } catch (error) {
    return {
      data: [],
      message: "Failed to fetch assignment!",
      status: 500,
    };
  }
};

export const createAssignment = async (
  values: z.infer<typeof assignmentSchema>
) => {
  const validatedFields = assignmentSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      data: [],
      message: "Please fill all the fields!",
      status: 400,
    };
  }

  try {
    const res = await db.assignment.create({
      data: {
        driverId: validatedFields.data.driverId,
        carPlate: validatedFields.data.carPlate,
        pickupDate: validatedFields.data.pickupDate,
      },
    });
    return {
      status: 200,
      message: "success",
      data: res,
    };
    console.log(values);
  } catch (error) {
    return {
      data: [],
      message: "Failed to create assignment!",
      status: 500,
    };
  }
};
