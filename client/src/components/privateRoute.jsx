import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
    const userState = useSelector((state) => state.user);
  return userState.currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
