import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  getFilteredRowModel
} from "@tanstack/react-table";

function Table({ title, d = {}, columns = [], onAddClick, onClickAssignUser }) {

  const [globalFilter, setGlobalFilter] = useState("");
  const tableData = useMemo(() => {

    if (Array.isArray(d)) return d;
    if (d?.data && Array.isArray(d.data)) return d.data;
    return [];
  }, [d]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      globalFilter,
    },

    onGlobalFilterChange: setGlobalFilter,

    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!columns || columns.length === 0) {
    return (
      <div className="p-10 text-center border rounded-lg animate-pulse text-gray-400">
        Loading table configuration...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>

        <div className="relative w-full sm:w-72">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search anything..."
            className="
      w-full pl-10 pr-4 py-2.5
      text-sm text-gray-700
      bg-white
      border border-gray-200
      rounded-lg
      shadow-sm
      transition-all duration-200
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2 focus:ring-blue-500
      focus:border-blue-500
      hover:border-gray-300
    "
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">
            {tableData.length} Records Found
          </div>

          {title !== "Inventory Workspace" || title === "Reports" && (
            <>
              <button
                onClick={onAddClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95"
              >
                <span className="text-lg">+</span> New Container
              </button>

              <button
                onClick={onClickAssignUser}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95"
              >
                <span className="text-lg">+</span> Assign Containers
              </button>
            </>
          )}

        </div>
      </div>

      <div className="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50/50">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-4 text-xs font-bold uppercase text-gray-500 border-b border-gray-200">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="group hover:bg-blue-50/40 transition-colors duration-150">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-4 text-sm text-gray-600 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-20 text-center text-gray-400 italic">
                    No data available to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
              <strong>{table.getPageCount()}</strong>
            </span>

            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="ml-2 p-1 text-sm border rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-400 sm:hidden">
        Swipe horizontally to view more columns →
      </p>
    </div>
  );
}

export default Table;