"use server";

import { db } from "@/lib/db";
import { assignmentSchema, stepFormSchema } from "@/schema/assignment-schema";
import { DriverStatus, Role, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
export const getAssignmentsForDriver = async (driverId: string) => {
  try {
    const assignments = await db.assignment.findFirst({
      where: {
        driverId,
        status: { not: Status.COMPLETED },
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
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

export const createAssignment = async (
  values: z.infer<typeof assignmentSchema>
) => {
  // Validate the fields using the schema
  const validatedFields = assignmentSchema.safeParse(values);

  if (!validatedFields.success) {
    // If validation fails, return with the validation error messages
    return {
      data: [],
      message: validatedFields.error.errors
        .map((err) => err.message)
        .join(", "),
      status: 400,
    };
  }

  // Extract validated values
  const { driverId, customerName, customerPhone, customerAddress, amount } =
    validatedFields.data;

  const existingAssignment = await db.assignment.findFirst({
    where: {
      driverId,
      status: Status.PENDING,
    },
  });

  // If an assignment already exists, return an error message
  if (existingAssignment) {
    return {
      data: [],
      message: "An assignment for this customer already exists.",
      status: 400,
    };
  }

  try {
    const [newAssignment, updateDriverStatus] = await db.$transaction([
      db.assignment.create({
        data: {
          driverId,
          customerName,
          customerPhone,
          customerAddress,
          amount,
          status: Status.PENDING,
        },
      }),
      db.driver.update({
        where: { id: driverId },
        data: {
          status: DriverStatus.BUSY,
        },
      }),
    ]);
    revalidatePath("/records");
    return {
      status: 200,
      message: "Assignment created successfully",
      data: newAssignment,
    };
  } catch (error) {
    // Log and return the error
    console.error("Error creating assignment:", error);

    return {
      data: [],
      message: "Failed to create assignment due to an internal error.",
      status: 500,
    };
  }
};

export const updateAssignment = async (
  id: string,
  driverId: string,
  values: z.infer<typeof stepFormSchema>
) => {
  const validatedFields = stepFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      data: [],
      message: "Please fill all the fields correctly!",
      status: 400,
    };
  }

  try {
    const updatedAssignment = await db.assignment.update({
      where: { id, driverId },
      data: {
        amount: values.amount,
        status: values.status,
      },
    });
    revalidatePath("/records");
    return {
      status: 200,
      message: "Assignment updated successfully",
      data: updatedAssignment,
    };
  } catch (error) {
    console.error("Error updating assignment:", error);

    return {
      data: [],
      message: "Failed to update assignment due to an internal error.",
      status: 500,
    };
  }
};
