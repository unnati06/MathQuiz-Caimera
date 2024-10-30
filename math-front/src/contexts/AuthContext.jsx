import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  // Load token from localStorage on initial render
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      setToken(existingToken);
    } else {
      setLoading(false); // Stop loading if no token exists
    }
  }, []);

  const isLoggedIn = !!token;
  console.log("token", token);
  console.log("isLoggedIn", isLoggedIn);

  const userAuthentication = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/auth/currentUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUser(response.data.user); // Assuming `data.user` holds the user data
      } else {
        setUser(null); // Reset user data if the request is not successful
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null); // Clear user on error
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication();
    } else {
      setLoading(false); // Stop loading if no token exists
    }
  }, [token]);

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, user, loading, logout }}>
      {loading ? <p>Loading...</p> : children} {/* Show loading state if needed */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue;
};
