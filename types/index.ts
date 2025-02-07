import { Role, Status } from "@prisma/client";

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
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  amount: string;
  status: Status;
}
