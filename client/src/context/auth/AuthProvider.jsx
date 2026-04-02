import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { getUserLogged, getAccessToken } from "../../utils/network-data";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const fetchUser = async () => {
    try {
      const token = getAccessToken();

      if (!token) {
        setUser({ role: "guest" });
        return;
      }

      const { data } = await getUserLogged();
      setUser(data);
    } catch (error) {
      console.error("Gagal ambil user:", error);
      setUser({ role: "guest" });
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    const isExistToken = getAccessToken();
    if (isExistToken !== '' || isExistToken !== undefined || isExistToken !== null) {
      return;
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadingAuth,
        fetchUser, // optional (misalnya setelah login)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;