import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Select,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useMemberRegisterMutation } from "../../../service/register";
import { toast } from "react-toastify";
import { useGetMyPlanQuery } from "../../../service/plans/indx";

const { Title, Text } = Typography;

const plngBg = {
  BASIC: "blue",
  SILVER: "gray",
  GOLD: "gold",
  PLATINUM: "purple",
};

const MemberRegistrationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 🧠 Plans API call
  const { data: gymPlan, isLoading } = useGetMyPlanQuery();
  const [trigger, { data: response }] = useMemberRegisterMutation();

  const onFinish = async (values) => {
   
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        userRole: "member",
        planId: values.planId, // ✅ selected planId bhejna
      };
     trigger(payload)

      // form.resetFields();
    
  };

  useEffect(() => {
    if (response?.success) {
      toast?.success(response?.message);
    }
  }, [response]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        padding: "10px 20px",
        color: "#c9d1d9",
      }}
    >
      <Title
        level={2}
        style={{
          color: "#fff",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
        Member Registration
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#161b22",
          padding: "10px 40px",
          borderRadius: "12px",
          border: "1px solid #30363d",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
        }}
      >
        {/* Name */}
        <Form.Item
          name="name"
          label={<Text style={{ color: "#c9d1d9" }}>Full Name</Text>}
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#8b949e" }} />}
            placeholder="Enter your name"
            size="large"
            style={{
              backgroundColor: "#0d1117",
              borderColor: "#30363d",
              color: "#c9d1d9",
            }}
          />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label={<Text style={{ color: "#c9d1d9" }}>Email Address</Text>}
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#8b949e" }} />}
            placeholder="Enter your email"
            size="large"
            style={{
              backgroundColor: "#0d1117",
              borderColor: "#30363d",
              color: "#c9d1d9",
            }}
          />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label={<Text style={{ color: "#c9d1d9" }}>Phone Number</Text>}
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              pattern: /^[0-9+\s()-]{10,}$/,
              message: "Enter a valid phone number",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: "#8b949e" }} />}
            placeholder="Enter your phone number"
            size="large"
            style={{
              backgroundColor: "#0d1117",
              borderColor: "#30363d",
              color: "#c9d1d9",
            }}
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label={<Text style={{ color: "#c9d1d9" }}>Password</Text>}
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#8b949e" }} />}
            placeholder="Enter your password"
            size="large"
            style={{
              backgroundColor: "#0d1117",
              borderColor: "#30363d",
              color: "#c9d1d9",
            }}
          />
        </Form.Item>

        {/* Plan Select */}
        <Form.Item
          name="planId"
          label={<Text style={{ color: "#c9d1d9" }}>Select Plan</Text>}
          rules={[{ required: true, message: "Please select a plan" }]}
        >
          <Select
            placeholder="Select Plan"
            size="large"
            loading={isLoading}
            style={{
              backgroundColor: "#0d1117",
              borderColor: "#30363d",
              color: "#c9d1d9",
            }}
          >
            {gymPlan?.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                <Tag color={plngBg[item.planName]}>
                  {item.planName} - ₹{item.price} ({item.durationInMonths} month)
                </Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
            block
            style={{
              marginTop: "10px",
              borderRadius: "8px",
              fontWeight: "500",
            }}
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MemberRegistrationForm;
