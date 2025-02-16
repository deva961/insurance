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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  initialColumnVisibility = {},
}: DataTableProps<TData, TValue> & {
  initialColumnVisibility?: VisibilityState;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Initialize the column visibility state with initialColumnVisibility or default value
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      ...initialColumnVisibility, // This will overwrite with passed prop if provided
    });

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

  // Export function
  const handleExport = () => {
    const customHeaders: Record<string, string> = {
      customerName: "Customer Name",
      customerPhone: "Customer Phone",
      amount: "Amount",
      startAddress: "Start Address",
      startTime: "Start Time",
      collectedAddress: "Collected Address",
      collectedTime: "Collected Time",
      "driver.user.name": "Agent",
      status: "Status",
    };

    const tableData = table.getSelectedRowModel().rows.map((row) => {
      const rowData: Record<string, string | number | boolean | unknown> = {};
      row.getVisibleCells().forEach((cell) => {
        if (cell.column.id !== "select" && cell.column.id !== "actions") {
          const header = customHeaders[cell.column.id] || cell.column.id;
          rowData[header] = cell.getValue();
        }
      });
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Records");
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
          />
          {isExportEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild onClick={handleExport}>
                  <Button>Export Excel</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select to export</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
