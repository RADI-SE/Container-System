import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:5000/api/containers";
 
const fetchContainers = async () => {
  const { data } = await axios.get(API_URL, {
    withCredentials: true,
  });
  return data;
};

export const useContainers = () => {
  return useQuery({
    queryKey: ["containers"],
    queryFn: fetchContainers,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
 
const addContainer = async (formData) => {
  const { data } = await axios.post(API_URL, formData, {
    withCredentials: true,
  });
  return data;
};

export const useAddContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });
};
 
const updateContainer = async ({ id, updatedData }) => {
  const { data } = await axios.put(`${API_URL}/${id}`, updatedData, {
    withCredentials: true,
  });
  return data;
};

export const useUpdateContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
    onError: (error) => {
      console.error(
        "Update failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};
 
const deleteContainer = async (id) => {
  await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });
};

export const useDeleteContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });
};
 
const assignContainer = async ({ containerId, userIdToAllow }) => {
  const { data } = await axios.post(
    `${API_URL}/share`,
    { containerId, userIdToAllow },
    { withCredentials: true }
  );
  return data;
};

export const useAssignContainers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
    onError: (error) => {
      console.error(
        "Assignment failed:",
        error?.response?.data?.message || error.message
      );
    },
  });
};
 
const unshareContainer = async ({ containerId, userId }) => {
  const { data } = await axios.put(
    `${API_URL}/unshare`,
    { containerId, userIdToRemove: userId },
    { withCredentials: true }
  );
  return data;
};

export const useUnshareContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unshareContainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });
};

const fetchUserContainers = async (userId) => {
  const { data } = await axios.get(`${API_URL}/user/${userId}`, {
    withCredentials: true,
  });
  return data;
};

export const useUserContainers = (userId) => {
  return useQuery({
    queryKey: ["user-containers", userId],
    queryFn: () => fetchUserContainers(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};