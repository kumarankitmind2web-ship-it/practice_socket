import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const { isAuthenticated, accessToken } = useSelector(
    (state) => state.auth
  );

  if (isAuthenticated && accessToken) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default PublicRoutes;