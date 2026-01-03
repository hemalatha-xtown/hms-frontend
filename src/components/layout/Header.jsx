import { BellOutlined, UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Dropdown, Button, Badge, message } from "antd";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const HeaderBar = ({ collapsed, toggleCollapsed }) => {
  const { theme, headerBgColor, headerGradient } = useTheme();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      message.success("Logged out");
      navigate("/");
    } else if (key === "profile") {
      navigate("/HMS/ProfilePage");
    }
  };

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  const isGradient = headerGradient && headerGradient.includes("gradient");
  const textColor = theme === "dark" || isGradient ? "text-white" : "text-black";
  const headerStyle = isGradient ? { background: headerGradient } : { backgroundColor: headerBgColor || "#ffffff" };

  return (
    <div
      className="flex justify-between items-center shadow-md px-6"
      style={{ ...headerStyle, height: 64, position: "sticky", top: 0, zIndex: 99, userSelect: "none", cursor: "default" }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: 20, color: "white" }} /> : <MenuFoldOutlined style={{ fontSize: 20, color: "white" }} />}
        onClick={toggleCollapsed}
        className="ml-4"
        style={{ cursor: "default" }}
      />

      <div className="flex-1 text-center">
        <h1 className={`text-xl font-bold tracking-wide ${textColor}`} style={{ fontFamily: "'Playfair Display', serif", letterSpacing: 1 }}>
          SRI KRISHNA BHAVAN
        </h1>
        <h4 className={`text-sm font-bold tracking-wide ${textColor}`} style={{ fontFamily: "'Playfair Display', serif", opacity: 0.85, letterSpacing: 1 }}>
          BLESSED FLAVOURS OF KRISHNA'S KITCHEN
        </h4>
      </div>
      {/* <div className="flex items-center gap-4"
      style={{ display: "flex", justifyContent: "flex-end", padding: "10px" , color: "white"}}>
        <NotificationBell />
      </div> */}

      <div className="flex items-center gap-4">
        {/* Navigate to notifications page */}
        {/* <Badge dot>
          <Button type="text" icon={<BellOutlined style={{ fontSize: 18, color: "white" }} />} onClick={() => navigate("/notifications")} />
        </Badge> */}

        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight" trigger={["click"]}>
          <Button type="text" shape="circle" icon={<UserOutlined style={{ color: "white", fontSize: 18 }} />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default HeaderBar;
