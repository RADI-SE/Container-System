import React from "react";
import Table from "../components/Table.jsx";
import { getInventoryColumns } from "../constants/columns.jsx";

function InventoryTable({ data = [] }) {


  return (
    <Table
      title="Inventory Workspace"
      d={data}
      columns={getInventoryColumns}
      onAddClick={() => {}}
      onClickAssignUser={() => {}}
    />
  );
}

export default InventoryTable;