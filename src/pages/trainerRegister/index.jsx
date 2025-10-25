import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useTrainerRegisterMutation } from "../../service/register";
import { toast } from "react-toastify";
import "./styles.scss";
const TrainerRegisterForm = () => {
  const [form] = Form.useForm();
  const [registerTrainer, { isLoading }] = useTrainerRegisterMutation();

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values, userRole: "trainer" };
      const response = await registerTrainer(payload).unwrap();

      if (response?.success) {
        // ✅ Show backend message
        toast.success(response.message || "Trainer registered successfully!");
        form.resetFields();
      } else {
        toast.error(response?.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
     
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#1a1a1a",
        // padding: 50,
      }}
    >
      <Card
        title="Trainer Registration"
        style={{
          maxWidth: 500,
          width: "100%",
          backgroundColor: "#141414",
          color: "#fff",
          borderRadius: 8,
        }}
        headStyle={{ color: "#fff",fontSize:"34px",textAlign:"center",paddingBlock:"10px", borderBottom: "1px solid #333" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: "", email: "", phone: "", password: "" }}
        >
          <Form.Item
            label={<span style={{ color: "#fff" }}>Full Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input
              placeholder="John Doe"
              className="dark-input"
              style={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                borderColor: "#333",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Email</span>}
            name="email"

            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input
              placeholder="john@example.com"
                className="dark-input"
              style={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                borderColor: "#333",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Phone</span>}
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input
              className="dark-input"
              placeholder="987654****"
              style={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                borderColor: "#333",
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password
              placeholder="Password"
                className="dark-input"
              style={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                borderColor: "#333",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Register as Trainer
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TrainerRegisterForm;
