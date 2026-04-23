import React, { useState, useEffect } from "react";
import { useAddInventoryItem, useUpdateInventoryItem } from "../hooks/useInventory";

const initialFormState = {
  itemCode: "",
  salCases: "",
  salOuters: "",
  salPcs: "",
  dmgCases: "",
  dmgOuters: "",
  dmgPcs: "",
};

function AddInventoryModal({ container, isOpen = true, onClose, initialData = null, onSubmit }) {
  const { mutate: addInventoryItem } = useAddInventoryItem();
  const { mutate: updateInventoryItem } = useUpdateInventoryItem();
  const [form, setForm] = useState(initialFormState);
 
useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        itemCode: initialData.itemCode || "",
        salCases: initialData.salQty?.cases || "",
        salOuters: initialData.salQty?.outers || "",
        salPcs: initialData.salQty?.pcs || "",
        dmgCases: initialData.dmgQty?.cases || "",
        dmgOuters: initialData.dmgQty?.outers || "",
        dmgPcs: initialData.dmgQty?.pcs || "",
      });
      return;
    }

    setForm(initialFormState);
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 
const buildPayload = () => ({
    itemCode: form.itemCode,
    salCases: form.salCases,
    salOuters: form.salOuters,
    salPcs: form.salPcs,
    dmgCases: form.dmgCases,
    dmgOuters: form.dmgOuters,
    dmgPcs: form.dmgPcs,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = buildPayload();

    if (initialData) {
      if (onSubmit) {
        onSubmit(payload);
      } else {
        updateInventoryItem({
          containerId: container?.containerId ?? container?._id,
          itemId: initialData.itemId ?? initialData._id,
          updatedData: payload,
        });
      }

      onClose();
      return;
    }

    if (onSubmit) {
      onSubmit(payload);
    } else {
      addInventoryItem({
        containerId: container?._id ?? container?.containerId,
        ...payload,
      });
    }

    onClose();
  };

  if (!container || !isOpen) return null;

  const displayNumber = container.containerNumber ?? container.containerId ?? "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {initialData ? "Edit inventory" : "Add inventory"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Container <span className="font-semibold text-gray-700">#{displayNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Item code
              </label>
              <input
                required
                name="itemCode"
                value={form.itemCode}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. ABC-100"
              />
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[2px] mb-4">SAL</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cases</label>
                  <input
                    name="salCases"
                    value={form.salCases}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Outers</label>
                  <input
                    name="salOuters"
                    value={form.salOuters}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pcs</label>
                  <input
                    name="salPcs"
                    value={form.salPcs}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[2px] mb-4">DMG</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cases</label>
                  <input
                    name="dmgCases"
                    value={form.dmgCases}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Outers</label>
                  <input
                    name="dmgOuters"
                    value={form.dmgOuters}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pcs</label>
                  <input
                    name="dmgPcs"
                    value={form.dmgPcs}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              Save inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInventoryModal;
