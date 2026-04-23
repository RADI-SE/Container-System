import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:5000/api/containers";
 
 const addInventoryItem = async (payload) => {
  const { containerId, ...itemData } = payload;
   
  // itemData now contains { itemCode, salCases, salOuters, etc. }
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
      // Make sure this matches the key you use to fetch inventory
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      // Suggestion: also invalidate the specific container if needed
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });
};