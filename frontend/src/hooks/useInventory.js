import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:5000/api/containers";
 
 const addInventoryItem = async (payload) => {
  const { containerId, ...itemData } = payload;
 
  const { data } = await axios.post(
    `${API_URL}/${containerId}/inventory`,
    itemData, // Pass the object here
    { withCredentials: true }
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
  const { data } = await axios.get(`${API_URL}/inventory/${userId}`, { withCredentials: true });
  return data;
};

export const useUserInventoryTableData = (userId) => {
  return useQuery({
    queryKey: ["inventory", userId],
    queryFn: () => fetchUserInventoryTableData(userId),
  });
};

export const deleteInventoryItem = async ({ containerId, itemId }) => {
  await axios.delete(`${API_URL}/${containerId}/inventory/${itemId}`, { withCredentials: true });
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
    salCases: salQty?.cases ?? salCases ?? 0,
    salOuters: salQty?.outers ?? salOuters ?? 0,
    salPcs: salQty?.pcs ?? salPcs ?? 0,
    dmgCases: dmgQty?.cases ?? dmgCases ?? 0,
    dmgOuters: dmgQty?.outers ?? dmgOuters ?? 0,
    dmgPcs: dmgQty?.pcs ?? dmgPcs ?? 0,
  };

  const { data } = await axios.put(
    `${API_URL}/${containerId}/inventory/${itemId}`,
    payload,
    { withCredentials: true }
  );
  return data;
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    }
  });
};



