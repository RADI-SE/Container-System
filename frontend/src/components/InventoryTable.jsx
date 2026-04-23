import React, { memo, useMemo } from "react";
import Table from "../components/Table.jsx";
import { getInventoryColumns } from "../constants/columns.jsx";
import { useDeleteInventoryItem } from "../hooks/useInventory.js";

function InventoryTable({ data = [] }) {
  const { mutate: deleteInventoryItem } = useDeleteInventoryItem();

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };
 
  const handleDelete = (row) => {
    console.log("Delete item:", row);
    deleteInventoryItem({
      containerId: row.containerId,
      itemId: row.itemId,
    });
  };

  const columns = useMemo(
    () => getInventoryColumns(handleEdit, handleDelete),
    [deleteInventoryItem]
  );

  return (
    <Table
      title="Inventory Workspace"
      d={data}
      columns={columns}
      onAddClick={() => {}}
      onClickAssignUser={() => {}}
    />
  );
}

export default InventoryTable;