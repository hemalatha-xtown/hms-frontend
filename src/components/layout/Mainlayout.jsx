// MainLayout.jsx
import {
  Layout,
  ConfigProvider,
  Drawer,
  Button,
  Radio,
  Tabs,
  Tooltip,
  Card,
} from "antd";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import HeaderBar from "./Header";
import {
  SettingOutlined,
  CheckOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { SketchPicker } from "react-color";
import { useTheme } from "../../context/ThemeContext";
import AppFooter from "./Footer";

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const MainLayout = ({ menuItems }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");

  const {
    theme,
    setTheme,
    layoutType,
    primaryColor,
    setPrimaryColor,
    contentBgColor,
    setContentBgColor,
    headerBgColor,
    headerGradient,
    setHeaderGradient,
    sidebarBgColor,
    setSidebarBgColor,
    footerBgColor,
    setFooterBgColor,
    resetTheme,
    commonColorSchemes,
    applyCommonColorScheme,
    createGradientFromColor,
  } = useTheme();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const openSettings = () => setSettingsVisible(true);
  const closeSettings = () => setSettingsVisible(false);

  const updateGradient = (c1, c2) => {
    const gradient = `linear-gradient(to right, ${c1}, ${c2})`;
    setHeaderGradient(gradient);
  };

  // Function to close submenu
  const closeSubMenu = () => setSelectedParent(null);

  const handleContentClick = () => {
    if (selectedParent) closeSubMenu();
  };

  const handleGradientSelect = (gradient) => setHeaderGradient(gradient);

  const predefinedGradients = [
    { name: "Violet to Purple", value: "linear-gradient(to right, #8e2de2, #4a00e0)" },
    { name: "Blue to Purple", value: "linear-gradient(to right, #4facfe, #00f2fe)" },
    { name: "Green to Blue", value: "linear-gradient(to right, #43cea2, #185a9d)" },
    { name: "Orange to Red", value: "linear-gradient(to right, #ff8008, #ffc837)" },
    { name: "Pink to Orange", value: "linear-gradient(to right, #ff6a88, #ff99ac)" },
  ];

  const toggleColorPicker = (pickerName) => {
    setActiveColorPicker(activeColorPicker === pickerName ? null : pickerName);
  };

  const handlePrimaryColorChange = (color) => setPrimaryColor(color.hex);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: primaryColor },
      }}
    >
      <Layout
        className="min-h-screen"
        style={{
          maxWidth: layoutType === "boxed" ? "1200px" : "100%",
          margin: layoutType === "boxed" ? "0 auto" : 0,
        }}
      >
        {/* SINGLE SIDEBAR (Removed Nested Sider) */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={200}
          collapsedWidth={60}
          theme={theme}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
            backgroundColor: theme === "dark" ? "#001529" : sidebarBgColor,
          }}
        >
          <Sidebar collapsed={collapsed} />
        </Sider>

        {/* MAIN CONTENT LAYOUT */}
        <Layout
          style={{
            marginLeft: collapsed ? 60 : 200,
            transition: "margin-left 0.3s ease",
            backgroundColor: contentBgColor,
          }}
        >
          <HeaderBar
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
            closeSubMenu={closeSubMenu}
          />

          <div className="fixed bottom-5 right-5 z-50">
            <Tooltip title="Customize Theme">
              <Button
                type="primary"
                shape="circle"
                icon={<SettingOutlined spin />}
                onClick={openSettings}
                size="large"
              />
            </Tooltip>
          </div>

          <Content
            style={{
              padding: "6px",
              backgroundColor: contentBgColor,
              minHeight: "calc(100vh - 112px)",
              overflow: "auto",
              position: "relative",
            }}
            onClick={handleContentClick}
          >
            <div className="bg-white rounded-lg shadow p-6 min-h-full">
              <Outlet />
            </div>
          </Content>

          <AppFooter
            theme={theme}
            bgColor={theme === "dark" ? "#001529" : footerBgColor}
          />
        </Layout>

        {/* SETTINGS DRAWER */}
        <Drawer
          title={
            <div className="flex items-center">
              <SettingOutlined className="mr-2" />
              <span>Theme Settings</span>
            </div>
          }
          placement="right"
          closable
          onClose={closeSettings}
          open={settingsVisible}
          width={340}
          styles={{ body: { padding: "16px" } }}
          footer={
            <div className="flex justify-between">
              <Button onClick={resetTheme}>Reset to Default</Button>
              <Button type="primary" onClick={closeSettings}>
                Apply Changes
              </Button>
            </div>
          }
        >
          {/* TABS INSIDE DRAWER */}
          <Tabs defaultActiveKey="theme" centered>
            <TabPane tab="Theme" key="theme" className="px-2">
              {/* Theme Selector */}
              <div className="mb-6">
                <h4 className="text-base font-medium mb-3">Color Mode</h4>
                <Radio.Group
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  buttonStyle="solid"
                  className="w-full flex"
                >
                  <Radio.Button value="light" className="flex-1 text-center">
                    Light
                  </Radio.Button>
                  <Radio.Button value="dark" className="flex-1 text-center">
                    Dark
                  </Radio.Button>
                </Radio.Group>
              </div>

              {/* Common Color Schemes */}
              <div className="mb-6">
                <h4 className="text-base font-medium mb-3">
                  Common Color Schemes
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {commonColorSchemes.map((scheme, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded hover:border-primary "
                      onClick={() => applyCommonColorScheme(index)}
                    >
                      <div className="flex items-center">
                        <div className="flex">
                          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: scheme.headerBgColor }} />
                          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: scheme.sidebarBgColor }} />
                          <div className="w-4 h-4 rounded-sm mr-1" style={{ backgroundColor: scheme.contentBgColor }} />
                          <div className="w-4 h-4 rounded-sm mr-3" style={{ backgroundColor: scheme.footerBgColor }} />
                        </div>
                        <span>{scheme.name}</span>
                      </div>
                      <CheckOutlined
                        className={`${
                          headerBgColor === scheme.headerBgColor &&
                          sidebarBgColor === scheme.sidebarBgColor &&
                          contentBgColor === scheme.contentBgColor &&
                          footerBgColor === scheme.footerBgColor
                            ? "visible"
                            : "invisible"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Color Picker */}
              <div className="mb-6">
                <h4 className="text-base font-medium mb-3">Custom Colors</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div
                    className="flex justify-between items-center p-3 border rounded hover:border-primary"
                    onClick={() => toggleColorPicker("primary")}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: primaryColor }} />
                      <span>Primary Color</span>
                    </div>
                    <BgColorsOutlined />
                  </div>
                  {activeColorPicker === "primary" && (
                    <div className="mt-2 mb-4">
                      <SketchPicker
                        color={primaryColor}
                        onChangeComplete={handlePrimaryColorChange}
                        width="100%"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
};
export default MainLayout;
// MainLayout.jsx
// MainLayout.jsx
