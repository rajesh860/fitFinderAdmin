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
      label: "Plan",
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
      key: "staff",
      icon: <UserOutlined />,
      label: "Staff Management",
      children: [
        {
          key: "/staff",
          icon: <TeamOutlined />,
          label: "All Staff",
          path: "/staff",
        },
        {
          key: "/staff/roles",
          icon: <SafetyCertificateOutlined />,
          label: "Roles & Permissions",
          path: "/staff/roles",
        },
        {
          key: "/staff/schedule",
          icon: <CalendarOutlined />,
          label: "Staff Schedule",
          path: "/staff/schedule",
        },
      ],
    },
    {
      key: "workouts",
      icon: <BarChartOutlined />,
      label: "Workout Plans",
      children: [
        {
          key: "/workouts",
          icon: <BarChartOutlined />,
          label: "All Plans",
          path: "/workouts",
        },
        {
          key: "/workouts/custom",
          icon: <SolutionOutlined />,
          label: "Custom Plans",
          path: "/workouts/custom",
        },
        {
          key: "/workouts/assign",
          icon: <UsergroupAddOutlined />,
          label: "Assign Plans",
          path: "/workouts/assign",
        },
      ],
    },
    {
      key: "/schedule",
      icon: <ScheduleOutlined />,
      label: "Class Schedule",
      path: "/schedule",
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
      navigate("/login"); // navigate to login page
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
      style={{
        overflow: "auto",
        height: "100vh",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      theme="dark"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "16px 0" : "16px 24px",
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
                John Fitness
              </Title>
              <span
                style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: 12 }}
              >
                Owner
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
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        onClick={handleMenuClick}
        items={menuItems}
        style={{ borderRight: 0, padding: "8px 0", marginTop: 16 }}
      />
    </Sider>
  );
};

export default SidebarMenu;
