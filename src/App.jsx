// import { Suspense, useMemo } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MainLayout from "./components/layout/MainLayout";
// import Login from "./login/Login";
// import Register from "./login/RegisterPage";
// import Loading from "./utils/Loading";
// import NotFoundPage from "./HMS/services/NotFound";
// import ProtectedRoute from "./HMS/services/ProtectedRoutes";
// import Settings from "./components/pages/Settings";
// import GuestLogin from "./login/Guest-Login";
// import GuestMenu from "./HMS/pages/Guest/GuestMenu";
// import GuestCheckout from "./HMS/pages/Guest/GuestCheckout";
// // Dynamically import module routes
// const routeModules = import.meta.glob("./*/AppRoutes.jsx", { eager: true });

// const App = () => {
//   // Map dynamic routes
//   const modules = Object.entries(routeModules).map(([path, mod]) => {
//     const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
//     const name = match?.[1];
//     return {
//       name,
//       path: `/${name}/*`, // ✅ keep leading slash
//       element: mod.default,
//       menuItems: mod[`${name}MenuItems`] || [],
//     };
//   });

//   // Generate menu items for MainLayout
//   const menuItems = useMemo(() => {
//     return modules.map(({ name, menuItems }) => ({
//       key: name,
//       label: name.toUpperCase(),
//       children: menuItems,
//     }));
//   }, [modules]);

//   const isLoggedIn = !!localStorage.getItem("user");

//   return (
//     <BrowserRouter>
//       <Loading duration={3000} />
//       <Suspense
//         fallback={
//           <div className="p-4">
//             <Loading />
//           </div>
//         }
//       >
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/GuestLogin" element={<GuestLogin />} />
//           <Route path="/Guest-Menu" element={<GuestMenu />} />
//           <Route path="/Guest-Checkout" element={<GuestCheckout />} />

//           {/* Protected routes */}
//           <Route
//             element={
//               <ProtectedRoute isAuthenticated={isLoggedIn}>
//                 <MainLayout menuItems={menuItems} />
//               </ProtectedRoute>
//             }
//           >
//             {modules.map(({ name, path, element: Element }) => (
//               <Route key={name} path={path} element={<Element />} />
//             ))}
//             <Route
//               path="settings"
//               element={
//                 <ProtectedRoute
//                   roles={["admin", "superadmin"]}
//                   isAuthenticated={isLoggedIn}
//                 >
//                   <Settings />
//                 </ProtectedRoute>
//               }
//             />
//           </Route>

//           {/* 404 fallback */}
//           <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//       </Suspense>
//     </BrowserRouter>
//   );
// };

// export default App;

import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./login/Login";
import Register from "./login/RegisterPage";
import Loading from "./utils/Loading";
import NotFoundPage from "./HMS/services/NotFound";
import Settings from "./components/pages/Settings";
import GuestLogin from "./login/Guest-Login";
import GuestMenu from "./HMS/pages/Guest/GuestMenu";
import GuestCheckout from "./HMS/pages/Guest/GuestCheckout";

// Dynamically import module routes
const routeModules = import.meta.glob("./*/AppRoutes.jsx", { eager: true });

const App = () => {
  // Map dynamic routes
  const modules = Object.entries(routeModules).map(([path, mod]) => {
    const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
    const name = match?.[1];
    return {
      name,
      path: `/${name}/*`,
      element: mod.default,
      menuItems: mod[`${name}MenuItems`] || [],
    };
  });

  // Generate menu items for MainLayout
  const menuItems = useMemo(() => {
    return modules.map(({ name, menuItems }) => ({
      key: name,
      label: name.toUpperCase(),
      children: menuItems,
    }));
  }, [modules]);

  return (
    <BrowserRouter>
      <Loading duration={3000} />
      <Suspense
        fallback={
          <div className="p-4">
            <Loading />
          </div>
        }
      >
        <Routes>
          {/* ✅ Public routes (no restrictions) */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/GuestLogin" element={<GuestLogin />} />
          <Route path="/Guest-Menu" element={<GuestMenu />} />
          <Route path="/Guest-Checkout" element={<GuestCheckout />} />

          {/* ✅ All other routes under MainLayout — freely accessible */}
          <Route element={<MainLayout menuItems={menuItems} />}>
            {modules.map(({ name, path, element: Element }) => (
              <Route key={name} path={path} element={<Element />} />
            ))}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ✅ Fallback for undefined routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
