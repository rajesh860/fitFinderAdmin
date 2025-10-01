import React, { useEffect } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import {useLoginMutation} from "../../service/auth/index"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;

const LoginPage = () => {
  const nav = useNavigate()
  
  const [trigger,{data}]= useLoginMutation()


  const onFinish = (values) => {
    console.log("Login Data:", values);
    trigger(values)
  };
useEffect(()=>{
if(data?.token){
toast.success(data?.message)
localStorage.setItem("token",data?.token)
localStorage.setItem("userRole",data?.user?.userRole)
nav("/")
}else{
  toast.error(data?.message)
}
},[data])
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1558611848-73f7eb4001a1')", // Gym background
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "35px 25px",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 25 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1046/1046769.png" // Dumbbell Icon
            alt="Gym Logo"
            style={{ width: 70, marginBottom: 10 }}
          />
          <Title level={3} style={{ color: "#fff", marginBottom: 5 }}>
            Gym Admin Panel
          </Title>
          <Text style={{ color: "#bbb" }}>
            Sign in to manage your CRM dashboard
          </Text>
        </div>

        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={<span style={{ color: "#ddd" }}>Email</span>}
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#888" }} />}
              placeholder="Enter admin email"
              size="large"
              style={{
                borderRadius: "8px",
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid #333",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#ddd" }}>Password</span>}
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#888" }} />}
              placeholder="Enter password"
              size="large"
              style={{
                borderRadius: "8px",
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid #333",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              icon={<LoginOutlined />}
              style={{
                borderRadius: "8px",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                background: "#ff4d4f",
                border: "none",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Text style={{ color: "#888" }}>
            Forgot your password? <a href="#" style={{ color: "#ff7875" }}>Reset</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;



