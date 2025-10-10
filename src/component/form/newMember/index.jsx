import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Select, Tag, Row, Col, Checkbox, DatePicker } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useMemberRegisterMutation } from "../../../service/register";
import { toast } from "react-toastify";
import { useGetMyPlanQuery } from "../../../service/plans/indx";
import moment from "moment";

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
  const [isManual, setIsManual] = useState(false);

  const { data: gymPlan, isLoading } = useGetMyPlanQuery();
  const [trigger, { data: response }] = useMemberRegisterMutation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        userRole: "member",
        planId: values.planId,
        totalAmount: Number(values.totalAmount),
        paidAmount: Number(values.paidAmount),
        paymentMode: values.paymentMode,
        remark: values.remark,
        isManual: isManual,
        manualStartDate: values.manualStartDate ? values.manualStartDate.toISOString() : null,
        manualEndDate: values.manualEndDate ? values.manualEndDate.toISOString() : null,
      };
      await trigger(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.success){
       toast.success(response?.message);
       form.resetFields();
       setIsManual(false);
    }
  }, [response]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        padding: "20px",
        color: "#c9d1d9",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: "#161b22",
          padding: "20px 30px",
          borderRadius: "12px",
          border: "1px solid #30363d",
          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
        }}
      >
        <Title
          level={2}
          style={{ color: "#fff", textAlign: "center", marginBottom: 24 }}
        >
          Member Registration
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Row gutter={16}>
            {/* Left Column */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label={<Text style={{ color: "#c9d1d9" }}>Full Name</Text>}
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Name"
                  size="large"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<Text style={{ color: "#c9d1d9" }}>Email</Text>}
                rules={[
                  { required: true, message: "Enter email" },
                  { type: "email", message: "Enter valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<Text style={{ color: "#c9d1d9" }}>Password</Text>}
                rules={[{ required: true, message: "Enter password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  size="large"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="planId"
                label={<Text style={{ color: "#c9d1d9" }}>Select Plan</Text>}
                rules={[{ required: true, message: "Select a plan" }]}
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
                  onChange={(value) => {
                    const selectedPlan = gymPlan.find((p) => p._id === value);
                    if (selectedPlan) {
                      form.setFieldsValue({ totalAmount: selectedPlan.price });
                    }
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

              {/* Manual Membership Toggle */}
              <Form.Item>
                <Checkbox
                  checked={isManual}
                  onChange={(e) => setIsManual(e.target.checked)}
                  style={{ color: "#c9d1d9" }}
                >
                  Manual Membership Dates
                </Checkbox>
              </Form.Item>

              {isManual && (
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item
                      name="manualStartDate"
                      label={<Text style={{ color: "#c9d1d9" }}>Start Date</Text>}
                      rules={[{ required: true, message: "Select start date" }]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      name="manualEndDate"
                      label={<Text style={{ color: "#c9d1d9" }}>End Date</Text>}
                      rules={[{ required: true, message: "Select end date" }]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Col>

            {/* Right Column */}
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label={<Text style={{ color: "#c9d1d9" }}>Phone Number</Text>}
                rules={[
                  { required: true, message: "Enter phone" },
                  {
                    pattern: /^[0-9+\s()-]{10,}$/,
                    message: "Enter valid number",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Phone"
                  size="large"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="totalAmount"
                label={
                  <Text style={{ color: "#c9d1d9" }}>Total Amount (₹)</Text>
                }
                rules={[{ required: true, message: "Enter total amount" }]}
              >
                <Input
                  type="number"
                  placeholder="Total Amount"
                  size="large"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="paidAmount"
                label={
                  <Text style={{ color: "#c9d1d9" }}>Paid Amount (₹)</Text>
                }
                rules={[{ required: true, message: "Enter paid amount" }]}
              >
                <Input
                  type="number"
                  placeholder="Paid Amount"
                  size="large"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="paymentMode"
                label={<Text style={{ color: "#c9d1d9" }}>Payment Mode</Text>}
                rules={[{ required: true, message: "Select payment mode" }]}
              >
                <Select
                  placeholder="Select Mode"
                  size="large"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                >
                  <Select.Option value="cash">Cash</Select.Option>
                  <Select.Option value="upi">UPI</Select.Option>
                  <Select.Option value="card">Card</Select.Option>
                  <Select.Option value="bank">Bank Transfer</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="remark"
                label={<Text style={{ color: "#c9d1d9" }}>Remark</Text>}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Any remarks"
                  style={{
                    backgroundColor: "#0d1117",
                    borderColor: "#30363d",
                    color: "#c9d1d9",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || isLoading}
              size="large"
              block
              style={{ marginTop: 10, borderRadius: 8, fontWeight: 500 }}
            >
              Register Member
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MemberRegistrationForm;
