import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useGymRegisterMutation } from "../../service/admin";

const GymRegister = () => {
  const [form] = Form.useForm();
  const [registerGym, { isLoading }] = useGymRegisterMutation();

  const onFinish = async (values) => {
    const payload = {
      name: values.name.trim(),
      email: values.email,
      phone: values.phone,
      password: values.password,
      userRole: "gym",
      gymName: values.gymName,
    };

    try {
      const res = await registerGym(payload).unwrap();
      message.success(res.message || "Gym registered successfully!");
      form.resetFields();
    } catch (err) {
      message.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        // background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 400,
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 12,
          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
        }}
        title={<h2 style={{ color: "#fff", textAlign: "center" }}>Gym Registration</h2>}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label={<span style={{ color: "#fff" }}>Full Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Gym Name</span>}
            name="gymName"
            rules={[{ required: true, message: "Please enter your gym name" }]}
          >
            <Input placeholder="Enter gym name" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Phone</span>}
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{
                background: "#1677ff",
                borderRadius: 8,
                height: 45,
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Register Gym
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default GymRegister;
