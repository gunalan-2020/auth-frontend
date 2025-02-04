import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios";

export const updateUser = async (id: number, data: any) => {
  const response = await axios.patch(`user/users/${id}/role`, data);
  return response.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: "users",
      }); // Refetch users after update
    },
  });
};
