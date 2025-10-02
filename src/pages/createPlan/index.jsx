import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Tag,
  message,
  Typography,
  Space,
  Breadcrumb,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  useGymCreatePlansMutation,
  useGymPlansQuery,
} from "../../service/plans/indx";
import { toast } from "react-toastify";

const { Option } = Select;
const { Title, Text } = Typography;

const gymFeatures = [
  "Trainer",
  "Diet",
  "Locker",
  "Shower",
  "Parking",
  "Cardio Machines",
  "Weight Training",
  "Free Weights",
  "Yoga Classes",
  "Group Classes",
  "Personal Training",
  "Stretching Area",
  "Wi-Fi",
  "CrossFit Zone",
  "Functional Training",
  "HIIT Classes",
  "Pilates",
  "Barre Classes",
  "Cycling / Spin Classes",
  "Martial Arts",
  "Boxing / Kickboxing",
  "Body Composition Analysis",
  "Health Check",
  "Towel Service",
  "Music / Entertainment System",
  "Swimming Pool",
  "Sauna",
  "Steam Room",
  "Jacuzzi",
  "Spa / Massage / Physiotherapy",
  "Juice / Protein Shake Bar",
  "Premium Locker Rooms",
  "Childcare / Kids Zone",
  "Smart Gym Equipment",
  "App / Online Workout Subscription",
  "Celebrity / Expert Trainer Sessions",
  "Merchandise / Supplements Store",
  "24/7 Access",
  "Lounge / Cafe Area",
  "Cryotherapy / Recovery Equipment",
];

const CreatePlanForm = () => {
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [features, setFeatures] = useState([]);
  const [currentFeature, setCurrentFeature] = useState("");
  const { data: getPlan } = useGymPlansQuery();
  const [trigger, { isLoading, data }] = useGymCreatePlansMutation();

  const handleAddFeature = (feature) => {
    const val = feature || currentFeature;
    if (val && !features.includes(val)) {
      setFeatures([...features, val]);
      setCurrentFeature("");
    } else if (features.includes(val)) {
      message.warning("This feature has already been added.");
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const onFinish = async (values) => {
    try {
      const planData = {
        planId: values.planType,
        price: values.price,
        durationInMonths: values.durationInMonths,
        features,
      };

      await trigger(planData).unwrap();

      message.success("Plan created successfully!");
      form.resetFields();
      setFeatures([]);
      setCurrentFeature("");
    } catch (error) {
      message.error(error?.data?.message || "Error creating plan");
    }
  };

  const plngBg = {
    BASIC: "blue",
    SILVER: "gray",
    GOLD: "gold",
    PLATINUM: "green",
  };

  useEffect(() => {
    if (data?.success) {
      toast.success(data?.message);
    }
  }, [data]);

  return (
    <div style={{ padding: "0px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Title */}
        <h2
          style={{
            margin: 0,
            fontSize: "24px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <UserOutlined style={{ marginRight: 12, color: "#fff" }} />
          Create New Plan
        </h2>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb
            style={{
              color: "#aaa",
              background: "transparent",
              margin: 0,
            }}
          >
            <Breadcrumb.Item href="" style={{ color: "#aaa" }}>
              <HomeOutlined style={{ color: "#aaa" }} />
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ color: "#aaa" }}>Gyms</Breadcrumb.Item>
            <Breadcrumb.Item style={{ color: "#fff" }}>
              All Gyms
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <Card
        style={{
          background: "#0D0D0D",
          borderRadius: 12,
          border: "1px solid #333",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ durationInMonths: 1, price: 29.99 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="planType"
                label={<Text style={{ color: "#fff" }}>Plan Type</Text>}
                rules={[
                  { required: true, message: "Please select a plan type" },
                ]}
              >
                <Select
                  placeholder="Select plan type"
                  dropdownStyle={{ background: "#1f1f1f", color: "#fff" }}
                  style={{ background: "#1f1f1f", color: "#fff" }}
                >
                  {getPlan?.map((plan) => (
                    <Option key={plan._id} value={plan._id}>
                      <Tag color={plngBg[plan?.name]}>{plan.name}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="price"
                label={<Text style={{ color: "#fff" }}>Price ($)</Text>}
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <Input
                  type="number"
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    background: "#1f1f1f",
                    color: "#fff",
                    border: "1px solid #333",
                  }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="durationInMonths"
                label={<Text style={{ color: "#fff" }}>Duration (Months)</Text>}
                rules={[
                  {
                    required: true,
                    message: "Please enter duration in months",
                  },
                ]}
              >
                <Input
                  type="number"
                  min={1}
                  placeholder="Enter duration in months"
                  style={{
                    width: "100%",
                    background: "#1f1f1f",
                    color: "#fff",
                    border: "1px solid #333",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ borderColor: "#444" }}>
            <Text style={{ color: "#fff" }}>Plan Features</Text>
          </Divider>

          <Form.Item
            label={<Text style={{ color: "#fff" }}>Add Features</Text>}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                placeholder="Enter a feature or select from list"
                onPressEnter={() => handleAddFeature()}
                style={{
                  background: "#1f1f1f",
                  color: "#fff",
                  border: "1px solid #333",
                }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAddFeature()}
              >
                Add
              </Button>
            </Space.Compact>

            <Text
              type="secondary"
              style={{ display: "block", marginTop: "8px", color: "#aaa" }}
            >
              Click a feature below to add it
            </Text>

            <div style={{ marginTop: 12 }}>
              {gymFeatures.map((feature, idx) => (
                <Tag
                  key={idx}
                  color={features.includes(feature) ? "green" : "default"}
                  style={{
                    cursor: "pointer",
                    marginBottom: 4,
                    marginRight: 4,
                    background: features.includes(feature)
                      ? "green"
                      : "#1f1f1f",
                    color: features.includes(feature) ? "#fff" : "#fff",
                    border: "1px solid #333",
                  }}
                  onClick={() => handleAddFeature(feature)}
                >
                  {feature}
                </Tag>
              ))}
            </div>
          </Form.Item>

          {features.length > 0 && (
            <Form.Item
              label={<Text style={{ color: "#fff" }}>Selected Features</Text>}
            >
              <div style={{ marginBottom: "16px" }}>
                {features.map((feature, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveFeature(feature)}
                    style={{
                      marginBottom: "8px",
                      padding: "4px 8px",
                      background: "#333",
                      color: "#fff",
                      border: "1px solid #555",
                    }}
                  >
                    {feature}
                  </Tag>
                ))}
              </div>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={isLoading}
              style={{ width: "18%" }}
            >
              Create Plan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePlanForm;
