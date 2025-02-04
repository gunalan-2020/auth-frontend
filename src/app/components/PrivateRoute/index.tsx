import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("jwt");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

        // Check if the token is expired (JWT has 'exp' field)
        if (decoded.exp > currentTime) {
          setIsAuthenticated(true); // Valid token
        } else {
          setIsAuthenticated(false); // Token is expired
        }
      } catch (error) {
        setIsAuthenticated(false); // Invalid JWT token
      }
    } else {
      setIsAuthenticated(false); // No token found
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
