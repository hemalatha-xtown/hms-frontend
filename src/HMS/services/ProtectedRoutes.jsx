// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ isAuthenticated, children, roles = [] }) => {
//   let user = null;
//   try {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       user = JSON.parse(userData);
//     }
//   } catch (error) {
//     console.error("Failed to parse user data:", error);
//     return <Navigate to="/" replace />;
//   }

//   const isLoggedIn = isAuthenticated !== undefined ? isAuthenticated : !!user;

//   // Not logged in → redirect to login
//   if (!isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }

//   // Role-based access check
//   if (roles.length > 0 && (!user || !user.role || !roles.includes(user.role))) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ isAuthenticated, children, roles = [] }) => {
//   let user = null;
//   try {
//     const userData = localStorage.getItem("user");
//     console.log("ProtectedRoute: localStorage.user raw:", userData); // ✅ debug log
//     if (userData) {
//       user = JSON.parse(userData);
//       console.log("ProtectedRoute: parsed user:", user); // ✅ debug log
//     }
//   } catch (error) {
//     console.error("ProtectedRoute: Failed to parse user data:", error);
//     return <Navigate to="/" replace />;
//   }

//   const isLoggedIn = isAuthenticated !== undefined ? isAuthenticated : !!user;

//   // Not logged in → redirect to login
//   if (!isLoggedIn) {
//     console.warn("ProtectedRoute: not logged in, redirecting to /"); // ✅ debug log
//     return <Navigate to="/" replace />;
//   }

//   // Role-based access check
//   if (roles.length > 0 && (!user || !user.role || !roles.includes(user.role))) {
//     console.warn(
//       "ProtectedRoute: role check failed, user.role =",
//       user?.role,
//       "required roles =",
//       roles
//     ); // ✅ debug log
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
// ../HMS/services/ProtectedRoutes.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles = [] }) => {
  let user = null;

  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (error) {
    console.error("ProtectedRoute: Failed to parse user data:", error);
  }

  const isLoggedIn = !!user;

  // ✅ If not logged in → go to login page
  if (!isLoggedIn) {
    console.warn("ProtectedRoute: Not logged in → redirecting to /");
    return <Navigate to="/" replace />;
  }

  // ✅ If logged in but doesn’t have permission → go to dashboard
  if (roles.length > 0 && (!user?.role || !roles.includes(user.role))) {
    console.warn(
      "ProtectedRoute: Unauthorized role → redirecting to /AdminDashboard"
    );
    return <Navigate to="/AdminDashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
