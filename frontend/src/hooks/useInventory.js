import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
});

if (!API_BASE_URL) {
  console.warn("[useInventory] VITE_API_BASE_URL is not set, using relative /api paths");
}

const addInventoryItem = async (payload) => {
  const { containerId, ...itemData } = payload;

  const { data } = await api.post(
    `/inventory/${containerId}`,
    itemData
  );

  return data;
};

export const useAddInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["inventory"] }); 
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });
};

export const fetchUserInventoryTableData = async (userId) => {
  const { data } = await api.get(`/inventory/inventory/${userId}`);
  return data;
};

export const useUserInventoryTableData = (userId) => {
  return useQuery({
    queryKey: ["inventory", userId],
    queryFn: () => fetchUserInventoryTableData(userId),
  });
};

export const deleteInventoryItem = async ({ containerId, itemId }) => {
  await api.delete(`/inventory/${containerId}/inventory/${itemId}`);
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] }); 
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    }
  });
}; 


const updateInventoryItem = async ({ containerId, itemId, updatedData }) => {
  const {
    itemCode,
    salQty,
    dmgQty,
    salCases,
    salOuters,
    salPcs,
    dmgCases,
    dmgOuters,
    dmgPcs,
  } = updatedData;

  const payload = {
    itemCode,
    salCases: salQty?.cases ,
    salOuters: salQty?.outers ,
    salPcs: salQty?.pcs ,
    dmgCases: dmgQty?.cases ,
    dmgOuters: dmgQty?.outers ,
    dmgPcs: dmgQty?.pcs ,
  };

  try {
    const res = await api.put(
      `/inventory/${containerId}/inventory/${itemId}`,
      payload
    );
    return res.data;
  } catch (error) { 
    throw error.response?.data || error;
  }


};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventoryItem,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },

    onError: (error) => {
      console.log("Update failed:", error.message);
    }
  });
};