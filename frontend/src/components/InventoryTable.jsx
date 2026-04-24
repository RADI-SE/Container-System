import React, { useMemo, useState } from "react";
import Table from "../components/Table.jsx";
import { getInventoryColumns } from "../constants/columns.jsx";
import {
  useDeleteInventoryItem,
  useUpdateInventoryItem,
} from "../hooks/useInventory.js";
import AddInventoryModal from "../components/AddInventoryModal.jsx";

function InventoryTable({ data = [] }) {
  const { mutate: deleteInventoryItem } = useDeleteInventoryItem();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    deleteInventoryItem({
      containerId: row.containerId,
      itemId: row.itemId,
    });
  };
 
  const columns = useMemo(
    () => getInventoryColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  console.log("Inventory Table Data:", selectedItem);
  return (
    <>
      <Table
        title="Inventory Workspace"
        d={data}
        columns={columns}
        onAddClick={() => {}}
        onClickAssignUser={() => {}}
      />

      <AddInventoryModal
        isOpen={isModalOpen}
        container={selectedItem}
        initialData={selectedItem}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </>
  );
}

export default InventoryTable;