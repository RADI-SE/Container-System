import React from 'react';
import AllowedUsersCell from "./AllowedUsersCell";

export const getContainerColumns = (onEdit, onDelete) => [
  {
    header: "Container Name",
    accessorKey: "containerName",
  },
  {
    header: "Container Number",
    accessorKey: "containerNumber",
  },
  {
    header: "Bill of Lading",
    accessorKey: "billOfLading",
  },
  {
    header: "PO Number",
    accessorKey: "purchaseOrder",
  },
  {
    header: "Invoice",
    accessorKey: "invoiceNumber",
  },
  {
    header: "Branch",
    accessorKey: "receivingBranch",
  },
  {
    header: "Region",
    accessorKey: "region",
  },
  {
    header: "Shared With",
    accessorKey: "allowedUsers",
    cell: ({ row }) => (
      <AllowedUsersCell users={row.original.allowedUsers} containerId={row.original._id} />
    ),
  },
  {
    header: "Documents",
    accessorKey: "documents",
    cell: ({ row }) => {
      const docs = row.original.documents || [];
      if (docs.length === 0) return <span className="text-gray-300 text-[10px] italic">No docs</span>;

      return (
        <div className="flex gap-1.5">
          {docs.map((doc) => (
            <a
              key={doc._id}
              href={`http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
              title={doc.fileName}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </a>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">

        <button
          onClick={() => onEdit(row.original)}
          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this container?")) {
              onDelete(row.original._id);
            }
          }}
          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    ),
  },
];

export const getInventoryColumns = [
  {
    header: "Container No",
    accessorKey: "containerNumber",
  },
  {
    header: "Item Code",
    accessorKey: "itemCode",
  },
  {
    header: "SAL Cases",
    accessorKey: "salCases",
  },
  {
    header: "SAL Outers",
    accessorKey: "salOuters",
  },
  {
    header: "SAL PCS",
    accessorKey: "salPcs",
  },
  {
    header: "DMG Cases",
    accessorKey: "dmgCases",
  },
  {
    header: "DMG Outers",
    accessorKey: "dmgOuters",
  },
  {
    header: "DMG PCS",
    accessorKey: "dmgPcs",
  },
  {
    header: "Added By",
    accessorKey: "addedBy",
  },
  {
    header: "Date",
    accessorKey: "date",
  },
];