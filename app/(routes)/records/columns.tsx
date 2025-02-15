"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { DriverData } from "@/actions/driver-action";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/types";
import { currencyFormatter } from "@/components/currency-formatter";

export interface AssignmentData extends Assignment {
  driver: DriverData;
}

export const columns: ColumnDef<AssignmentData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("customerName")}</div>
    ),
  },
  {
    accessorKey: "customerPhone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("customerPhone")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Collected Amount",
    cell: ({ row }) => {
      const amount: string = row.getValue("amount");
      return <div>{currencyFormatter(parseInt(amount))}</div>;
    },
  },
  {
    accessorKey: "startAddress",
    header: "Start Address",
    cell: ({ row }) => {
      return <div>{row.getValue("startAddress")}</div>;
    },
  },
  {
    accessorKey: "collectedAddress",
    header: "Collect Address",
    cell: ({ row }) => {
      return <div>{row.getValue("collectedAddress")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return (
        <Badge
          variant="outline"
          className={cn(
            status === "ASSIGNED" && "bg-blue-500/10  text-blue-800 ",
            status === "PENDING" && "bg-orange-500/10  text-orange-800 ",
            status === "COMPLETED" && "bg-green-500/10 text-green-800"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorFn: (row) => row.driver.user.name,
    header: "Agent",
    id: "driver.user.name",
    cell: ({ row }) => <div>{row.getValue("driver.user.name")}</div>,
  },
];
