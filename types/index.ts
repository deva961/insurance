import { Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  // password: string;
  role: Role;
}

export interface Driver {
  id: string;
  userId: string;
  employeeId: string;
}

export interface Assignment {
  id: string;
  driverId: string;
  managerId: string | null;
  showroomId: string | null;
  pickupDate: Date;
  carPlate: string;
}
