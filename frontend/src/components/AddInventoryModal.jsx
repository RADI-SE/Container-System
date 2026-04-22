import React, { useState } from "react";

function AddInventoryModal({ container, onClose }) {
  const [form, setForm] = useState({
    itemCode: "",
    salCases: "",
    salOuters: "",
    salPcs: "",
    dmgCases: "",
    dmgOuters: "",
    dmgPcs: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (container?._id) {
      console.log("Send to API", form, container._id);
    }
    onClose();
  };

  if (!container) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h2 className="text-xl font-bold">
          Add Inventory → {container.containerNumber}
        </h2>

        <input
          name="itemCode"
          placeholder="Item Code"
          className="border p-2 w-full rounded"
          onChange={handleChange}
        />

        <div className="grid grid-cols-3 gap-2">
          <input name="salCases" placeholder="SAL Cases" className="border p-2 rounded" onChange={handleChange}/>
          <input name="salOuters" placeholder="SAL Outers" className="border p-2 rounded" onChange={handleChange}/>
          <input name="salPcs" placeholder="SAL Pcs" className="border p-2 rounded" onChange={handleChange}/>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input name="dmgCases" placeholder="DMG Cases" className="border p-2 rounded" onChange={handleChange}/>
          <input name="dmgOuters" placeholder="DMG Outers" className="border p-2 rounded" onChange={handleChange}/>
          <input name="dmgPcs" placeholder="DMG Pcs" className="border p-2 rounded" onChange={handleChange}/>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Save
          </button>
          <button onClick={onClose} className="border px-4 py-2 rounded w-full">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddInventoryModal;