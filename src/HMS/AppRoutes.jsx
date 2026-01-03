// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../HMS/services/ProtectedRoutes.jsx";
// import CategoryPage from "./pages/Admin/Category/Category.jsx";
// import Menus from "./pages/Admin/Menu/Menus.jsx";
// import ReportPage from "./pages/Admin/Reports/Report.jsx";
// import AdminDashboard from "./pages/Admin/AdminDashboard/Dashboard.jsx";
// import ProfilePage from "./pages/Admin/Profile/Profile.jsx";
// import Register from "../login/RegisterPage.jsx";
// import KitchenDashboard from "./pages/Admin/Kitchen/KitchenDashboard.jsx";
// import GuestCheckout from "./pages/Guest/GuestCheckout.jsx";
// import GuestMenu from "./pages/Guest/GuestMenu.jsx";
// import TaxPage from "./pages/Admin/Tax/Tax.jsx";
// import Settings from "../components/pages/Settings.jsx";

// const MasterRoutes = () => {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/register" element={<Register />} />
//       <Route path="/Guest-Menu" element={<GuestMenu />} />
//       <Route path="/Guest-Checkout" element={<GuestCheckout />} />

//       {/* User routes */}
//       <Route
//         path="/Menus"
//         element={
//           <ProtectedRoute roles={["user", "admin", "superadmin"]}>
//             <Menus />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/ProfilePage"
//         element={
//           <ProtectedRoute roles={["user", "admin", "superadmin"]}>
//             <ProfilePage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin + Superadmin routes */}
//       <Route
//         path="/Category"
//         element={
//           <ProtectedRoute roles={["admin", "superadmin"]}>
//             <CategoryPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/TaxPage"
//         element={
//           <ProtectedRoute roles={["admin", "superadmin"]}>
//             <TaxPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/ReportPage"
//         element={
//           <ProtectedRoute roles={["admin", "superadmin"]}>
//             <ReportPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/AdminDashboard"
//         element={
//           <ProtectedRoute roles={["admin", "superadmin"]}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/KitchenDashboard"
//         element={
//           <ProtectedRoute roles={["admin", "superadmin"]}>
//             <KitchenDashboard />
//           </ProtectedRoute>
//         }
//       />

//       {/* Settings (only admin/superadmin) */}
//       <Route
//         path="/settings"
//         element={
//           <ProtectedRoute roles={["admin", "superadmin"]}>
//             <Settings />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// };

// export default MasterRoutes;
// MasterRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import CategoryPage from "./pages/Admin/Category/Category.jsx";
import Menus from "./pages/Admin/Menu/Menus.jsx";
import ReportPage from "./pages/Admin/Reports/Report.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard/Dashboard.jsx";
import ProfilePage from "./pages/Admin/Profile/Profile.jsx";
import Register from "../login/RegisterPage.jsx";
import KitchenDashboard from "./pages/Admin/Kitchen/KitchenDashboard.jsx";
import GuestCheckout from "./pages/Guest/GuestCheckout.jsx";
import GuestMenu from "./pages/Guest/GuestMenu.jsx";
import TaxPage from "./pages/Admin/Tax/Tax.jsx";
import Settings from "../components/pages/Settings.jsx";

const MasterRoutes = () => {
  return (
    <Routes>
      {/* ✅ Public routes (accessible to everyone) */}
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Guest-Menu" element={<GuestMenu />} />
      <Route path="/Guest-Checkout" element={<GuestCheckout />} />

      {/* ✅ Admin & User pages (now unprotected) */}
      <Route path="/Menus" element={<Menus />} />
      <Route path="/ProfilePage" element={<ProfilePage />} />
      <Route path="/Category" element={<CategoryPage />} />
      <Route path="/TaxPage" element={<TaxPage />} />
      <Route path="/ReportPage" element={<ReportPage />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/KitchenDashboard" element={<KitchenDashboard />} />
      <Route path="/settings" element={<Settings />} />

      {/* ✅ Fallback route: redirect all unknown paths to dashboard */}
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default MasterRoutes;
