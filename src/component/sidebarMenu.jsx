import React, { useState } from "react";
import { Layout, Menu, Avatar, Typography } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  LogoutOutlined,
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
  PieChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Title } = Typography;

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const userRole = localStorage.getItem("userRole");

  // Menu items for gym owner dashboard with corrected icons
  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: "Dashboard", path: "/" },
    userRole === "admin"
      ? {
          key: "gym-management",
          icon: <ShopOutlined />,
          label: "Gym Management",
          children: [
            {
              key: "/all-gyms",
              icon: <TeamOutlined />,
              label: "All Gyms",
              path: "/all-gyms",
            },
            {
              key: "/pending-gyms",
              icon: <SolutionOutlined />,
              label: "New Registration",
              path: "/new-registration",
            },
          ],
        }
      : "",
    {
      key: "members",
      icon: <UsergroupAddOutlined />,
      label: "Members",
      children: [
        {
          key: "/members",
          icon: <TeamOutlined />,
          label: "All Members",
          path: "/users",
        },
        {
          key: "/members/new",
          icon: <PlusCircleOutlined />,
          label: "Add New Member",
          path: "/members/new",
        },
        {
          key: "/members/checkins",
          icon: <CheckCircleOutlined />,
          label: "Check-ins",
          path: "/members/checkins",
        },
      ],
    },
    {
      key: "enquiry",
      icon: <UsergroupAddOutlined />,
      label: "Enquiry",
      children: [
        {
          key: "/enquiry/pending",
          icon: <CheckCircleOutlined />,
          label: "Trial Enquiry",
          path: "/enquiry/pending",
        },
        {
          key: "/enquiry/completed",
          icon: <CheckCircleOutlined />,
          label: "Enquiry Completed",
          path: "/enquiry/completed",
        },
        {
          key: "/enquiry/booking",
          icon: <CheckCircleOutlined />,
          label: "Booking",
          path: "/enquiry/booking",
        },
      ],
    },
    {
      key: "plan",
      icon: <IdcardOutlined />,
      label: "Membership Plan",
      children: [
        {
          key: "/create-gym-plan",
          icon: <PlusCircleOutlined />,
          label: "Create Gym Plan",
          path: "/create-gym-plan",
        },
        {
          key: "/all-plan",
          icon: <PlusCircleOutlined />,
          label: "All Plan",
          path: "/all-plan",
        },
      ],
    },
    {
      key: "financial",
      icon: <DollarOutlined />,
      label: "Financial",
      children: [
        {
          key: "/fees",
          icon: <DollarOutlined />,
          label: "Fee Collection",
          path: "/fees",
        },
        {
          key: "/subscriptions",
          icon: <SolutionOutlined />,
          label: "Subscriptions",
          path: "/subscriptions",
        },
        {
          key: "/expenses",
          icon: <DollarOutlined />,
          label: "Expenses",
          path: "/expenses",
        },
        {
          key: "/reports",
          icon: <PieChartOutlined />,
          label: "Financial Reports",
          path: "/reports",
        },
      ],
    },

    {
      key: "/reports",
      icon: <FileTextOutlined />,
      label: "Reports & Analytics",
      path: "/reports",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      path: "/settings",
    },
    {
      type: "divider",
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      // path: '/logout'
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "/logout") {
      // ✅ Logout logic
      localStorage.clear(); // clear all local storage
   window.location.replace("/login");
      return;
    }

    const clickedItem = findMenuItemByKey(menuItems, e.key);
    if (clickedItem && clickedItem.path) navigate(clickedItem.path);
  };

  // Recursive function to find menu item by key (nested support)
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

  // Get the selected keys based on current path
  const getSelectedKeys = () => {
    const path = location.pathname;
    const item = findMenuItemByKey(menuItems, path);
    return item ? [item.key] : [];
  };

  // Get the open submenus based on current path
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

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={210} // ✅ Main expanded width
      collapsedWidth={60} // ✅ When collapsed, keep mini sidebar (icons visible)
      style={{
        overflow: "auto",
        height: "100vh",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#1a1a1a", // ✅ Dark background
        color: "white", // ✅ Text color white
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "16px 0" : "10px 10px",
          height: 64,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
              <Title level={5} style={{ color: "white", margin: 0 }}>
                Fit Finder
              </Title>
              <span
                style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 12 }}
              >
                Admin Dashboard
              </span>
            </div>
          </div>
        )}
        <span
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "white", cursor: "pointer", fontSize: 16 }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      </div>

      <Menu
        mode="inline"
        theme="dark"
        style={{
          borderRight: 0,
          padding: "8px 0",
          marginTop: 16,
          backgroundColor: "#1a1a1a", // ✅ Match sidebar bg
          color: "white", // ✅ White text
        }}
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        onClick={handleMenuClick}
        items={menuItems}
        inlineIndent={10} // default is 24 → reduced
      />
    </Sider>
  );
};

export default SidebarMenu;
