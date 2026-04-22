import React, { useState } from "react";
import ContainerSelect from "../components/ContainerSelect";
import AddInventoryModal from "../components/AddInventoryModal.jsx";
import InventoryTable from "../components/InventoryTable";

function Inventory() {
  // Single source of truth: modal only opens when a container is set (avoids a null `container` render).
  const [modalContainer, setModalContainer] = useState(null);

  const handleSelectContainer = (container) => {
    if (container) setModalContainer(container);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Inventory Workspace</h1>

      {/* TOP SECTION */}
      <ContainerSelect onSelect={handleSelectContainer} />

      {/* TABLE */}
      <InventoryTable />

      {/* MODAL */}
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
