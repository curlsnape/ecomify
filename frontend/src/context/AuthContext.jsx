import { createContext, useContext, useEffect, useState } from "react";
import api, { refreshAccessToken } from "../api/axiosInstance.js";
import { setAccessToken as setStoredAccessToken } from "../api/tokenStore.js";

const AuthContext = createContext();

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  function setAccessToken(token) {
    setStoredAccessToken(token);
    setAccessTokenState(token);
  }

  useEffect(() => {
    async function trySilentLogin() {
      try {
        const token = await refreshAccessToken();
        setAccessToken(token);

        const meResponse = await api.get("/auth/me");
        setUser(meResponse.data.user);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    trySilentLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
