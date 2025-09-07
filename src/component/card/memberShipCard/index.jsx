import React, { useState } from "react";
import { Card, Tag, Button, Modal, Form, Input, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

// Plan ke icons ke liye colors
const planStyles = {
  Basic: { bg: "linear-gradient(135deg, #D3D3D3, #A9A9A9)", icon: "⭐" },
  Silver: { bg: "linear-gradient(135deg, #C0C0C0, #A9A9A9)", icon: "🥈" },
  Gold: { bg: "linear-gradient(135deg, #FFD43B, #FFA500)", icon: "👑" },
  Platinum: { bg: "linear-gradient(135deg, #E5E4E2, #B0C4DE)", icon: "💎" },
};

// Features ke tags ke liye color mapping
const featureColors = {
  0: { color: "#E6F4EA", text: "#137333" },
  1: { color: "#E8F0FE", text: "#1A73E8" },
  2: { color: "#F3E8FD", text: "#9334E6" },
  3: { color: "#FEF3E2", text: "#C06A00" },
};

const MembershipCard = ({  data}) => {
  const {planName:title, price, durationInMonths:duration, features, created_at:createdDate } = data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const style = planStyles[title] || {
    bg: "linear-gradient(135deg, #ccc, #999)",
    icon: "📦",
  };

  // Edit button pe current data form me load karna
  const handleEdit = () => {
    form.setFieldsValue({
      title,
      price,
      duration,
      features,
    });
    setIsModalOpen(true);
  };

  // Save changes
  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log("Edited Values:", values);
      setIsModalOpen(false);
      // 👆 yaha API call ya parent state update kar sakte ho
    });
  };
  // Duration ko Month → Year/Month format me convert
  const formatDuration = (months) => {
    if (!months) return "";
    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remMonths = months % 12;
      return remMonths > 0 ? `${years} Year ${remMonths} Month` : `${years} Year`;
    }
    return `${months} Month`;
  };
  return (
    <>
      <Card
        style={{
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          position: "relative",
        }}
        bodyStyle={{ padding: 12 }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: style.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {style.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#000" }}>
              {title}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00A86B" }}>
              {"₹" + price}
            </div>
          </div>

          <Tag
            color="#FFF3BF"
            style={{
              position: "absolute",
              right: 0,
              top: 5,
              color: "#6B4E00",
              fontWeight: 500,
              borderRadius: 20,
              padding: "4px 10px",
            }}
          >
        {formatDuration(duration)}
          </Tag>
        </div>

        {/* Features */}
      {/* Features */}
<div
  style={{
    marginTop: 18,
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    maxHeight: 63, // 2 rows approx height (24px each row)
    overflow: "hidden",
    position: "relative",
    marginBottom:18
  }}
>
  {features.map((feature, index) => {
    // ✅ Generate random number 0-3
    const randomIndex = Math.floor(Math.random() * 4); // 0,1,2,3
    const fc = featureColors[randomIndex];

    return (
      <Tag
        key={feature}
        style={{
          borderRadius: 20,
          padding: "4px 12px",
          fontWeight: 500,
          margin: 0,
          background: fc.color,
          color: fc.text,
          border: "none",
        }}
      >
        {feature}
      </Tag>
    );
  })}

  {/* Overlay for ... if overflow */}
  {features.length > 4 && ( // approx 2 rows me 4-5 features fit
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        padding: "0 6px",
        background: "white",
        fontWeight: 500,
      }}
    >
      ...
    </div>
  )}
</div>


    

        {/* Edit Button */}
        <div style={{ marginTop: 16, textAlign: "right",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              Created: <span style={{ fontWeight: 500 }}>{moment(createdDate).format("DD-MM-YYYY")}</span>
              </div>  
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            style={{
              borderRadius: 8,
              background: "#009F5D",
              fontWeight: 500,
              padding: "0 20px",
            }}
          >
            Edit
          </Button>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Membership Plan"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Plan Title"
            rules={[{ required: true, message: "Please enter plan title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="features" label="Features">
            <Select
              mode="multiple"
              options={Object.keys(featureColors).map((f) => ({
                label: f,
                value: f,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MembershipCard;
