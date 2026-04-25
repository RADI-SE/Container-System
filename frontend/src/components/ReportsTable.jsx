import React, { useMemo } from "react";
import Table from "./Table";
import { getReportsColumns } from "../constants/columns";

function ReportsTable({ title, data = [] }) {
  const columns = useMemo(() => getReportsColumns(), []);
  return <Table title={title} d={data} columns={columns} />;
}

export default ReportsTable;