import ContainersGrid from "../components/ContainersGrid";
import InventoryTable from "../components/InventoryTable";
import { useUserContainers } from "../hooks/useContainers";
import useAuthStore from "../store/useAuthStore";

function Staff() {
  const { user } = useAuthStore();
  const userId = user?._id;

  const { data, isLoading, isError, error } = useUserContainers(userId);

  if (!userId) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Error: {error?.message || "Something went wrong"}</div>;

  return (
    <>
      <ContainersGrid containers={data || []} detailsBasePath="/staff-containers" />
     
    </>
  );
}

export default Staff;