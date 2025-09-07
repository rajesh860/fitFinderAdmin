import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SidebarMenu from '../component/sidebarMenu.jsx';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  return (
    // <Layout style={{ height: "100vh" }}>
    //   <Header style={{ color: "white", fontSize: 20 }}>Header</Header>
      
    //   <Layout>
    //     <Content style={{ padding: '20px' }}>
    //       <Outlet />
    //     </Content>
    //   </Layout>
    // </Layout>

       <Layout style={{ height: "100vh" }}>
       <SidebarMenu />
      <Layout>
        <Header >Header</Header>
        <Content style={{height:"100%",overflowY:"scroll"}}><Outlet/></Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
