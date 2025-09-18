"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Table as TableType
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TanStackTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  selectionMode?: 'single' | 'multiple';
  isLoading?: boolean;
  onRowClick?: (row: any, event?: React.MouseEvent) => void;
  isCheckbox?: boolean;
  setNumberOfSelectedRows?: (numberOfSelectedRows: number) => void;
}

export const TanStackTable = React.forwardRef<TableType<any>, TanStackTableProps<any, any>>(
  (
    { 
      columns, 
      data,
      pageSize = 50,
      selectionMode = 'single',
      isLoading = false,
      onRowClick,
      isCheckbox = true,
      setNumberOfSelectedRows,
    },
    ref
  ) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const checkboxColumn: ColumnDef<any> = {
      id: "checkbox-select",
      header: ({ table }) => (
        <div data-checkbox="header">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div data-checkbox="cell">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: {
        align: "center"
      },
      size: 30,
    };

    const tableColumns = isCheckbox ? [checkboxColumn, ...columns] : columns;

    const table = useReactTable({
      data,
      columns: tableColumns,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      initialState: {
        pagination: {
          pageSize: pageSize
        }
      },
      enableMultiRowSelection: selectionMode === 'multiple',
    });

    // Expose the table instance via the ref
    React.useImperativeHandle(ref, () => table, [table]);

    const handleRowClick = (row: any, event: React.MouseEvent) => {
      // Check if the click target is the checkbox or its container
      const target = event.target as HTMLElement;
      const isCheckboxClick = target.closest('[data-checkbox]') || 
                             target.closest('input[type="checkbox"]') ||
                             target.tagName === 'INPUT' ||
                             target.getAttribute('role') === 'checkbox';
      
      // Only handle row selection if clicking on checkbox
      if (isCheckboxClick) {
        event.stopPropagation();
        if (selectionMode === 'single') {
          table.resetRowSelection();
          row.toggleSelected(true);
        } else {
          row.toggleSelected(!row.getIsSelected());
        }
        setNumberOfSelectedRows?.(table.getSelectedRowModel().rows.length);
      }
      
      // Always call onRowClick if provided, regardless of where the click occurred
      if (onRowClick) {
        onRowClick(row, event);
      }
    };

    React.useEffect(() => {
      setNumberOfSelectedRows?.(table.getSelectedRowModel().rows.length);
    }, [rowSelection]);

    return (
      <div className="overflow-x-auto rounded border h-full flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
         
        <Table className="flex-1">
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      header.id === 'checkbox-select'
                        ? 'text-left min-w-[20px] w-[20px] pl-2'
                        : 'text-left'
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    ${index === table.getRowModel().rows.length - 1 ? "border-b-important" : ""}
                    ${row.getIsSelected() ? "bg-muted/50 hover:bg-muted/50" : "hover:bg-muted/50"}
                    cursor-pointer
                  `}
                  onClick={(event) => handleRowClick(row, event)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = (cell.column.columnDef.meta as any)?.align || 'left';
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === 'checkbox-select'
                            ? `text-${align} min-w-[20px] w-[20px] p-2`
                            : `text-${align}`
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);

TanStackTable.displayName = "TanStackTable";
