import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

const RequireAuth = () => {
    const [cookie] = useCookies(["accessToken"]);
    const location = useLocation();
    return (
        cookie.accessToken
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    )
};

export default RequireAuth;