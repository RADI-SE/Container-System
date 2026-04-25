import React from "react";
import useAuthStore from "../store/useAuthStore.js";
import { useUserInventoryTableData } from "../hooks/useInventory.js";
import ReportsTable from "../components/ReportsTable.jsx";

function Reports() {
  const { user } = useAuthStore();
  const userId = user?._id || user?.id;

  const { data: inventoryData, isLoading } = useUserInventoryTableData(userId);

  if (isLoading) {
    return <div className="p-10 text-gray-400">Loading reports...</div>;
  }

  // API returns { success, data }
  const data = inventoryData?.data ?? [];

  console.log("Reports data:", data);

  return (
    <div>
      <ReportsTable title="Reports" data={data} />
    </div>
  );
}

export default Reports;