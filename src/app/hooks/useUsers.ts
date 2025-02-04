import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";

// Fetch all users from backend
const fetchUsers = async () => {
  const response = await axios.get("/user/users"); // Ensure this endpoint exists in your NestJS backend
  return response.data; // Assuming response contains an array of users
};

// Custom hook to get all users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"], // Cache key for users
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
