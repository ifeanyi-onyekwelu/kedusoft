import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }: any) => {
  const location = useLocation();
  const { role } = useAuth();

  const content = allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate
      to={{
        pathname: "/auth/login",
        search: `?next=${encodeURIComponent(
          location.pathname + location.search
        )}`,
      }}
      state={{ from: location }}
      replace
    />
  );

  return content;
};

export default RequireAuth;
