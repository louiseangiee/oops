import { useLocation, Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

const RequireAuth = () => {
    // const { token } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem("accessToken");
    return (
        token
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
};

export default RequireAuth;