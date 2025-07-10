import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    isAuthenticated: false,
    user: null,
    isAdmin: false,
  });

  const fetchAuth = async (type = "user") => {
    setAuth((prev) => ({ ...prev, loading: true }));

    try {
      if (type === "user" ) {
        const userRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/valid_user/me`,
          { withCredentials: true }
        );
        setAuth({
          loading: false,
          isAuthenticated: true,
          user: userRes.data.user,
          isAdmin: false,
        });
        return;
      }
    } catch {}

    try {
      if (type === "admin") {
        const adminRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/valid_admin/me`,
          { withCredentials: true }
        );
        setAuth({
          loading: false,
          isAuthenticated: true,
          user: adminRes.data.admin,
          isAdmin: true,
        });
        return;
      }
    } catch {
      setAuth({
        loading: false,
        isAuthenticated: false,
        user: null,
        isAdmin: false,
      });
    }
  };

  useEffect(() => {
    fetchAuth("auto"); // Automatically check both types on load
  }, []);

  const login = (userData, isAdmin = false) => {
    setAuth({
      loading: false,
      isAuthenticated: true,
      user: userData,
      isAdmin,
    });
  };

  const logout = () => {
    document.cookie = "usertoken=; Max-Age=0; path=/";
    document.cookie = "admintoken=; Max-Age=0; path=/";
    setAuth({
      loading: false,
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, fetchAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
