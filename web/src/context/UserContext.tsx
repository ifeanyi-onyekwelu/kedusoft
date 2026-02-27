import {
  useContext,
  useEffect,
  useState,
  ReactNode,
  createContext,
} from "react";
import { profileApi } from "../apis/profileApi";

// Step 1: Define the shape of the user data
interface UserContextType {
  user: User | null; // The currently logged-in user's data
  token: string | null; // Authentication token
  login: (token: string, role?: string) => void; // Log in the user using a token and optional role
  logout: () => void; // Log out the user
  signup: (userData: User, token: string, role?: string) => void; // Sign up the user and log them in
  updateUser: (userData: Partial<User>) => void; // Update the user's profile information
  refreshUser: () => Promise<void>; // Refresh the user's data from the server
}

// Step 2: Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Step 3: Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // State to store user data
  const [token, setToken] = useState<string | null>(null); // State to store the authentication token

  /**
   * Load the user and token from localStorage when the component mounts.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  /**
   * Logs in the user by fetching their profile using the provided token.
   *
   * @param token - The authentication token to be used for API requests.
   * @param role - Optional role information for the user.
   */
  const login = async (token: string, role?: string) => {
    try {
      setToken(token);
      localStorage.setItem("token", token);

      const response = await profileApi.getProfile();
      if (!response) {
        throw new Error("Failed to fetch user profile");
      }

      console.log("response", response);

      const userData: User = await response;
      setUser({ ...userData, role });
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      logout();
    }
  };

  /**
   * Refreshes the user data by fetching the latest profile from the server.
   *
   * @throws Error if no token is available or if the API request fails.
   */
  const refreshUser = async () => {
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await profileApi.getProfile();
      if (!response) {
        throw new Error("Failed to fetch user profile");
      }

      const userData: User = await response;
      setUser((prevUser) => {
        const updatedUser = { ...prevUser, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      // You might want to handle this error differently, like showing a notification
      throw err;
    }
  };

  /**
   * Signs up a new user, saves their data and token, and logs them in.
   *
   * @param userData - The user data to be stored.
   * @param token - The authentication token.
   * @param role - Optional role information for the user.
   */
  const signup = (userData: User, token: string, role?: string) => {
    setUser({ ...userData, role });
    setToken(token);
    login(token, role);
  };

  /**
   * Logs out the current user, clearing all authentication data.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /**
   * Updates the currently logged-in user's data.
   *
   * @param userData - Partial user data to update.
   * @throws Error if no user is logged in.
   */
  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...userData };
        // Update localStorage with the new user data
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error("No user logged in to update");
    });
  };

  /**
   * Provides the user authentication data and management functions
   * to the child components.
   */
  return (
    <UserContext.Provider
      value={{ user, token, login, logout, signup, updateUser, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Step 4: Create a custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
