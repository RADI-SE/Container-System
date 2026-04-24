import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  withCredentials: true,
});

if (!API_BASE_URL) {
  console.warn("[useContainers] VITE_API_BASE_URL is not set, using relative /api paths");
}

const fetchContainers = async () => {
  const { data } = await api.get("/containers");
  return data?.data || data;
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
  const { data } = await api.post("/containers", formData);
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
  const { data } = await api.put(`/containers/${id}`, updatedData);
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
  await api.delete(`/containers/${id}`);
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
  const { data } = await api.post(
    "/containers/share",
    { containerId, userIdToAllow }
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
  const { data } = await api.put(
    "/containers/unshare",
    { containerId, userIdToRemove: userId }
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
  const { data } = await api.get(`/containers/user/${userId}`);

  const payload = data?.data != null ? data.data : data;
  return Array.isArray(payload) ? payload : [];
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

const fetchContainerById = async (containerId) => {
  const { data } = await api.get(`/containers/${containerId}`);

  return data?.data || data;
};

export const useContainerById = (containerId) => {
  return useQuery({
    queryKey: ["container", containerId],
    queryFn: () => fetchContainerById(containerId),
    enabled: !!containerId,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};