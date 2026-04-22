import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {

  console.log("AppLayout Called ")
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-4 overflow-auto">
          <Outlet />   
        </div>
      </div>
    </div>
  );
}