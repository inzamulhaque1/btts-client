import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";

export const usePrivateRoute = (allowedRoles = []) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    // Fetch user info from your backend
    const checkRole = async () => {
      try {
        const res = await axios.get(
          `https://btts-server-production.up.railway.app/users/${currentUser.uid}`
        );
        const role = res.data.userRole;

        if (!allowedRoles.includes(role)) {
          logout();
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error(err);
        logout();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [currentUser, navigate, allowedRoles, logout]);

  return { loading };
};
