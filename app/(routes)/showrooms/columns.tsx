"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ShowroomData } from "@/actions/showroom-action";

export const columns: ColumnDef<ShowroomData>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return <div className="capitalize">{category?.name}</div>;
    },
  },
  {
    accessorFn: (row) => row.manager?.user?.name ?? "",
    header: "Manager",
    cell: ({ row }) => {
      const manager = row.original.manager;
      return <div className="capitalize">{manager?.user?.name ?? ""}</div>;
    },
  },
  {
    accessorFn: (row) => row._count.drivers,
    id: "_count.drivers",
    header: "Total Drivers",
    cell: ({ row }) => <div>{row.getValue("_count.drivers")}</div>,
  },
];
