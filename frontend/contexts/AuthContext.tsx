import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/config/firebase";

type User = {
  uid?: string;
  name?: string;
  email?: string;
  photoURL?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData?: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state from storage on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const authState = await AsyncStorage.getItem("authState");
        if (authState) {
          const { isAuthenticated: savedAuth, user: savedUser } =
            JSON.parse(authState);
          setIsAuthenticated(savedAuth);
          setUser(savedUser);
          console.log("AuthContext: Loaded saved auth state:", {
            savedAuth,
            savedUser,
          });
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (userData?: User) => {
    console.log("AuthContext: login called with userData:", userData);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(
        "authState",
        JSON.stringify({
          isAuthenticated: true,
          user: userData,
        })
      );
      console.log("AuthContext: Auth state saved to storage");
    } catch (error) {
      console.error("Error saving auth state:", error);
    }

    console.log("AuthContext: isAuthenticated set to true");
  };

  const logout = async () => {
    console.log("AuthContext: logout called");
    setIsAuthenticated(false);
    setUser(null);

    // Clear from AsyncStorage
    try {
      await auth.signOut();
      // Set logged out state and clear credentials
      await AsyncStorage.multiSet([
        ["isLoggedOut", "true"],
        ["savedAuth", ""],
        ["savedUser", ""],
      ]);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
