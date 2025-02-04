import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ResetPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract token from URL
  const token = searchParams.get("token");

  // API Call to Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { newPassword: string; token: string }) => {
      const response = await axios.post("/auth/reset-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      setMessage(
        data.message || "Password reset successful! Redirecting to login..."
      );
      setTimeout(() => navigate("/login"), 3000);
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    resetPasswordMutation.mutate({ newPassword: password, token });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          New Password:
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2">
          Confirm Password:
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
