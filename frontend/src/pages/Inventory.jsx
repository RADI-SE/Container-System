import React, { useState } from "react";
import ContainerSelect from "../components/ContainerSelect";
import AddInventoryModal from "../components/AddInventoryModal.jsx";
import InventoryTable from "../components/InventoryTable";
import { useUserInventoryTableData } from "../hooks/useInventory.js";
import useAuthStore  from "../store/useAuthStore.js";

function Inventory() { 
   const [modalContainer, setModalContainer] = useState(null);
    const { user } = useAuthStore();
  const userId = user?._id || user?.id; 
   const { data: inventoryData  } = useUserInventoryTableData(userId);
 
  const handleSelectContainer = (container) => {
    if (container) setModalContainer(container);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Inventory Workspace</h1>
 
      <ContainerSelect onSelect={handleSelectContainer} />
 
      <InventoryTable data={inventoryData}  />
 
      {modalContainer && (
        <AddInventoryModal
          container={modalContainer}
          onClose={() => setModalContainer(null)}
        />
      )}

    </div>
  );
}

export default Inventory;
