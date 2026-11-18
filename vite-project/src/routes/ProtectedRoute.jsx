import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { isAuthenticated, accessToken } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/auth" replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoutes;
