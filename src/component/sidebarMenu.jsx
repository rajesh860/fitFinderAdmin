import React, { useState } from "react";
import { Layout, Menu, Avatar, Typography, Grid } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  IdcardOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  LogoutOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const userRole = localStorage.getItem("userRole"); // "admin" or "gym"

  // ------------------------
  // 🔹 ADMIN MENU ITEMS
  // ------------------------
  const adminMenu = [
    { key: "/", icon: <HomeOutlined />, label: "Dashboard", path: "/" },
    {
      key: "gym-management",
      icon: <ShopOutlined />,
      label: "Gym Management",
      children: [
        { key: "/all-gyms", icon: <TeamOutlined />, label: "All Gyms", path: "/all-gyms" },
        { key: "/new-registration", icon: <SolutionOutlined />, label: "New Registrations", path: "/new-registration" },
        { key: "/gym-register", icon: <SolutionOutlined />, label: "Gym Register", path: "/gym-register" },
      ],
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Analytics",
      children: [
        { key: "/revenue", icon: <DollarOutlined />, label: "Revenue Overview", path: "/revenue" },
        { key: "/gym-performance", icon: <TeamOutlined />, label: "Gym Performance", path: "/gym-performance" },
      ],
    },
    {
      key: "enquiry",
      icon: <SafetyCertificateOutlined />,
      label: "Enquiries",
      children: [
        { key: "/enquiry/pending", icon: <CheckCircleOutlined />, label: "Pending Trials", path: "/enquiry/pending" },
        { key: "/enquiry/completed", icon: <CheckCircleOutlined />, label: "Completed Enquiries", path: "/enquiry/completed" },
      ],
    },
    { type: "divider" },
    { key: "/logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  // ------------------------
  // 🔹 GYM MENU ITEMS
  // ------------------------
  const gymMenu = [
    { key: "/", icon: <HomeOutlined />, label: "Dashboard", path: "/" },
    {
      key: "members",
      icon: <UsergroupAddOutlined />,
      label: "Members",
      children: [
        { key: "/members", icon: <TeamOutlined />, label: "All Members", path: "/members" },
        { key: "/members/new", icon: <PlusCircleOutlined />, label: "Add Member", path: "/members/new" },
      ],
    },
    {
      key: "trainers",
      icon: <TeamOutlined />,
      label: "Trainers",
      children: [
        { key: "/trainers", icon: <TeamOutlined />, label: "All Trainers", path: "/trainers" },
        { key: "/trainers/new", icon: <PlusCircleOutlined />, label: "Add Trainer", path: "/trainers/new" },
      ],
    },
    {
      key: "plans",
      icon: <IdcardOutlined />,
      label: "Membership Plans",
      children: [
        { key: "/create-gym-plan", icon: <PlusCircleOutlined />, label: "Create Plan", path: "/create-gym-plan" },
        { key: "/all-plan", icon: <TeamOutlined />, label: "All Plans", path: "/all-plan" },
      ],
    },
    {
      key: "financial",
      icon: <DollarOutlined />,
      label: "Finance",
      children: [
        { key: "/fees-collection", icon: <DollarOutlined />, label: "Fee Collection", path: "/fees-collection" },
        { key: "/transactions", icon: <BarChartOutlined />, label: "Transactions", path: "/transactions" },
      ],
    },
    {
      key: "enquiry",
      icon: <SafetyCertificateOutlined />,
      label: "Enquiries",
      children: [
        { key: "/enquiry/pending", icon: <CheckCircleOutlined />, label: "Pending Trials", path: "/enquiry/pending" },
        { key: "/enquiry/completed", icon: <CheckCircleOutlined />, label: "Completed Enquiries", path: "/enquiry/completed" },
        { key: "/enquiry/booking", icon: <CheckCircleOutlined />, label: "Booking", path: "/enquiry/booking" },
      ],
    },
    { type: "divider" },
    { key: "/logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  // 🧩 Select menu based on role
  const menuItems = userRole === "admin" ? adminMenu : gymMenu;

  // ------------------------
  // 🔹 Helpers
  // ------------------------
  const handleMenuClick = (e) => {
    if (e.key === "/logout") {
      localStorage.clear();
      window.location.replace("/login");
      return;
    }
    const item = findMenuItemByKey(menuItems, e.key);
    if (item && item.path) navigate(item.path);
  };

  const findMenuItemByKey = (items, key) => {
    for (let item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findMenuItemByKey(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const getSelectedKeys = () => {
    const path = location.pathname;
    const item = findMenuItemByKey(menuItems, path);
    return item ? [item.key] : [];
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    for (let item of menuItems) {
      if (item.children) {
        const child = item.children.find((child) => child.key === path);
        if (child) return [item.key];
      }
    }
    return [];
  };

  // ------------------------
  // 🔹 Render Sidebar
  // ------------------------
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={screens.xs ? 0 : 60}
      width={220}
      breakpoint="md"
      onBreakpoint={(broken) => setCollapsed(broken)}
      style={{
        backgroundColor: "#1a1a1a",
        color: "white",
        height: "100vh",
        // position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        overflow: "auto",
      }}
    >
      {/* 🔹 Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "10px 16px",
          height: 64,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="large"
              src="https://xsgames.co/randomusers/avatar.php?g=male"
              style={{ marginRight: 12 }}
            />
            <div>
              <Title level={5} style={{ color: "#fff", margin: 0 }}>
                FitFinder
              </Title>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                {userRole === "admin" ? "Admin" : "Gym"} Dashboard
              </span>
            </div>
          </div>
        )}
        <span
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "#fff", cursor: "pointer", fontSize: 18 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      </div>

      {/* 🔹 Menu */}
      <Menu
        mode="inline"
        theme="dark"
        style={{
          backgroundColor: "#1a1a1a",
          color: "#fff",
          marginTop: 12,
          borderRight: 0,
        }}
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        onClick={handleMenuClick}
        items={menuItems}
        inlineIndent={12}
      />
    </Sider>
  );
};

export default SidebarMenu;
