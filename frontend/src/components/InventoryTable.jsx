import React, { memo, useMemo } from "react";
import Table from "../components/Table.jsx";
import { getInventoryColumns } from "../constants/columns.jsx";

function InventoryTable({ data = [] }) {

  // If you don't have edit/delete yet, just pass empty callbacks
  const handleEdit = () => {};
  const deleteMutate = () => {};

  const columns = useMemo(
    () => getInventoryColumns(handleEdit, deleteMutate),
    [handleEdit, deleteMutate]
  );

  return (
    <Table
      title="Inventory Workspace"
      d={data}
      columns={columns}   // ✅ correct
      onAddClick={() => {}}
      onClickAssignUser={() => {}}
    />
  );
}

export default memo(InventoryTable);