import { Layout, Button, Modal, Spin, Avatar, Tooltip } from "antd";
import { Link, Outlet } from "react-router-dom";

import SidebarMenu from "../component/sidebarMenu.jsx";

import HeaderComp from "../component/header/index.jsx";
import { UserOutlined } from "@ant-design/icons";
import "./styles.scss"; // custom styles

const { Header, Content } = Layout;

const MainLayout = () => {
  
  return (
    <Layout style={{ height: "100vh" }}>
      <SidebarMenu />
      <Layout>
        <HeaderComp />
        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>

      {/* ✅ QR Modal */}
    </Layout>
  );
};

export default MainLayout;
