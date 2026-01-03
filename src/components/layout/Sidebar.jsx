import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import topLogo from "../assets/HotelLogo.png";
import company from "../assets/Company_logo.png";
import logo from "../assets/Dark Logo.png";
import { useTheme } from "../../context/ThemeContext";
import { FiHome } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import {
  AiOutlineFileText,
  AiOutlineCreditCard,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineTable,
  AiOutlineTool,
} from "react-icons/ai";
import { FaPercentage } from "react-icons/fa";


const Sidebar = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, primaryColor, sidebarBgColor } = useTheme();

  const [hoveredKey, setHoveredKey] = useState(null);

  // const menuItems = [
  //   { key: "/HMS/AdminDashboard", label: "Dashboard", icon: <FiHome /> },
  //   { key: "/HMS/KitchenDashboard", label: "Kitchen Dashboard", icon: <AiOutlineCreditCard /> },
  //   { key: "/HMS/Menus", label: "Food Menu", icon: <FaUtensils /> },
  //   { key: "/HMS/Category", label: "Category", icon: <MdCategory /> },
  //   { key: "/HMS/Reportpage", label: "Reports", icon: <AiOutlineFileText /> },
  //   { key: "/HMS/TaxPage", label: "Tax", icon: <FaPercentage /> },
  //   {
  //     key: "settings",
      
  //     label: "Settings",
  //     icon: <AiOutlineSetting />,
  //     children: [
  //       { key: "/HMS/ProfilePage", label: "Profile Page", icon: <AiOutlineUser /> },
  //       { key: "/HMS/TableMaster", label: "Table Master", icon: <AiOutlineTable /> },
  //       { key: "/HMS/Settings", label: "System Settings", icon: <AiOutlineTool /> },
  //     ],
  //   },
  // ];
  const menuItems = [
  { key: "/HMS/AdminDashboard", label: "Dashboard", icon: <FiHome /> },
  { key: "/HMS/KitchenDashboard", label: "Kitchen Dashboard", icon: <AiOutlineCreditCard /> },
  { key: "/HMS/Menus", label: "Food Menu", icon: <FaUtensils /> },
  { key: "/HMS/Category", label: "Category", icon: <MdCategory /> },
  { key: "/HMS/ReportPage", label: "Reports", icon: <AiOutlineFileText /> }, // ✅ fixed
  { key: "/HMS/TaxPage", label: "Tax", icon: <FaPercentage /> },
  {
    key: "settings",
    label: "Settings",
    icon: <AiOutlineSetting />,
    children: [
      { key: "/HMS/ProfilePage", label: "Profile Page", icon: <AiOutlineUser /> },
      // remove or add TableMaster only if you create a route for it
      { key: "/HMS/settings", label: "System Settings", icon: <AiOutlineTool /> }, // ✅ fixed
    ],
  },
];

  const getMenuItemStyles = (itemKey) => {
    const isActive = pathname.startsWith(itemKey);
    const isHovered = hoveredKey === itemKey;
    const highlight = isActive || isHovered;

    return {
      padding: collapsed ? "0.5rem" : "0.5rem 1rem",
      margin: "0.25rem 0.5rem",
      borderRadius: "0.4rem",
      display: "flex",
      alignItems: "center",
      fontSize: collapsed ? "0.875rem" : "1rem",
      fontWeight: 500,
      backgroundColor: highlight
        ? theme === "dark"
          ? "#374151"
          : "#e5e7eb"
        : "transparent",
      color: highlight
        ? theme === "dark"
          ? "#ffffff"
          : primaryColor
        : theme === "dark"
          ? "#d1d5db"
          : "#374151",
      transition: "all 0.25s ease-in-out",
    };
  };

  return (
    <div
      style={{
        height: "100vh",
        width: collapsed ? "60px" : "230px",
        backgroundColor: theme === "dark" ? "#1f2937" : sidebarBgColor,
        boxShadow: "2px 0 5px rgba(0,0,0,0.06)",
        paddingTop: "0.5rem",
        position: "relative",
        transition: "width 0.3s ease-in-out",
      }}
    >
      {/* Top Logo (Just Display) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: collapsed ? "1rem" : "0.5rem",
        }}
      >
        <img
          src={topLogo}
          alt="Top Logo"
          style={{
            width: collapsed ? "90px" : "130px",
            height: "auto",
            objectFit: "contain",
            imageRendering: "auto",
            display: "block",
          }}
        />

      </div>

      {/* Menu Items */}
      <div style={{ padding: "0.5rem", height: "calc(100% - 140px)" }}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            style={getMenuItemStyles(item.key)}
            onMouseEnter={() => setHoveredKey(item.key)}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={() => navigate(item.key)}
          >
            <span style={{ marginRight: collapsed ? "0" : "0.5rem" }}>
              {item.icon}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Bottom Company Logo */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={collapsed ? logo : company}
          alt="Company Logo"
          style={{
            width: collapsed ? "60px" : "100px",
            height: collapsed ? "50px" : "50px",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
