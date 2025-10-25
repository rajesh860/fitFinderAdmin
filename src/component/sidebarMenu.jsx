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

  const menuItems = [
    // 🔹 Main Dashboard
    { key: "/", icon: <HomeOutlined />, label: "Dashboard", path: "/" },

    // 🔹 Gym Management (Admin Only)
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
              key: "/new-registration",
              icon: <SolutionOutlined />,
              label: "New Gym Registrations",
              path: "/new-registration",
            },
          ],
        }
      : "",

    // 🔹 Members & Trainers
    {
      key: "members",
      icon: <UsergroupAddOutlined />,
      label: "Users",
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
          label: "Add Member",
          path: "/members/new",
        },
        {
          key: "/trainers/new",
          icon: <PlusCircleOutlined />,
          label: "Add Trainer",
          path: "/trainers/new",
        },
        {
          key: "/trainers",
          icon: <TeamOutlined />,
          label: "All Trainers",
          path: "/trainers",
        },
      ],
    },

    // 🔹 Enquiry Section
    {
      key: "enquiry",
      icon: <SafetyCertificateOutlined />,
      label: "Enquiries",
      children: [
        {
          key: "/enquiry/pending",
          icon: <CheckCircleOutlined />,
          label: "Pending Trials",
          path: "/enquiry/pending",
        },
        {
          key: "/enquiry/completed",
          icon: <CheckCircleOutlined />,
          label: "Completed Enquiries",
          path: "/enquiry/completed",
        },
        {
          key: "/enquiry/booking",
          icon: <CalendarOutlined />,
          label: "Bookings",
          path: "/enquiry/booking",
        },
      ],
    },

    // 🔹 Membership Plans
    {
      key: "plans",
      icon: <IdcardOutlined />,
      label: "Membership Plans",
      children: [
        userRole === "admin"
          ? {
              key: "/create-plan-name",
              icon: <PlusCircleOutlined />,
              label: "Create Plan",
              path: "/create-plan-name",
            }
          : "",
        userRole === "gym"
          ? {
              key: "/create-gym-plan",
              icon: <PlusCircleOutlined />,
              label: "Create Gym Plan",
              path: "/create-gym-plan",
            }
          : "",
        userRole === "gym"
          ? {
              key: "/all-plan",
              icon: <TeamOutlined />,
              label: "All Plans",
              path: "/all-plan",
            }
          : "",
      ],
    },

    // 🔹 Financial Section
    {
      key: "financial",
      icon: <DollarOutlined />,
      label: "Financial",
      children: [
        {
          key: "/fees-collection",
          icon: <DollarOutlined />,
          label: "Fee Collection",
          path: "/fees-collection",
        },
      ],
    },

    // 🔹 Divider & Logout
    { type: "divider" },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "/logout") {
      localStorage.clear();
      window.location.replace("/login");
      return;
    }
    const clickedItem = findMenuItemByKey(menuItems, e.key);
    if (clickedItem && clickedItem.path) navigate(clickedItem.path);
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

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={210}
      collapsedWidth={60}
      style={{
        overflow: "auto",
        height: "100vh",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#1a1a1a",
        color: "white",
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
              <span style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 12 }}>
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
          backgroundColor: "#1a1a1a",
          color: "white",
        }}
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        onClick={handleMenuClick}
        items={menuItems}
        inlineIndent={10}
      />
    </Sider>
  );
};

export default SidebarMenu;
