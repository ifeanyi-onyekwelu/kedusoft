import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = localStorage.getItem("token");

  let isAdmin = false;
  let isTenant = false;
  let isLandlord = false;
  let status = null;

  const isAuthenticated = token ? true : false; // Check if token exists

  if (isAuthenticated) {
    try {
      const decoded: any = jwtDecode(token!);
      const { role, exp } = decoded;

      // Debug logging
      console.log("🔍 Auth Debug:", {
        token: token?.substring(0, 20) + "...",
        decoded: decoded,
        role: role,
        exp: exp,
        currentTime: Date.now() / 1000,
      });

      // Check if the token has expired
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (exp && exp < currentTime) {
        // Token has expired
        console.warn("⚠️ Token expired, removing from localStorage");
        localStorage.removeItem("token"); // Remove expired token from localStorage
        localStorage.removeItem("user"); // Also remove user data
        return {
          isAuthenticated: false,
          role: "",
          isTenant,
          isLandlord,
          isAdmin,
          status: null,
        };
      }

      // Normalize role to lowercase to avoid case sensitivity issues
      const normalizedRole = role?.toLowerCase();

      // Set roles and status
      isTenant = normalizedRole === "tenant";
      isLandlord = normalizedRole === "landlord";
      isAdmin = normalizedRole === "admin";

      if (isTenant) status = "Tenant";
      if (isLandlord) status = "Landlord";
      if (isAdmin) status = "Admin";

      console.log("✅ Auth Success:", {
        role: normalizedRole,
        status,
        isTenant,
        isLandlord,
        isAdmin,
      });

      return {
        isAuthenticated: true,
        role: normalizedRole, // Return normalized role
        status,
        isTenant,
        isLandlord,
        isAdmin,
      };
    } catch (error) {
      // If decoding fails, treat it as if the token is invalid/expired
      console.error("❌ Token decode error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        isAuthenticated: false,
        role: "",
        isTenant,
        isLandlord,
        isAdmin,
        status: null,
      };
    }
  }

  console.log("🚫 No authentication token found");
  return {
    isAuthenticated: false,
    role: "",
    isTenant,
    isLandlord,
    isAdmin,
    status: null,
  };
};

export default useAuth;
