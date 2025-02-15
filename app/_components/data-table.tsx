"use client";

import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { DataTablePagination } from "../_components/pagination";
import { DataTableViewOptions } from "../_components/view-options";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterTitle: string;
  filterKey: string;
  disabled: boolean;
  createUrl?: string;
  isExportEnabled?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterTitle,
  filterKey,
  createUrl,
  isExportEnabled = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  //export funciton
  const handleExport = () => {
    // Define custom headers, ensure driver.user.name is correctly mapped
    const customHeaders: Record<string, string> = {
      customerName: "Customer Name",
      customerPhone: "Customer Phone",
      amount: "Amount",
      startAddress: "Start Address",
      collectedAddress: "Collected Address",
      "driver.user.name": "Agent",
    };

    // Get the table data, skipping the "select" column and applying custom headers
    const tableData = table.getRowModel().rows.map((row) => {
      const rowData: Record<string, string | number | boolean | unknown> = {};

      row.getVisibleCells().forEach((cell) => {
        // Skip the "select" column
        if (cell.column.id !== "select") {
          // Map column id to custom header name
          const header = customHeaders[cell.column.id] || cell.column.id;
          rowData[header] = cell.getValue();
        }
      });

      return rowData;
    });

    // Create the worksheet with the modified data
    const ws = XLSX.utils.json_to_sheet(tableData);

    // Create a new workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Records");

    // Write the workbook to a file
    XLSX.writeFile(wb, "records.xlsx");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={`Search ${filterTitle}...`}
            value={
              (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          {isExportEnabled && (
            <Button onClick={handleExport}>Export Excel</Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {createUrl && (
            <Button
              asChild
              size={"sm"}
              className="ml-auto h-8"
              variant={"outline"}
            >
              <Link href={`${createUrl}`} className="!gap-1">
                <Plus className=" !size-3.5 text-sm" /> Create&nbsp;
              </Link>
            </Button>
          )}
          {/* {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              disabled={disabled}
              size={"sm"}
              className="ml-auto"
              variant={"outline"}
            >
              <Trash className="size-3.5 text-sm" /> Delete
              <span>({table.getFilteredSelectedRowModel().rows.length})</span>
            </Button>
          )} */}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
