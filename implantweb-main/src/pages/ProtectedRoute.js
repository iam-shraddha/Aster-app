import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Helper function to check if the token is expired
function isTokenExpired() {
    const token = localStorage.getItem("access_token");
    if (!token) return true;

    try {
        const payload = token.split('.')[1];
        const decodedToken = JSON.parse(atob(payload));
        const expirationTime = decodedToken.exp * 1000;
        console.log("Token Expiration Time: ", expirationTime);
        console.log("Current Time: ", Date.now());
        return Date.now() >= expirationTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
}


function ProtectedRoute({ component: Component }) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (isTokenExpired() || !token) {
            // Redirect to login if token is expired or missing
            navigate("/");
        }
    }, [navigate]);

    return <Component />;
}

export default ProtectedRoute;
