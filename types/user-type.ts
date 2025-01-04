import { Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  role: Role;
}
