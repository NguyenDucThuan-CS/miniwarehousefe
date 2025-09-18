'use client'
import React, { useMemo, useEffect, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { 
  ModuleRegistry, 
  AllCommunityModule, 
  themeQuartz, 
  colorSchemeDarkBlue, 
  colorSchemeLightWarm, 
  ColDef, 
  GridApi, 
  CellClassParams, 
  Column, 
  RowSelectionOptions,
  RowNode} from 'ag-grid-community';

// Extend ColDef to include preserveWidth property
interface ExtendedColDef extends ColDef {
  preserveWidth?: boolean;
}
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Create theme variants
const themeLight = themeQuartz.withPart(colorSchemeLightWarm);
const themeDark = themeQuartz.withPart(colorSchemeDarkBlue);

const getJustifyContent = (textAlign: string): string => {
  switch (textAlign) {
    case 'left':
      return 'flex-start';
    case 'right':
      return 'flex-end';
    default:
      return 'center';
  }
};

const adjustColumnWidths = (
  columns: ExtendedColDef[],
  containerWidth: number,
): ExtendedColDef[] => {
  let totalFixedWidth = 0;
  let totalFlexColumns = 0;
  let totalPreservedWidth = 0;

  // Calculate preserved width first
  columns.forEach((col) => {
    if (col.width && col.preserveWidth) {
      totalPreservedWidth += col.width;
    }
  });

  // Calculate remaining width for non-preserved columns
  const remainingWidth = containerWidth - totalPreservedWidth;

  columns.forEach((col) => {
    if (col.width && !col.preserveWidth) {
      totalFixedWidth += col.width;
    } else if (col.flex) {
      totalFlexColumns += col.flex;
    }
  });

  if (totalFixedWidth < remainingWidth && totalFixedWidth > 0) {
    if (totalFlexColumns === 0) {
      const widthRatio = remainingWidth / totalFixedWidth;
      return columns.map((col) => ({
        ...col,
        width: col.width && !col.preserveWidth ? Math.floor(col.width * widthRatio) : col.width,
      }));
    }
  }

  return columns;
};

const defaultColDef: ColDef = {
  sortable: false,
  resizable: true,
  headerClass: 'header-cell',
  cellStyle: (params: CellClassParams) => {
    const column = params.column as Column;
    let textAlign: 'left' | 'right' | 'center' = 'center';

    if (typeof params.value === 'number' && column.getColDef().headerName !== 'No.') {
      textAlign = 'right';
    } else if (typeof params.value === 'string' && params.value?.trim().length > 0 && column.getColDef().headerName !== 'No.') {
      textAlign = 'left';
    }

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: getJustifyContent(textAlign),
      padding: '0 10px',
    };
  },
};

export interface AgridTableProps {
  columnDefs: ColDef[];
  rowData: any[];
  gridOptions?: any;
  gridRef?: React.RefObject<AgGridReact<any>> | null;
  localeText?: any;
  isLoading?: boolean;
  tableRef?: React.RefObject<any>;
  isHideSelection?: boolean;
  isShowPagination?: boolean;
  onRowClicked?: (rowData: any) => void;
  selectMode?: 'multiRow' | 'singleRow';
}

const AgridTable: React.FC<AgridTableProps> = ({
  columnDefs,
  rowData,
  gridOptions,
  gridRef,
  localeText,
  isLoading,
  isHideSelection = false,
  isShowPagination = true,
  onRowClicked,
  selectMode = 'multiRow',
}) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === 'light' ? themeLight : themeDark;
  const containerRef = useRef<HTMLDivElement>(null);
  const gridApi = useRef<GridApi | null>(null);
  const [adjustedColumnDefs, setAdjustedColumnDefs] = React.useState<ColDef[]>(columnDefs);
  const [selectedCount, setSelectedCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(rowData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rowData.slice(start, start + itemsPerPage);
  }, [rowData, currentPage]);

  const mergedGridOptions = useMemo(() => ({
    theme: currentTheme,
    localeText,
    defaultColDef: {
      ...defaultColDef,
      ...gridOptions?.defaultColDef,
    },
    getRowStyle: (params: { node: { rowPinned?: string } }) => {
      if (params.node.rowPinned === 'bottom') {
        return {
          backgroundColor: '#b1d6e5',
          fontWeight: 'bold',
          borderTop: '2px solid #dde2eb',
        };
      }
      return null;
    },
   // suppressColumnVirtualisation: true,
    rowSelectable: (rowNode: RowNode) => {
      return !(rowNode.data?.isGroupRow);
    },
   
    onRowDragStart: (params: any) => {
      // Set the data transfer when dragging starts
      if (params.event && params.event.dataTransfer) {
        const rowData = params.node.data;
        params.event.dataTransfer.setData('application/json', JSON.stringify(rowData));
        params.event.dataTransfer.effectAllowed = 'move';
      }
    },
    onRowClicked: (params: any) => {
      if (onRowClicked && params.data) {
        onRowClicked(params.data);
      }
    },
    ...gridOptions
  }), [gridOptions, currentTheme, localeText, onRowClicked]);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newAdjustedColumns = adjustColumnWidths(columnDefs, containerWidth);
      setAdjustedColumnDefs(newAdjustedColumns);
    }
  }, [columnDefs, containerRef.current?.offsetWidth]);

  const onGridReady = (params: { api: GridApi }) => {
    gridApi.current = params.api;
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newAdjustedColumns = adjustColumnWidths(columnDefs, containerWidth);
      setAdjustedColumnDefs(newAdjustedColumns);
    }
  };

  const onSelectionChanged = () => {
    if (gridApi.current) {
      setSelectedCount(gridApi.current.getSelectedRows().filter((row: any) => !row.isGroupRow).length);
    }
  };

  const isRowSelectable = useCallback((params: { data: { isGroupRow: boolean } }) => {
    // Prevent full-width rows from being selectable
    return !params.data?.isGroupRow;
  }, []);
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return { mode: selectMode, enableClickSelection: false };
  }, []);
  return (
    <div ref={containerRef} style={{ width: "100%", height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .ag-header-cell-text {
            white-space: normal !important;
            word-wrap: break-word !important;
            line-height: 1.2 !important;
          }
          .ag-header-cell {
            height: auto !important;
            min-height: 33px !important;
          }
          .ag-header-cell {
            height: 100% !important;
          }
          .ag-cell {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
          }
          .ag-cell-value {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
          }
        `}
      </style>
      {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      <div className="flex-1">
          <AgGridReact
            key={resolvedTheme}
            ref={gridRef}
            columnDefs={adjustedColumnDefs}
            rowData={rowData}
            onGridReady={onGridReady}
            onSelectionChanged={onSelectionChanged}
            rowHeight={33}
            headerHeight={33}
            rowSelection={isHideSelection ? undefined : rowSelection}
            suppressColumnVirtualisation={true}
            isRowSelectable={isRowSelectable}
            {...mergedGridOptions}
          />
      </div>
      {isShowPagination && (
        <div className="flex flex-row justify-between">
        <div className="flex items-center mb-2 bottom-0 left-2">
          <span className="text-xs text-muted-foreground">
            {selectedCount} of {rowData.filter((row: any) => !row.isGroupRow).length} row(s) selected.
          </span>
        </div>
        {/* Footer: Pagination Info & Controls */}
        <div className="flex items-center justify-end gap-4 px-4 py-2 border-t text-xs text-muted-foreground z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &#60;
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            &#62;
          </Button>
        </div>
      </div>
      )}
    </div>
  );
};

export default AgridTable;

    