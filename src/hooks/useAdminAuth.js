

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function useAdminAuth() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/403", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  return { user, isAdmin, loading };
}
