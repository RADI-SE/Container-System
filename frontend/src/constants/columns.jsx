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
          ✏️
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
          🗑️
        </button>
      </div>
    ),
  },
];



export const getInventoryColumns = (onEdit, onDelete) => [
  {
    header: "Container No",
    accessorKey: "containerNumber",
  },
  {
    header: "Item Code",
    accessorKey: "itemCode",
  },

  {
    id: "salCases",
    header: "SAL Cases",
    accessorFn: row => row.salQty?.cases ?? 0,
  },
  {
    id: "salOuters",
    header: "SAL Outers",
    accessorFn: row => row.salQty?.outers ?? 0,
  },
  {
    id: "salPcs",
    header: "SAL PCS",
    accessorFn: row => row.salQty?.pcs ?? 0,
  },

  {
    id: "dmgCases",
    header: "DMG Cases",
    accessorFn: row => row.dmgQty?.cases ?? 0,
  },
  {
    id: "dmgOuters",
    header: "DMG Outers",
    accessorFn: row => row.dmgQty?.outers ?? 0,
  },
  {
    id: "dmgPcs",
    header: "DMG PCS",
    accessorFn: row => row.dmgQty?.pcs ?? 0,
  },

  {
    header: "Owner",
    accessorKey: "ownerName",
  },

  {
    id: "date",
    header: "Date",
    accessorFn: row =>
      row.createdAt
        ? new Date(row.createdAt).toLocaleDateString()
        : "—",
  },

  // ACTIONS
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
          ✏️
        </button>

        <button
          onClick={() => {
            if (window.confirm("Delete this item?")) {
              onDelete(row.original._id);
            }
          }}
          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    ),
  },
];