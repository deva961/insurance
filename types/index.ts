import { Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  // password: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
}

export interface Showroom {
  id: string;
  name: string;
  location: string | null;
}

export interface Manager {
  id: string;
  userId: string;
  user?: User | null;
}

export interface Driver {
  id: string;
  userId: string;
  employeeId: string;
  license: string;
}

export interface Assignment {
  id: string;
  driverId: string;
  managerId: string | null;
  showroomId: string | null;
  pickupDate: Date;
  carPlate: string;
}
