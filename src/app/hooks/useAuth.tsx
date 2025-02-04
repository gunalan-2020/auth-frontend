import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios";
import { useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const USER_QUERY_KEY = ["user"] as const;

export const getMe = async () => {
  const response = await axios.get("/auth/me");
  return response.data;
};

export const signup = async (email: string, password: string) => {
  const response = await axios.post("/user/register", {
    email,
    password,
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  try {
    const response = await axios.post("/auth/login", {
      email,
      password,
      rememberMe,
    });

    if (response.data.jwt) {
      cookies.set("jwt", response.data.jwt, {
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
      });
    }

    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const logout = async () => {
  await axios.post("/auth/logout");
};

export const forgotPassword = async (emial: string) => {
  const response = await axios.post("/auth/forgot-password", { emial });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axios.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

export const useAuth = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signup(data.email, data.password),
    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message || "An error occurred during signup"
      );
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => login(data.email, data.password, data.rememberMe),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY,
      });
    },
    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message || "An error occurred during login"
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY,
      });
    },
    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message || "An error occurred during logout"
      );
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data.email),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEY,
      });
    },
    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message ||
          "An error occurred during password reset"
      );
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    onSuccess: (data) => {
      console.log("Email verified successfully:", data);
      // Handle success, such as redirecting or showing a success message
    },
    onError: (error: any) => {
      console.error("Error verifying email:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "An error occurred during email verification"
      );
    },
  });

  return {
    errorMessage,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
  };
};
