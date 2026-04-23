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

export const updateInventoryItem = async ({ containerId, itemId, updatedData }) => {
  const { data } = await axios.put(
    `${API_URL}/${containerId}/inventory/${itemId}`,
    updatedData,
    { withCredentials: true }
  );
  return data;
};

