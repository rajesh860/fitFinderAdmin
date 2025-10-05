import React, { useEffect } from "react";
import { Form, Button, Card, ConfigProvider, Select, Tag } from "antd";
import { useCreatePlaneNameMutation } from "../../service/plans/indx";
import { toast } from "react-toastify";

const { Option } = Select;

const tagColors = {
  BASIC: "blue",
  SILVER: "gray",
  GOLD: "gold",
  PLATINUM: "purple",
};

const CreatePlanName = () => {
  const [form] = Form.useForm();
  const [trigger, { data, isLoading: loading }] = useCreatePlaneNameMutation();

  const handleSubmit = (values) => {
    const { planType } = values;
    trigger({ name: planType });
  };

  useEffect(() => {
    if (data?.success) {
      toast.success(data?.message || "Plan created successfully!");
      form.resetFields();
    }
  }, [data]);

  // Tag rendering function (UI chip look)
  const tagRender = (props) => {
    const { label, value } = props;
    return (
      <Tag color={tagColors[value] || "default"} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: "#141414",
          colorTextBase: "#ffffff",
          colorPrimary: "#1677ff",
          borderRadius: 8,
        },
      }}
    >
      <div style={styles.page}>
        <Card
          title={<span style={{ color: "#fff" }}>Create Plan</span>}
          bordered={false}
          style={styles.card}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            {/* ✅ Plan Type Dropdown (tag look) */}
            <Form.Item
              label={<span style={{ color: "#ddd" }}>Select Plan Type</span>}
              name="planType"
              rules={[{ required: true, message: "Please select a plan type!" }]}
            >
              <Select
                placeholder="Select plan type"
                tagRender={tagRender}
                style={{ backgroundColor: "#1f1f1f", color: "#fff" }}
                dropdownStyle={{ backgroundColor: "#1f1f1f" }}
              >
                <Option value="BASIC">BASIC</Option>
                <Option value="SILVER">SILVER</Option>
                <Option value="GOLD">GOLD</Option>
                <Option value="PLATINUM">PLATINUM</Option>
              </Select>
            </Form.Item>

            {/* ✅ Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ borderRadius: 6 }}
              >
                Create
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default CreatePlanName;

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000",
    padding: "40px",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  card: {
    width: 400,
    backgroundColor: "#1a1a1a",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
};
