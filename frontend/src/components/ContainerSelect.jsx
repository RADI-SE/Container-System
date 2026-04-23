import React, { useState } from "react";
import { useUserContainers } from "../hooks/useContainers";
import useAuthStore from "../store/useAuthStore";

function ContainerSelect({ onSelect }) {
  const { user } = useAuthStore();
  const userId = user?._id;

  const [selectedId, setSelectedId] = useState("");

  const { data, isLoading, isError, error } = useUserContainers(userId);
  const raw = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  const containers = raw;

  if (isLoading) return <div>Loading containers...</div>;
  if (isError) return <div>Error: {error?.message || "Failed to load containers"}</div>;

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedId(value); 
    setSelectedId(""); 

    const container = containers.find(
      (c) => String(c._id ?? c.id) === String(value)
    );

    if (container) onSelect(container);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
      <h2 className="font-semibold">Add Inventory</h2>

      <select
        className="border rounded-lg p-2"
        value={selectedId} 
        onChange={handleChange}
      >
        <option value="" disabled>Select Container</option>

        {containers.map((c) => {
          const id = c._id ?? c.id;
          if (id == null) return null;

          return (
            <option key={String(id)} value={String(id)}>
              {c.containerNumber}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default ContainerSelect;